/**
 * IIIT-BH Dining — Campus Mess & Catering Management Server
 * Production Node.js + Express.js Backend with Persistent JSON Storage
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function readDB() {
  if (!fs.existsSync(DB_PATH)) return {};
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDB(data) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// Get full state
app.get('/api/state', (req, res) => {
  res.json(readDB());
});

// Sync full state from client
app.post('/api/sync', (req, res) => {
  if (req.body && req.body.caterers) {
    writeDB(req.body);
    return res.json({ ok: true });
  }
  res.status(400).json({ error: 'Invalid state payload' });
});

// Role-based Login (Student or Caterer)
app.post('/api/auth/login', (req, res) => {
  const { role, id, vendor } = req.body;
  const db = readDB();
  if (role === 'caterer') {
    db.portalMode = 'caterer';
    db.loggedCaterer = vendor || 'ground';
    writeDB(db);
    return res.json({ ok: true, portalMode: 'caterer', caterer: db.caterers[db.loggedCaterer] });
  }
  db.portalMode = 'student';
  if (id) db.currentStudent.id = id;
  writeDB(db);
  res.json({ ok: true, portalMode: 'student', student: db.currentStudent });
});

// Update Menu & Nutritional Macros (Caterer)
app.put('/api/caterers/:catererId/menu/:day', (req, res) => {
  const db = readDB();
  const cat = db.caterers && db.caterers[req.params.catererId];
  if (!cat) return res.status(404).json({ error: 'Caterer not found' });
  const dayEntry = cat.menu.find(m => m.day.toLowerCase() === req.params.day.toLowerCase());
  if (!dayEntry) return res.status(404).json({ error: 'Day not found' });
  Object.assign(dayEntry, req.body);
  writeDB(db);
  res.json(dayEntry);
});

// Publish or Remove Special Menu Notice
app.post('/api/notices', (req, res) => {
  const db = readDB();
  const notice = { id: 'NOT-' + Math.floor(100 + Math.random() * 900), date: 'Today', ...req.body };
  db.notices = [notice, ...(db.notices || [])];
  writeDB(db);
  res.status(201).json(notice);
});

app.delete('/api/notices/:id', (req, res) => {
  const db = readDB();
  db.notices = (db.notices || []).filter(n => n.id !== req.params.id);
  writeDB(db);
  res.json({ ok: true });
});

// Issue & Verify Coupons
app.post('/api/coupons', (req, res) => {
  const db = readDB();
  const coupon = { id: 'CPN-' + Math.floor(1000 + Math.random() * 9000), timestamp: 'Today', ...req.body };
  db.coupons = [coupon, ...(db.coupons || [])];
  writeDB(db);
  res.status(201).json(coupon);
});

// Submit & Approve Leaves / Refunds
app.post('/api/leaves', (req, res) => {
  const db = readDB();
  const leave = { id: 'LVE-' + Math.floor(300 + Math.random() * 600), status: 'Pending', ...req.body };
  db.leaves = [leave, ...(db.leaves || [])];
  writeDB(db);
  res.status(201).json(leave);
});

app.patch('/api/leaves/:id', (req, res) => {
  const db = readDB();
  const rec = (db.leaves || []).find(l => l.id === req.params.id);
  if (!rec) return res.status(404).json({ error: 'Leave claim not found' });
  rec.status = req.body.status || 'Approved';
  if (rec.status === 'Approved') {
    db.walletBalance = Number(db.walletBalance || 0) + Number(rec.amount || 0);
  }
  writeDB(db);
  res.json(rec);
});

// Submit & Resolve Complaints / Feedback
app.post('/api/complaints', (req, res) => {
  const db = readDB();
  const ticket = { id: 'TKT-' + Math.floor(400 + Math.random() * 500), status: 'Open', date: 'Today', ...req.body };
  db.complaints = [ticket, ...(db.complaints || [])];
  writeDB(db);
  res.status(201).json(ticket);
});

app.patch('/api/complaints/:id', (req, res) => {
  const db = readDB();
  const ticket = (db.complaints || []).find(c => c.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  ticket.reply = req.body.reply || ticket.reply;
  ticket.status = req.body.status || 'Resolved';
  writeDB(db);
  res.json(ticket);
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`IIIT-BH Dining Server live at http://localhost:${PORT}`);
});
