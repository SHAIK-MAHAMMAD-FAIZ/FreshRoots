const AUTH_KEY = 'freshroots_user';

// Simple user store in localStorage (array of { name, email, phone, password })
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('freshroots_users')) || [];
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem('freshroots_users', JSON.stringify(users));
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || null;
  } catch (e) {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  updateAuthUI();
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  updateAuthUI();
  showToast('Logged out successfully');
}

function isLoggedIn() {
  return getCurrentUser() !== null;
}

// Update nav to reflect logged-in state
function updateAuthUI() {
  const accountLink = document.querySelector('.nav-actions .nav-icon-btn[aria-label="Account"]');
  if (!accountLink) return;
  if (isLoggedIn()) {
    const user = getCurrentUser();
    accountLink.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
      </svg>`;
    accountLink.title = `Logged in as ${user.name}`;
    // Optionally change link to logout or profile
    // We'll keep it as account link for now; in a real app you'd show a dropdown
  } else {
    accountLink.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
      </svg>`;
    accountLink.title = 'Login';
  }
}

// Login form handler
function initLogin() {
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    // Simple validation
    if (!email || !password) {
      showToast('Please fill in all fields');
      return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      setCurrentUser({ name: user.name, email: user.email, phone: user.phone });
      showToast(`Welcome back, ${user.name}!`);
      // Redirect to home after a short delay
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 800);
    } else {
      showToast('Invalid email or password');
    }
  });
}

// Register form handler
function initRegister() {
  const form = document.getElementById('register-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const phone = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    // Validation
    if (!name || !email || !phone || !password || !confirm) {
      showToast('Please fill in all fields');
      return;
    }
    if (password !== confirm) {
      showToast('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters');
      return;
    }

    const users = getUsers();
    if (users.some(u => u.email === email)) {
      showToast('An account with this email already exists');
      return;
    }

    const newUser = { name, email, phone, password };
    users.push(newUser);
    saveUsers(users);
    setCurrentUser({ name, email, phone });
    showToast(`Account created! Welcome, ${name}`);
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  initLogin();
  initRegister();
});