/* ---------- Farmer Dashboard & Backend Integration Logic ---------- */

let ORDERS = [
  { id: 'FR-8821', customer: 'Ananya S.', phone: '9876543210', items: ['Vine-Ripened Tomatoes ×2', 'Organic Spinach ×1'], total: 112, status: 'Pending' },
  { id: 'FR-8820', customer: 'Rahul M.', phone: '9812345678', items: ['A2 Cow Milk ×3'], total: 210, status: 'Confirmed' },
  { id: 'FR-8819', customer: 'Priya K.', phone: '9944556677', items: ['Sona Masoori Rice ×1', 'Whole Wheat Grain ×2'], total: 175, status: 'Shipped' },
  { id: 'FR-8818', customer: 'Vikram J.', phone: '9765432109', items: ['Farm Carrots ×2'], total: 70, status: 'Delivered' },
  { id: 'FR-8817', customer: 'Neha T.', phone: '9123456780', items: ['Alphonso Mangoes ×1'], total: 320, status: 'Pending' },
  { id: 'FR-8816', customer: 'Arjun P.', phone: '9456781230', items: ['Farmhouse Paneer ×2'], total: 180, status: 'Confirmed' },
];

const FARMER_API = 'http://localhost:4000/api';

// Function to determine next status in workflow
function getNextStatus(current) {
  const flow = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
  const idx = flow.indexOf(current);
  if (idx >= 0 && idx < flow.length - 1) {
    return flow[idx + 1];
  }
  return null;
}

// Fetch orders from SQLite backend
async function fetchOrdersFromBackend() {
  try {
    const res = await fetch(`${FARMER_API}/orders`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        ORDERS = data;
      }
    }
  } catch (e) {
    console.warn('Backend orders fetch failed, using memory/local cache:', e);
  }
  return ORDERS;
}

// Fetch Mandi market prices from backend
async function fetchMandiPrices() {
  try {
    const res = await fetch(`${FARMER_API}/market-prices`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return [];
}

// Advance status of an order
async function updateOrderStatus(orderId, newStatus) {
  try {
    const res = await fetch(`${FARMER_API}/orders/${encodeURIComponent(orderId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      const updated = await res.json();
      const idx = ORDERS.findIndex(o => o.id === orderId);
      if (idx !== -1) ORDERS[idx].status = newStatus;
      return updated;
    }
  } catch (e) {}

  const local = ORDERS.find(o => o.id === orderId);
  if (local) local.status = newStatus;
  return local;
}

// Render recent orders on farmer dashboard
async function renderRecentOrders() {
  await fetchOrdersFromBackend();
  const tbody = document.querySelector('#recent-orders tbody');
  if (!tbody) return;
  const recent = ORDERS.slice(0, 6);
  tbody.innerHTML = recent.map(order => {
    const next = getNextStatus(order.status);
    const phone = order.phone || '9876543210';
    const waText = encodeURIComponent(`Namaste ${order.customer}, this is regarding your FreshRoots order #${order.id}.`);
    return `
      <tr>
        <td style="font-family:var(--font-mono); font-weight:600;">${order.id}</td>
        <td>
          <div style="font-weight:600;">${order.customer}</div>
          <div style="font-size:12px; color:var(--text-dim); display:flex; gap:8px; align-items:center; margin-top:2px;">
            <a href="tel:${phone}" style="color:var(--green); text-decoration:underline;">📞 ${phone}</a>
            <span>•</span>
            <a href="https://wa.me/91${phone}?text=${waText}" target="_blank" rel="noopener" style="color:var(--yellow); text-decoration:underline;">💬 WhatsApp</a>
          </div>
        </td>
        <td>${Array.isArray(order.items) ? order.items.join(', ') : order.items}</td>
        <td style="font-family:var(--font-mono); font-weight:600; color:var(--yellow);">₹${order.total}</td>
        <td><span class="status-pill status-${order.status.toLowerCase()}">${order.status}</span></td>
        <td>
          ${next ? `<button class="action-btn" onclick="handleAdvanceStatus('${order.id}', '${next}')">Mark ${next}</button>` : `<span style="font-size:12px; color:var(--green);">✓ Completed</span>`}
        </td>
      </tr>
    `;
  }).join('');
}

// Handler for status advance button
async function handleAdvanceStatus(orderId, nextStatus) {
  await updateOrderStatus(orderId, nextStatus);
  if (typeof showToast === 'function') showToast(`Order ${orderId} moved to ${nextStatus}`);
  if (typeof renderRecentOrders === 'function') renderRecentOrders();
  if (typeof renderOrdersList === 'function') renderOrdersList();
}

// Add new product to SQLite database backend
async function addFarmerProduct(data) {
  let createdProduct = null;
  try {
    const res = await fetch(`${FARMER_API}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      createdProduct = await res.json();
    }
  } catch (e) {
    console.warn('Backend POST failed, fallback to local cache:', e);
  }

  if (!createdProduct) {
    createdProduct = {
      id: Date.now(),
      ...data,
      grade: data.grade || 'A'
    };
  }

  PRODUCTS.unshift(createdProduct);
  try {
    const stored = JSON.parse(localStorage.getItem('freshroots_products')) || [];
    stored.unshift(createdProduct);
    localStorage.setItem('freshroots_products', JSON.stringify(stored));
  } catch (e) {}

  return createdProduct.id;
}