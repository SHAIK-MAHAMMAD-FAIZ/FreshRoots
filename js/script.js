/* ---------- Cart data layer (minimal — full cart/checkout UI is Part 3) ---------- */
const CART_KEY = 'freshroots_cart';
 
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}
 
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}
 
function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.id === Number(productId));
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: Number(productId), qty });
  }
  saveCart(cart);
  return cart;
}
 
function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

/* ---------- Cart detail helpers (used by cart.html and checkout.html) ---------- */
function getCartDetailed() {
  return getCart()
    .map(item => {
      const product = typeof getProductById === 'function' ? getProductById(item.id) : null;
      return product ? { product, qty: item.qty } : null;
    })
    .filter(Boolean);
}

function getCartTotal() {
  return getCartDetailed().reduce((sum, { product, qty }) => sum + product.price * qty, 0);
}

function updateCartQty(productId, qty) {
  const cart = getCart();
  const item = cart.find(item => item.id === Number(productId));
  if (item) {
    item.qty = Math.max(1, qty);
    saveCart(cart);
  }
  return cart;
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== Number(productId));
  saveCart(cart);
  return cart;
}

function clearCart() {
  saveCart([]);
}
 
function updateCartBadge() {
  const badge = document.querySelector('.cart-count');
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'grid' : 'none';
}
 
/* ---------- Global add-to-cart wiring (works on index, shop, product pages) ---------- */
function initAddToCart() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    e.preventDefault();
    const id = btn.getAttribute('data-add');
    const product = typeof getProductById === 'function' ? getProductById(id) : null;
    addToCart(id, 1);
    btn.classList.add('added');
    setTimeout(() => btn.classList.remove('added'), 900);
    showToast(product ? `${product.name} added to cart` : 'Added to cart');
  });
}
 
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initAddToCart();
});