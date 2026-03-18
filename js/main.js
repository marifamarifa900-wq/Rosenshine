// ===== NAVBAR HAMBURGER =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// ===== KURV =====
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function updateCartCount() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}

function addToCart(id, name, price, img) {
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ id, name, price, img, qty: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  // Loading animation
  const spinner = document.getElementById('spinner');
  if (spinner) {
    spinner.classList.add('vis');
    setTimeout(() => spinner.classList.remove('vis'), 600);
  }
  showToast(`${name} tilføjet til kurven 🌹`);
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2500);
}

// ===== PRODUKT FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.cat === filter) ? '' : 'none';
    });
  });
});

// ===== KURV SIDE =====
function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--tekst-lys)">Din kurv er tom 🌸</p>';
    if (typeof opdaterSummary === 'function') opdaterSummary();
    return;
  }
  container.innerHTML = cart.map(item => {
    const url = `produkt-detalje.html?from=kurv.html&id=${item.id}&img=${encodeURIComponent(item.img)}&navn=${encodeURIComponent(item.name)}&pris=${item.price}`;
    return `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}" style="cursor:pointer" onclick="location.href='${url}'">
      <div class="cart-item-info">
        <h3 style="cursor:pointer" onclick="location.href='${url}'">${item.name}</h3>
        <p class="desc">${item.price} kr. stk.</p>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.5rem">
        <button class="remove-item-btn" onclick="fjernFraKurv('${item.id}')" title="Fjern">✕</button>
        <div class="cart-item-price">${item.price * item.qty} kr.</div>
      </div>
    </div>
  `}).join('');
  if (typeof opdaterSummary === 'function') opdaterSummary();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}


// ===== NYHEDSBREV =====
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Tak! Du er nu tilmeldt vores nyhedsbrev 💌');
    form.reset();
  });
});

// ===== KONTAKT FORMULAR =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Tak for din besked! Vi vender tilbage snarest 🌹');
    contactForm.reset();
  });
}

// ===== INIT =====
updateCartCount();
renderCart();

// ===== ANTAL VÆLGER PÅ PRODUKTKORT =====
function vælgAntal(chip) {
  // Deaktiver søskende chips
  chip.closest('.antal-vælger').querySelectorAll('.antal-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');

  // Find produktets pris-element og opdater
  const card = chip.closest('.product-card');
  const prisEl = card.querySelector('.live-pris');
  const nyPris = chip.dataset.pris;

  prisEl.textContent = nyPris + ' kr.';

  // Lille animation
  prisEl.classList.add('bump');
  setTimeout(() => prisEl.classList.remove('bump'), 200);
}

function tilfoejMedAntal(btn, id, navn, img) {
  const card = btn.closest('.product-card');
  const aktifChip = card.querySelector('.antal-chip.active');
  const pris = parseInt(aktifChip.dataset.pris);
  const antal = aktifChip.dataset.antal;
  addToCart(id + '-' + antal, `${navn} (${antal} stk.)`, pris, img);
}

// ===== AKTIV NAVBAR SIDE =====
(function() {
  const side = window.location.pathname.split('/').pop() || 'index.html';
  let aktivSide = side;
  try {
    const params = new URLSearchParams(window.location.search);
    const fromSide = params.get('from');
    if (fromSide) aktivSide = fromSide;
  } catch(e) {
    // fallback: søg manuelt i URL
    const match = window.location.search.match(/[?&]from=([^&]+)/);
    if (match) aktivSide = match[1];
  }
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === aktivSide) {
      link.classList.add('nav-active');
    }
  });
})();

// ===== FJERN FRA KURV =====
function fjernFraKurv(id) {
  cart = cart.filter(i => i.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
  showToast('Produkt fjernet fra kurven');
}
