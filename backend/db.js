// db.js — SQLite setup (uses Node's built-in node:sqlite, no npm install needed)
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const DB_PATH = path.join(__dirname, 'freshroots.db');
const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    unit TEXT NOT NULL,
    farmer TEXT NOT NULL,
    freshness INTEGER DEFAULT 90,
    grade TEXT DEFAULT 'A',
    icon TEXT DEFAULT 'leafy',
    image TEXT,
    harvested TEXT,
    origin TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    slot TEXT,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'Pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed orders if empty
const orderCount = db.prepare('SELECT COUNT(*) AS c FROM orders').get();
if (orderCount.c === 0) {
  const seedOrder = db.prepare(`
    INSERT INTO orders (id, customer, phone, address, slot, items, total, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const initialOrders = [
    ['FR-8821', 'Ananya S.', '9876543210', 'Plot 12, Jubilee Hills, Hyderabad', 'morning', JSON.stringify(['Vine-Ripened Tomatoes ×2', 'Organic Spinach ×1']), 112, 'Pending'],
    ['FR-8820', 'Rahul M.', '9812345678', 'Flat 402, Gachibowli, Hyderabad', 'evening', JSON.stringify(['A2 Cow Milk ×3']), 210, 'Confirmed'],
    ['FR-8819', 'Priya K.', '9944556677', 'House 5, Hitech City, Hyderabad', 'morning', JSON.stringify(['Sona Masoori Rice ×1', 'Whole Wheat Grain ×2']), 175, 'Shipped'],
    ['FR-8818', 'Vikram J.', '9765432109', '14/B, Banjara Hills, Hyderabad', 'noon', JSON.stringify(['Farm Carrots ×2']), 70, 'Delivered'],
    ['FR-8817', 'Neha T.', '9123456780', 'Madhapur, Hyderabad', 'morning', JSON.stringify(['Alphonso Mangoes ×1']), 320, 'Pending'],
    ['FR-8816', 'Arjun P.', '9456781230', 'Kondapur, Hyderabad', 'evening', JSON.stringify(['Farmhouse Paneer ×2']), 180, 'Confirmed']
  ];
  for (const o of initialOrders) seedOrder.run(...o);
}

// Seed products only the first time (table empty) — mirrors js/products.js on the frontend
const countRow = db.prepare('SELECT COUNT(*) AS c FROM products').get();
if (countRow.c === 0) {
  const seed = db.prepare(`
    INSERT INTO products (name, category, price, unit, farmer, freshness, grade, icon, image, harvested, origin, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const products = [
    ['Vine-Ripened Tomatoes', 'Vegetables', 42, 'kg', 'Ravi Kumar · Warangal', 96, 'A+', 'tomato', 'images/tomatoes.jpg', 'Today, 6:10 AM', 'Telangana', 'Sun-ripened on the vine and picked this morning. Firm skin, deep red color, balanced sweet-acidity for cooking or salads.'],
    ['Organic Spinach', 'Vegetables', 28, 'bunch', 'Lakshmi Devi · Medak', 91, 'A', 'leafy', 'images/spinach.jpg', 'Today, 5:40 AM', 'Telangana', 'Pesticide-free leafy greens grown without synthetic fertilizer. Washed and bundled within hours of harvest.'],
    ['Farm Carrots', 'Vegetables', 35, 'kg', 'S. Faiz Farms · Nizamabad', 88, 'A', 'carrot', 'images/carrots.jpg', 'Yesterday, 7:00 PM', 'Telangana', 'Crisp, sweet carrots pulled from loose loam soil that keeps them tender all the way through.'],
    ['Himalayan Apples', 'Fruits', 180, 'kg', 'Tenzin Orchards · Himachal', 94, 'A+', 'apple', 'images/apples.jpg', '2 days ago', 'Himachal Pradesh', 'Cold-climate apples with a crisp bite and natural wax finish, cold-chain delivered.'],
    ['Alphonso Mangoes', 'Fruits', 320, 'dozen', 'Konkan Growers · Ratnagiri', 90, 'A', 'mango', 'images/mangoes.jpg', '3 days ago', 'Maharashtra', 'The king of mangoes — tree-ripened, fibreless, and naturally sweet.'],
    ['Wild Strawberries', 'Fruits', 150, 'box', 'Ganesh K. · Mahabaleshwar', 85, 'B+', 'berry', 'images/strawberries.jpg', 'Today, 4:30 AM', 'Maharashtra', 'Small-batch strawberries, hand-picked and boxed same-day to preserve texture and aroma.'],
    ['A2 Cow Milk', 'Dairy', 70, 'litre', 'Pradeep Dairy · Kompally', 98, 'A+', 'milk', 'images/milk.jpg', 'This morning', 'Telangana', 'Fresh A2 milk from grass-fed cows, chilled and delivered within 6 hours of milking.'],
    ['Farmhouse Paneer', 'Dairy', 90, '250g', 'Akshitha Homestead · Sangareddy', 93, 'A', 'cheese', 'images/paneer.jpg', 'Today, 6:00 AM', 'Telangana', 'Soft-set paneer made fresh daily from unadulterated whole milk.'],
    ['Whole Wheat Grain', 'Grains', 55, 'kg', 'Ganesh Fields · Nalgonda', 89, 'A', 'wheat', 'images/wheat.jpg', 'This season', 'Telangana', 'Stone-ground quality wheat, naturally dried and cleaned, no polishing agents.'],
    ['Sona Masoori Rice', 'Grains', 65, 'kg', 'Godavari Growers · Bhadradri', 87, 'A', 'rice', 'images/rice.jpg', 'This season', 'Telangana', 'Light, aromatic rice grown along the Godavari basin, aged for the ideal cook texture.'],
  ];
  for (const p of products) seed.run(...p);
  console.log(`Seeded ${products.length} products into ${DB_PATH}`);
}

module.exports = db;
