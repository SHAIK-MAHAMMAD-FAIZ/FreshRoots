// server.js — plain Node http server (no Express/npm install needed)
// Run: node server.js   (Node 22+ required for built-in node:sqlite)
const http = require('node:http');
const db = require('./db');
const { hashPassword, verifyPassword, createToken, getUserIdFromToken } = require('./auth-utils');

const PORT = process.env.PORT || 4000;

function send(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(json);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function requireAuth(req) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const userId = token ? getUserIdFromToken(token) : null;
  return userId;
}

function publicUser(row) {
  return { id: row.id, name: row.name, email: row.email, phone: row.phone };
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const parts = url.pathname.split('/').filter(Boolean); // e.g. ['api','products','3']

  try {
    // ---------- PRODUCTS ----------
    if (parts[0] === 'api' && parts[1] === 'products') {
      const id = parts[2] ? Number(parts[2]) : null;

      if (req.method === 'GET' && !id) {
        const category = url.searchParams.get('category');
        const q = url.searchParams.get('q');
        let rows = db.prepare('SELECT * FROM products').all();
        if (category && category !== 'All') rows = rows.filter((p) => p.category === category);
        if (q) {
          const needle = q.toLowerCase();
          rows = rows.filter(
            (p) => p.name.toLowerCase().includes(needle) || p.farmer.toLowerCase().includes(needle)
          );
        }
        return send(res, 200, rows);
      }

      if (req.method === 'GET' && id) {
        const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
        if (!row) return send(res, 404, { error: 'Product not found' });
        return send(res, 200, row);
      }

      if (req.method === 'POST') {
        const b = await readBody(req);
        if (!b.name || !b.category || !b.price) {
          return send(res, 400, { error: 'name, category and price are required' });
        }
        const stmt = db.prepare(`
          INSERT INTO products (name, category, price, unit, farmer, freshness, grade, icon, image, harvested, origin, description)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const info = stmt.run(
          b.name, b.category, b.price, b.unit || 'kg', b.farmer || 'Unknown Farmer',
          b.freshness || 90, b.grade || 'A', b.icon || 'leafy', b.image || null,
          b.harvested || 'Today', b.origin || 'Telangana', b.description || ''
        );
        const created = db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid);
        return send(res, 201, created);
      }

      if (req.method === 'PUT' && id) {
        const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
        if (!existing) return send(res, 404, { error: 'Product not found' });
        const b = await readBody(req);
        const merged = { ...existing, ...b };
        db.prepare(`
          UPDATE products SET name=?, category=?, price=?, unit=?, farmer=?, freshness=?, grade=?, icon=?, image=?, harvested=?, origin=?, description=?
          WHERE id=?
        `).run(
          merged.name, merged.category, merged.price, merged.unit, merged.farmer,
          merged.freshness, merged.grade, merged.icon, merged.image, merged.harvested,
          merged.origin, merged.description, id
        );
        const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
        return send(res, 200, updated);
      }

      if (req.method === 'DELETE' && id) {
        const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
        if (!existing) return send(res, 404, { error: 'Product not found' });
        db.prepare('DELETE FROM products WHERE id = ?').run(id);
        return send(res, 200, { deleted: id });
      }
    }

    // ---------- ORDERS ----------
    if (parts[0] === 'api' && parts[1] === 'orders') {
      const orderId = parts[2] ? decodeURIComponent(parts[2]) : null;

      if (req.method === 'GET' && !orderId) {
        const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
        const formatted = rows.map(r => {
          let itemsList = [];
          try { itemsList = JSON.parse(r.items); } catch(e) { itemsList = [r.items]; }
          return { ...r, items: itemsList };
        });
        return send(res, 200, formatted);
      }

      if (req.method === 'GET' && orderId) {
        const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
        if (!row) return send(res, 404, { error: 'Order not found' });
        try { row.items = JSON.parse(row.items); } catch(e) {}
        return send(res, 200, row);
      }

      if (req.method === 'POST') {
        const b = await readBody(req);
        if (!b.customer || !b.items || !b.total) {
          return send(res, 400, { error: 'customer, items and total are required' });
        }
        const id = b.id || 'FR-' + Date.now().toString().slice(-6);
        const itemsStr = typeof b.items === 'string' ? b.items : JSON.stringify(b.items);
        const stmt = db.prepare(`
          INSERT INTO orders (id, customer, phone, address, slot, items, total, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(id, b.customer, b.phone || '', b.address || '', b.slot || 'morning', itemsStr, b.total, b.status || 'Pending');
        const created = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
        try { created.items = JSON.parse(created.items); } catch(e) {}
        return send(res, 201, created);
      }

      if (req.method === 'PUT' && orderId) {
        const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
        if (!existing) return send(res, 404, { error: 'Order not found' });
        const b = await readBody(req);
        const nextStatus = b.status || existing.status;
        db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(nextStatus, orderId);
        const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
        try { updated.items = JSON.parse(updated.items); } catch(e) {}
        return send(res, 200, updated);
      }
    }

    // ---------- MANDI / MARKET PRICES ----------
    if (parts[0] === 'api' && parts[1] === 'market-prices') {
      const prices = [
        { crop: 'Tomatoes', category: 'Vegetables', mandiRate: '₹38 – ₹45 / kg', msp: '₹35 / kg', trend: '+4% this week', advice: 'High demand in Hyderabad wholesale mandi' },
        { crop: 'Spinach', category: 'Vegetables', mandiRate: '₹24 – ₹30 / bunch', msp: '₹22 / bunch', trend: 'Stable', advice: 'Direct sale fetches 20% higher margin' },
        { crop: 'Carrots', category: 'Vegetables', mandiRate: '₹32 – ₹38 / kg', msp: '₹30 / kg', trend: '+2% this week', advice: 'Grade A washed carrots are selling fast' },
        { crop: 'Alphonso Mangoes', category: 'Fruits', mandiRate: '₹290 – ₹340 / doz', msp: '₹280 / doz', trend: '+8% this week', advice: 'Peak export and retail season' },
        { crop: 'Himalayan Apples', category: 'Fruits', mandiRate: '₹165 – ₹195 / kg', msp: '₹160 / kg', trend: 'Stable', advice: 'Cold chain storage recommended' },
        { crop: 'A2 Cow Milk', category: 'Dairy', mandiRate: '₹65 – ₹75 / L', msp: '₹60 / L', trend: '+5% this week', advice: 'Direct urban subscriptions have lowest churn' },
        { crop: 'Farmhouse Paneer', category: 'Dairy', mandiRate: '₹85 – ₹95 / 250g', msp: '₹80 / 250g', trend: 'Stable', advice: 'High restaurant and household weekend orders' },
        { crop: 'Sona Masoori Rice', category: 'Grains', mandiRate: '₹60 – ₹68 / kg', msp: '₹58 / kg', trend: '+3% this week', advice: 'Aged rice commands ₹5/kg premium' },
        { crop: 'Whole Wheat Grain', category: 'Grains', mandiRate: '₹50 – ₹58 / kg', msp: '₹48 / kg', trend: 'Stable', advice: 'Direct bulk bag sales are preferred' }
      ];
      return send(res, 200, prices);
    }

    // ---------- AUTH ----------
    if (parts[0] === 'api' && parts[1] === 'auth') {
      if (req.method === 'POST' && parts[2] === 'register') {
        const b = await readBody(req);
        if (!b.name || !b.email || !b.password) {
          return send(res, 400, { error: 'name, email and password are required' });
        }
        const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(b.email.toLowerCase());
        if (exists) return send(res, 409, { error: 'An account with this email already exists' });

        const { hash, salt } = hashPassword(b.password);
        const info = db.prepare(
          'INSERT INTO users (name, email, phone, password_hash, salt) VALUES (?, ?, ?, ?, ?)'
        ).run(b.name, b.email.toLowerCase(), b.phone || '', hash, salt);

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
        const token = createToken(user.id);
        return send(res, 201, { token, user: publicUser(user) });
      }

      if (req.method === 'POST' && parts[2] === 'login') {
        const b = await readBody(req);
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get((b.email || '').toLowerCase());
        if (!user || !verifyPassword(b.password || '', user.salt, user.password_hash)) {
          return send(res, 401, { error: 'Invalid email or password' });
        }
        const token = createToken(user.id);
        return send(res, 200, { token, user: publicUser(user) });
      }

      if (req.method === 'GET' && parts[2] === 'me') {
        const userId = requireAuth(req);
        if (!userId) return send(res, 401, { error: 'Not authenticated' });
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        if (!user) return send(res, 401, { error: 'Not authenticated' });
        return send(res, 200, { user: publicUser(user) });
      }
    }

    if (parts[0] === 'api' && parts.length === 1) {
      return send(res, 200, { status: 'ok', message: 'FreshRoots API is running' });
    }

    return send(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error(err);
    return send(res, 500, { error: 'Server error', detail: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`FreshRoots backend running at http://localhost:${PORT}`);
  console.log(`Try:  http://localhost:${PORT}/api/products`);
});
