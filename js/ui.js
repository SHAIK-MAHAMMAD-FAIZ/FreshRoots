/* ---------- Toast ---------- */

function showToast(message) {

  let toast = document.querySelector('.toast');

  if (!toast) {

    toast = document.createElement('div');

    toast.className = 'toast';

    toast.innerHTML = `<span class="dot"></span><span class="toast-msg"></span>`;

    document.body.appendChild(toast);

  }

  toast.querySelector('.toast-msg').textContent = message;

  toast.classList.add('show');

  clearTimeout(toast._t);

  toast._t = setTimeout(() => toast.classList.remove('show'), 2200);

}

 

/* ---------- Mobile nav ---------- */

function initMobileNav() {

  const toggle = document.querySelector('.menu-toggle');

  const links = document.querySelector('.nav-links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {

    const open = links.style.display === 'flex';

    links.style.display = open ? 'none' : 'flex';

    links.style.cssText += open ? '' : 'position:absolute;top:100%;left:0;right:0;flex-direction:column;background:#12140F;padding:20px 28px;border-top:1px solid var(--surface-line);gap:18px;';

  });

}

 

/* ---------- Reveal-on-scroll (cards fade up, freshness meters fill) ---------- */

function initRevealObserver() {

  const targets = document.querySelectorAll('.reveal, .freshness-fill');

  if (!targets.length || !('IntersectionObserver' in window)) {

    targets.forEach(t => t.classList.add('in-view'));

    return;

  }

  const io = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add('in-view');

        io.unobserve(entry.target);

      }

    });

  }, { threshold: 0.2 });

  targets.forEach(t => io.observe(t));

}

 

/* Re-run observer whenever the grid is re-rendered (filtering/search) */
function refreshReveal() {
  document.querySelectorAll('.reveal:not(.in-view), .freshness-fill:not(.in-view)').forEach(el => {
    requestAnimationFrame(() => el.classList.add('in-view'));
  });
}

/* ---------- Theme Toggler (Daylight / Dark Mode) ---------- */
function initTheme() {
  const saved = localStorage.getItem('freshroots_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeButton(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('freshroots_theme', next);
  updateThemeButton(next);
  showToast(next === 'light' ? '☀️ Daylight Mode (High-Contrast)' : '🌙 Dark Mode');
}

function updateThemeButton(theme) {
  const btns = document.querySelectorAll('.theme-toggle-btn');
  btns.forEach(btn => {
    btn.innerHTML = theme === 'light' ? '☀️ Daylight' : '🌙 Dark';
    btn.title = 'Toggle Outdoor Daylight Mode for Better Sunlight Visibility';
  });
}

/* ---------- Multi-Language Dictionary (English / Telugu / Hindi) ---------- */
const TRANSLATIONS = {
  en: {
    dashboard: 'Dashboard',
    addProduct: 'Add Product',
    orders: 'Orders',
    viewStore: 'View Store',
    totalRevenue: 'Total Revenue',
    mandiTitle: 'Mandi / MSP Live Price Intelligence',
    listNewProduct: '+ List New Crop',
    cropPresets: '⚡ Quick Crop Presets (Click to autofill):',
    freshnessScore: 'Freshness Score',
    saveProduct: 'Publish & List Crop',
    customer: 'Customer',
    status: 'Status',
    total: 'Total',
    advanceStatus: 'Advance Status',
    whatsappFarmer: 'Chat on WhatsApp',
    callBuyer: 'Call Buyer'
  },
  te: {
    dashboard: 'రైతు డ్యాష్‌బోర్డ్',
    addProduct: 'పంట జోడించండి',
    orders: 'ఆర్డర్లు',
    viewStore: 'దుకాణం చూడండి',
    totalRevenue: 'మొత్తం ఆదాయం',
    mandiTitle: 'మండి / కనీస మద్దతు ధరల సమాచారం',
    listNewProduct: '+ కొత్త పంటను నమోదు చేయండి',
    cropPresets: '⚡ సులభమైన పంట ఎంపిక (ఆటో-ఫిల్ కోసం నొక్కండి):',
    freshnessScore: 'తాజాదనం స్కోరు',
    saveProduct: 'పంటను అమ్మకానికి పెట్టండి',
    customer: 'కొనుగోలుదారు',
    status: 'స్థితి',
    total: 'మొత్తం',
    advanceStatus: 'తదుపరి దశకు మార్చండి',
    whatsappFarmer: 'వాట్సాప్‌లో సంప్రదించండి',
    callBuyer: 'కొనుగోలుదారుకు కాల్ చేయండి'
  },
  hi: {
    dashboard: 'किसान डैशबोर्ड',
    addProduct: 'फसल जोड़ें',
    orders: 'ऑर्डर',
    viewStore: 'स्टोर देखें',
    totalRevenue: 'कुल कमाई',
    mandiTitle: 'मंडी / एमएसपी लाइव भाव जानकारी',
    listNewProduct: '+ नई फसल जोड़ें',
    cropPresets: '⚡ तुरंत फसल चुनें (एक क्लिक में भरें):',
    freshnessScore: 'ताजगी स्कोर',
    saveProduct: 'फसल लिस्ट करें',
    customer: 'ग्राहक',
    status: 'स्थिति',
    total: 'कुल राशि',
    advanceStatus: 'स्थिति आगे बढ़ाएं',
    whatsappFarmer: 'व्हाट्सएप पर बात करें',
    callBuyer: 'ग्राहक को कॉल करें'
  }
};

function getLang() {
  return localStorage.getItem('freshroots_lang') || 'en';
}

function setLang(lang) {
  localStorage.setItem('freshroots_lang', lang);
  applyTranslations();
  showToast(`Language set to ${lang === 'te' ? 'తెలుగు (Telugu)' : lang === 'hi' ? 'हिंदी (Hindi)' : 'English'}`);
}

function t(key) {
  const lang = getLang();
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || (TRANSLATIONS.en[key] || key);
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });
  const selects = document.querySelectorAll('.lang-select');
  selects.forEach(s => s.value = getLang());
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initRevealObserver();
  applyTranslations();
});