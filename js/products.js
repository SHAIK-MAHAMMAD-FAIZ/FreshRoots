const ICONS = {
  tomato: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 30c16 0 28 14 28 32s-13 30-28 30-28-13-28-30 12-32 28-32z" style="fill:var(--orange)"/>
    <path d="M50 30c-4-8-2-16 4-20M50 30c4-8 10-12 16-12" stroke="var(--green)" stroke-width="4" stroke-linecap="round"/>
  </svg>`,
  leafy: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 90c-18-6-30-24-28-46 20 2 34 12 38 28M50 90c18-6 30-24 28-46-20 2-34 12-38 28" style="fill:var(--green)"/>
    <path d="M50 90V44" stroke="#12140F" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  carrot: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 20l6 10M50 16l4 12M60 20l-4 10" stroke="var(--green)" stroke-width="5" stroke-linecap="round"/>
    <path d="M50 32c14 0 22 40 4 62-4 5-8 5-8-2 0-16-10-30-4-46 2-6 4-12 8-14z" style="fill:var(--orange)"/>
  </svg>`,
  apple: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 38c14-14 34-6 34 14 0 20-16 38-34 38S16 72 16 52c0-20 20-28 34-14z" style="fill:var(--orange)"/>
    <path d="M50 38V22M50 22c4-6 12-8 16-4" stroke="var(--green)" stroke-width="4" stroke-linecap="round"/>
  </svg>`,
  mango: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M28 40c6-14 24-20 40-12 16 8 22 26 12 42-10 15-30 20-42 8-11-11-16-26-10-38z" style="fill:var(--yellow)"/>
    <path d="M62 24c4-6 10-8 14-6" stroke="var(--green)" stroke-width="4" stroke-linecap="round"/>
  </svg>`,
  berry: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="38" cy="55" r="16" style="fill:var(--orange)"/>
    <circle cx="62" cy="55" r="16" style="fill:var(--orange)"/>
    <circle cx="50" cy="38" r="16" style="fill:var(--orange)"/>
    <path d="M50 22v-6M50 16c4-4 10-4 14 0" stroke="var(--green)" stroke-width="4" stroke-linecap="round"/>
  </svg>`,
  milk: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 14h20l4 14-6 8v46a6 6 0 0 1-6 6H48a6 6 0 0 1-6-6V36l-6-8z" style="fill:var(--text)" fill-opacity="0.92"/>
    <rect x="40" y="46" width="20" height="10" style="fill:var(--green)"/>
  </svg>`,
  cheese: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 70l40-40 36 16-8 24H12z" style="fill:var(--yellow)"/>
    <circle cx="40" cy="58" r="4" style="fill:#12140F"/>
    <circle cx="58" cy="62" r="3" style="fill:#12140F"/>
  </svg>`,
  wheat: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 90V26" stroke="var(--green)" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 30l-14-10M50 30l14-10M50 42l-14-10M50 42l14-10M50 54l-14-10M50 54l14-10" stroke="var(--yellow)" stroke-width="5" stroke-linecap="round"/>
  </svg>`,
  rice: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="34" cy="40" rx="10" ry="16" transform="rotate(-20 34 40)" style="fill:var(--text)" fill-opacity="0.92"/>
    <ellipse cx="54" cy="52" rx="10" ry="16" transform="rotate(-10 54 52)" style="fill:var(--text)" fill-opacity="0.92"/>
    <ellipse cx="66" cy="34" rx="10" ry="16" transform="rotate(-28 66 34)" style="fill:var(--yellow)"/>
  </svg>`
};
 
/* ---------- Product catalogue ---------- */
let PRODUCTS = [
  { id: 1, name: 'Vine-Ripened Tomatoes', category: 'Vegetables', price: 42, unit: 'kg', farmer: 'Ravi Kumar · Warangal', freshness: 96, grade: 'A+', icon: 'tomato', image: 'images/tomatoes.jpg', harvested: 'Today, 6:10 AM', origin: 'Telangana', description: 'Sun-ripened on the vine and picked this morning. Firm skin, deep red color, balanced sweet-acidity for cooking or salads.' },
  { id: 2, name: 'Organic Spinach', category: 'Vegetables', price: 28, unit: 'bunch', farmer: 'Lakshmi Devi · Medak', freshness: 91, grade: 'A', icon: 'leafy', image: 'images/spinach.jpg', harvested: 'Today, 5:40 AM', origin: 'Telangana', description: 'Pesticide-free leafy greens grown without synthetic fertilizer. Washed and bundled within hours of harvest.' },
  { id: 3, name: 'Farm Carrots', category: 'Vegetables', price: 35, unit: 'kg', farmer: 'S. Faiz Farms · Nizamabad', freshness: 88, grade: 'A', icon: 'carrot', image: 'images/carrots.jpg', harvested: 'Yesterday, 7:00 PM', origin: 'Telangana', description: 'Crisp, sweet carrots pulled from loose loam soil that keeps them tender all the way through.' },
  { id: 4, name: 'Himalayan Apples', category: 'Fruits', price: 180, unit: 'kg', farmer: 'Tenzin Orchards · Himachal', freshness: 94, grade: 'A+', icon: 'apple', image: 'images/apples.jpg', harvested: '2 days ago', origin: 'Himachal Pradesh', description: 'Cold-climate apples with a crisp bite and natural wax finish, cold-chain delivered.' },
  { id: 5, name: 'Alphonso Mangoes', category: 'Fruits', price: 320, unit: 'dozen', farmer: 'Konkan Growers · Ratnagiri', freshness: 90, grade: 'A', icon: 'mango', image: 'images/mangoes.jpg', harvested: '3 days ago', origin: 'Maharashtra', description: 'The king of mangoes — tree-ripened, fibreless, and naturally sweet.' },
  { id: 6, name: 'Wild Strawberries', category: 'Fruits', price: 150, unit: 'box', farmer: 'Ganesh K. · Mahabaleshwar', freshness: 85, grade: 'B+', icon: 'berry', image: 'images/strawberries.jpg', harvested: 'Today, 4:30 AM', origin: 'Maharashtra', description: 'Small-batch strawberries, hand-picked and boxed same-day to preserve texture and aroma.' },
  { id: 7, name: 'A2 Cow Milk', category: 'Dairy', price: 70, unit: 'litre', farmer: 'Pradeep Dairy · Kompally', freshness: 98, grade: 'A+', icon: 'milk', image: 'images/milk.jpg', harvested: 'This morning', origin: 'Telangana', description: 'Fresh A2 milk from grass-fed cows, chilled and delivered within 6 hours of milking.' },
  { id: 8, name: 'Farmhouse Paneer', category: 'Dairy', price: 90, unit: '250g', farmer: 'Akshitha Homestead · Sangareddy', freshness: 93, grade: 'A', icon: 'cheese', image: 'images/paneer.jpg', harvested: 'Today, 6:00 AM', origin: 'Telangana', description: 'Soft-set paneer made fresh daily from unadulterated whole milk.' },
  { id: 9, name: 'Whole Wheat Grain', category: 'Grains', price: 55, unit: 'kg', farmer: 'Ganesh Fields · Nalgonda', freshness: 89, grade: 'A', icon: 'wheat', image: 'images/wheat.jpg', harvested: 'This season', origin: 'Telangana', description: 'Stone-ground quality wheat, naturally dried and cleaned, no polishing agents.' },
  { id: 10, name: 'Sona Masoori Rice', category: 'Grains', price: 65, unit: 'kg', farmer: 'Godavari Growers · Bhadradri', freshness: 87, grade: 'A', icon: 'rice', image: 'images/rice.jpg', harvested: 'This season', origin: 'Telangana', description: 'Light, aromatic rice grown along the Godavari basin, aged for the ideal cook texture.' }
];

const API_BASE = 'http://localhost:4000/api';

// Sync products from backend SQLite API
async function syncProductsFromBackend() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        PRODUCTS = data;
        localStorage.setItem('freshroots_products', JSON.stringify(data));
        window.dispatchEvent(new CustomEvent('freshroots:products-loaded', { detail: data }));
        return data;
      }
    }
  } catch (err) {
    // Backend offline or unreachable: fall back to localStorage if available
    try {
      const cached = JSON.parse(localStorage.getItem('freshroots_products'));
      if (Array.isArray(cached) && cached.length > 0) {
        PRODUCTS = cached;
      }
    } catch(e) {}
  }
  return PRODUCTS;
}

// Automatically sync when script loads
syncProductsFromBackend();
 
/* ---------- Category metadata (used by index + shop filter bar) ---------- */
const CATEGORIES = [
  { name: 'Vegetables', icon: 'carrot' },
  { name: 'Fruits', icon: 'apple' },
  { name: 'Dairy', icon: 'milk' },
  { name: 'Grains', icon: 'wheat' }
];
 
function getProductById(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}
 
function categoryCount(name) {
  return PRODUCTS.filter(p => p.category === name).length;
}
 
/* ---------- Card renderer (used by index + shop) ---------- */
function productCardHTML(p) {
  const imgSrc = p.image || `images/${p.icon}.jpg`;
  const gradeColor = p.freshness >= 90 ? 'var(--green)' : 'var(--yellow)';
  return `
    <article class="product-card reveal" data-id="${p.id}" data-category="${p.category}">
      <a href="product.html?id=${p.id}" class="product-media">
        <img src="${imgSrc}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';">
        <div class="fallback-icon" style="display:none; width:100%; height:100%; place-items:center;">
          ${ICONS[p.icon] || ICONS.leafy}
        </div>
        <div class="freshness-tag">
          <span class="freshness-dot" style="background:${gradeColor};"></span>
          <span>${p.freshness}% Fresh</span>
        </div>
      </a>
      <div class="product-body">
        <div class="product-farmer-meta">
          <span class="farmer-tag">🧑‍🌾 ${p.farmer.split('·')[0].trim()}</span>
          ${p.origin ? `<span class="origin-tag">📍 ${p.origin}</span>` : ''}
        </div>
        <a href="product.html?id=${p.id}" class="product-name">${p.name}</a>
        <div class="product-harvested-info">
          <span>🕒 Picked: ${p.harvested || 'Fresh today'}</span>
        </div>
        <div class="product-row">
          <div class="price-wrap">
            <span class="product-price">₹${p.price}</span>
            <span class="unit">/ ${p.unit}</span>
          </div>
          <button class="add-btn" data-add="${p.id}" aria-label="Add ${p.name} to cart" title="Add to cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
            <span class="add-text">Add</span>
          </button>
        </div>
      </div>
    </article>`;
}
 
/* ---------- Category card renderer (used by index + shop chips source) ---------- */
function categoryCardHTML(c) {
  return `
    <a href="shop.html?category=${encodeURIComponent(c.name)}" class="category-card reveal">
      ${ICONS[c.icon]}
      <h3>${c.name}</h3>
      <span class="count">${categoryCount(c.name)} products</span>
    </a>`;
}
 
function renderGrid(el, products) {
  if (!el) return;
  el.innerHTML = products.length
    ? products.map(productCardHTML).join('')
    : '';
  const empty = document.querySelector('.empty-state');
  if (empty) empty.style.display = products.length ? 'none' : 'block';
  if (typeof refreshReveal === 'function') refreshReveal();
}