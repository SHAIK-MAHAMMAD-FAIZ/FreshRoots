# FreshRoots

FreshRoots is a direct Farm-to-Consumer (F2C) agricultural marketplace and farmer assistance platform. It removes intermediaries from the agricultural supply chain by enabling farmers to list harvested produce with real-time freshness grading, while consumers purchase directly with full origin traceability.

---

## Key Features

### For Consumers
* **Produce Quality and Freshness Grading**: Each product displays an automated freshness score (0% to 100%) and quality grade (A+, A, B+) based on harvest timestamp and inspection.
* **Direct Provenance and Traceability**: Listings cite the source farmer, origin district (such as Warangal, Medak, or Nizamabad), and harvest time.
* **Category Browsing and Search**: Filter produce across Vegetables, Fruits, Dairy, and Grains with instant text search and category chips.
* **Delivery Slot Selection**: Structured order checkout with scheduled delivery windows (Morning: 6 AM to 10 AM, Noon: 10 AM to 2 PM, Evening: 4 PM to 8 PM).
* **Daylight High-Contrast Mode**: Interface toggle optimized for outdoor readability in direct sunlight.

### For Farmers
* **Farmer Management Console**: Real-time dashboard showing total earnings, active order counts, and listed crop metrics.
* **Multilingual Interface**: Full interface localization supporting English, Telugu (తెలుగు), and Hindi (हिंदी).
* **Hands-Free Voice Listing**: Web Speech API integration (`SpeechRecognition`) enabling voice-based product naming in English, Telugu, and Hindi directly from field environments.
* **APMC Mandi and MSP Price Intelligence**: Real-time market rate comparisons against official APMC wholesale Mandi and Minimum Support Price (MSP) benchmarks to advise competitive pricing.
* **Order Lifecycle Workflow**: Direct status progression (`Pending` -> `Confirmed` -> `Shipped` -> `Delivered`) with customer contact details and delivery addresses.

---

## System Architecture and Tech Stack

The application employs a decoupled architecture designed to operate with zero third-party npm dependencies:

* **Frontend**: HTML5, Responsive CSS3 (CSS Custom Variables, Flexbox, Grid), Vanilla JavaScript (ES6 Modules and native Web APIs).
* **Backend**: Node.js native runtime (`node:http`, `node:crypto`, `node:sqlite`), requiring Node.js v22.5 or higher.
* **Database**: Embedded SQLite (`freshroots.db`) managed via Node's native `node:sqlite` module with prepared statements.
* **Security**: Password hashing using cryptographic `scrypt` with random 16-byte salts; tokenized authorization headers.
* **Resilience**: Frontend automatically synchronizes with the SQLite REST API on boot and gracefully falls back to cached `localStorage` data if the server is offline.

---

## Project Structure

```text
FreshRoots/
├── index.html               # Main landing page with live produce scan visualizer
├── shop.html                # Product catalogue with category filters and search
├── product.html             # Single product detail view and provenance inspector
├── cart.html                # Shopping cart summary and item quantities
├── checkout.html            # Order finalization, address capture, and slot selection
├── login.html               # User authentication entry point
├── register.html            # User account registration
├── css/
│   └── style.css            # Global design system, theme variables, and responsive layout
├── js/
│   ├── products.js          # Product data store and REST API synchronization
│   ├── farmer.js            # Farmer dashboard operations, Mandi rates, and order workflows
│   ├── auth.js              # Authentication management and session token persistence
│   ├── script.js            # Shopping cart data model and badge updates
│   └── ui.js                # Toasts, mobile navigation toggles, and scroll observer
├── farmer/
│   ├── dashboard.html       # Farmer overview, revenue analytics, and quick actions
│   ├── add-product.html     # Crop listing form with voice typing and presets
│   └── orders.html          # Order dispatch management table
├── images/                  # Product imagery and assets
└── backend/
    ├── server.js            # Plain Node HTTP REST API server
    ├── db.js                # SQLite schema creation and automatic seed data
    ├── auth-utils.js        # scrypt password hashing and token generation
    ├── freshroots.db        # SQLite database file
    └── README.md            # Backend developer documentation
```

---

## API Endpoints

The backend listens on `http://localhost:4000` by default.

### Products
* `GET /api/products`: Retrieve all products (supports query params `?category=Fruits&q=mango`).
* `GET /api/products/:id`: Retrieve single product by primary key ID.
* `POST /api/products`: Create a product listing.
* `PUT /api/products/:id`: Update an existing product.
* `DELETE /api/products/:id`: Remove a product from the database.

### Orders
* `GET /api/orders`: Retrieve all customer orders sorted by creation date.
* `GET /api/orders/:id`: Retrieve specific order details.
* `POST /api/orders`: Submit a new order.
* `PUT /api/orders/:id`: Update order fulfillment status.

### Market Intelligence
* `GET /api/market-prices`: Fetch live APMC Mandi rates, MSP benchmarks, and pricing trends.

### Authentication
* `POST /api/auth/register`: Create account (`{ name, email, phone, password }`).
* `POST /api/auth/login`: Authenticate credentials and obtain bearer token.
* `GET /api/auth/me`: Fetch current authenticated profile via `Authorization: Bearer <token>`.

---

## Database Schema

```sql
CREATE TABLE products (
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

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
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
```

---

## Getting Started

### Prerequisites
* Node.js version 22.5.0 or higher (required for built-in `node:sqlite`).
* Modern web browser (Chrome, Edge, Firefox, or Safari).

### 1. Start the Backend API
Navigate to the `backend` folder and start the server:

```bash
cd backend
node server.js
```

The database `freshroots.db` will initialize and seed 10 initial agricultural products and active orders automatically.

### 2. Launch the Frontend
Open `index.html` in your browser, or serve it using any local static file server:

```bash
# Using python
python3 -m http.server 3000

# Or open directly in browser
open index.html
```

Access the application at `http://localhost:3000`.

---

## Demonstration Credentials and Testing Flow

1. **Browse as Customer**:
   * Visit `http://localhost:3000/shop.html`.
   * Add items to cart and proceed to `checkout.html`.
   * Fill delivery details and place order.
2. **Manage as Farmer**:
   * Open `http://localhost:3000/farmer/dashboard.html`.
   * Inspect current APMC Mandi rates and compare market advice.
   * Open `http://localhost:3000/farmer/orders.html` to advance order status from `Pending` to `Confirmed`, `Shipped`, or `Delivered`.
   * Open `http://localhost:3000/farmer/add-product.html` to test preset autocompletion or speech-to-text crop listing.

# FreshRoots
