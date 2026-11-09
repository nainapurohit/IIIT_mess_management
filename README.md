# IIIT Bhubaneswar Hostel Mess Management System (CS124 IWT)

Complete full-stack web application built using the **7th Semester IT (CS124: Internet and Web Technology)** syllabus tech stack:
- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript (ES6+, DOM/BOM, Closures, Async/Await), AJAX (`fetch`), Chart.js
- **Data Formats**: JSON (`data/db.json`) & Validated XML + DTD (`public/menu.xml`)
- **Backend**: Node.js + Express.js (`server.js`) with File System (`fs`) database persistence

## Grounded IIIT Bhubaneswar Mess Data
- **Campus**: Gothapatana, Malipada, Bhubaneswar, Odisha — Phone: `(751) 003-4634`
- **Ground Floor Caterer**: P. Siva Prasad Caterer (`9078210647`)
- **First Floor Caterer**: Swain Caterer (`7787050616`)
- **Official Meal Timings**:
  - Breakfast: `7:30 AM – 9:00 AM`
  - Lunch: `12:00 PM – 2:00 PM`
  - Dinner: `7:30 PM – 9:00 PM`

## VS Code Terminal Setup Commands

Open your project folder in **VS Code**, press `` Ctrl + ` `` to open the integrated terminal, and run:

```bash
# 1. Install dependencies (Express & CORS)
npm install

# 2. Start the Node.js + Express server
npm start
```

Now open **`http://localhost:3000`** in your browser!

## Testing REST API Endpoints in Terminal

```bash
# Fetch full database state
curl http://localhost:3000/api/state

# Fetch XML weekly menu (Module III)
curl http://localhost:3000/api/menu.xml
```

## Deploying Live (Render.com / Railway.app)

1. Initialize Git and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: IIIT Bhubaneswar Mess Management System"
   git branch -M main
   git remote add origin https://github.com/<your-username>/iiit-bh-mess-system.git
   git push -u origin main
   ```
2. On **Render.com**, click **New + -> Web Service**, connect your GitHub repository, and set:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
