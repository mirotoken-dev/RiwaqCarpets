import { initShared, fetchProducts, buildProductCard } from './app.js';
import { LangSystem } from './lang.js';

initShared('catalog');

let allProducts = [];
let selectedColors = new Set();
let currentFilters = { search: '', size: '', style: '', material: '' };

const COLORS = [
  { hex: '#8B4513', name: 'Burgundy' },
  { hex: '#F5F0E8', name: 'Ivory' },
  { hex: '#1B3A6B', name: 'Navy Blue' },
  { hex: '#C9A84C', name: 'Gold' },
  { hex: '#2E7D32', name: 'Green' },
  { hex: '#C0C0C0', name: 'Silver' },
  { hex: '#D4A0A0', name: 'Rose' },
  { hex: '#1a1a1a', name: 'Black' },
];

async function init() {
  allProducts = await fetchProducts();
  buildColorFilters();
  buildSizeOptions();
  buildMaterialOptions();
  bindFilters();

  // Read URL params (e.g. ?style=Classic from category grid)
  const urlParams = new URLSearchParams(window.location.search);
  const styleParam = urlParams.get('style');
  const styleFilter = document.getElementById('style-filter');
  if (styleParam && styleFilter) {
    const match = [...styleFilter.options].find(o => o.value.toLowerCase() === styleParam.toLowerCase());
    if (match) {
      styleFilter.value = match.value;
      currentFilters.style = match.value;
    }
  }

  const filtered = applyFiltersInternal(allProducts.filter(p => p.visible));
  renderProducts(filtered, allProducts.filter(p => p.visible).length);
}

function buildColorFilters() {
  const container = document.getElementById('color-filters');
  if (!container) return;
  container.innerHTML = COLORS.map(c => `
    <button
      class="color-filter"
      style="background:${c.hex};${c.hex === '#F5F0E8' ? 'border-color:var(--border)' : ''}"
      title="${c.name}"
      data-color="${c.hex}"
      aria-label="${c.name}"
    ></button>
  `).join('');

  container.querySelectorAll('.color-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      const hex = btn.getAttribute('data-color');
      if (selectedColors.has(hex)) {
        selectedColors.delete(hex);
        btn.classList.remove('active');
      } else {
        selectedColors.add(hex);
        btn.classList.add('active');
      }
      applyFilters();
    });
  });
}

function buildSizeOptions() {
  const sel = document.getElementById('size-filter');
  if (!sel) return;
  const sizes = new Set();
  allProducts.forEach(p => p.sizes?.forEach(s => sizes.add(s)));
  const sorted = [...sizes].sort();
  sorted.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = s;
    sel.appendChild(opt);
  });
}

function buildMaterialOptions() {
  const sel = document.getElementById('material-filter');
  if (!sel) return;
  const mats = new Set(allProducts.map(p => p.material).filter(Boolean));
  [...mats].sort().forEach(m => {
    const opt = document.createElement('option');
    opt.value = m; opt.textContent = m;
    sel.appendChild(opt);
  });
}

function bindFilters() {
  const searchInput = document.getElementById('search-input');
  const sizeFilter = document.getElementById('size-filter');
  const styleFilter = document.getElementById('style-filter');
  const materialFilter = document.getElementById('material-filter');
  const clearBtn = document.getElementById('btn-clear');

  searchInput?.addEventListener('input', e => { currentFilters.search = e.target.value.toLowerCase(); applyFilters(); });
  sizeFilter?.addEventListener('change', e => { currentFilters.size = e.target.value; applyFilters(); });
  styleFilter?.addEventListener('change', e => { currentFilters.style = e.target.value; applyFilters(); });
  materialFilter?.addEventListener('change', e => { currentFilters.material = e.target.value; applyFilters(); });

  clearBtn?.addEventListener('click', () => {
    currentFilters = { search: '', size: '', style: '', material: '' };
    selectedColors.clear();
    if (searchInput) searchInput.value = '';
    if (sizeFilter) sizeFilter.value = '';
    if (styleFilter) styleFilter.value = '';
    if (materialFilter) materialFilter.value = '';
    document.querySelectorAll('.color-filter').forEach(b => b.classList.remove('active'));
    applyFilters();
  });
}

function applyFiltersInternal(visible) {
  return visible.filter(p => {
    const lang = LangSystem.current;
    const name = lang === 'ar' ? p.nameAr : p.nameEn;
    const searchMatch = !currentFilters.search ||
      name?.toLowerCase().includes(currentFilters.search) ||
      p.ref?.toLowerCase().includes(currentFilters.search) ||
      p.style?.toLowerCase().includes(currentFilters.search) ||
      p.material?.toLowerCase().includes(currentFilters.search);
    const sizeMatch = !currentFilters.size || p.sizes?.includes(currentFilters.size);
    const styleMatch = !currentFilters.style || p.style === currentFilters.style;
    const materialMatch = !currentFilters.material || p.material === currentFilters.material;
    const colorMatch = selectedColors.size === 0 || selectedColors.has(p.color);
    return searchMatch && sizeMatch && styleMatch && materialMatch && colorMatch;
  });
}

function applyFilters() {
  const grid = document.getElementById('catalog-grid');
  if (grid) grid.classList.add('fading');

  setTimeout(() => {
    const visible = allProducts.filter(p => p.visible);
    const filtered = applyFiltersInternal(visible);
    renderProducts(filtered, visible.length);
    if (grid) grid.classList.remove('fading');
  }, 200);
}

function renderProducts(products, total) {
  const grid = document.getElementById('catalog-grid');
  const countNum = document.getElementById('count-num');
  const countTotal = document.getElementById('count-total');
  if (!grid) return;

  const tot = total ?? products.length;
  if (countNum) countNum.textContent = products.length;
  if (countTotal) countTotal.textContent = tot;

  if (products.length === 0) {
    const noResultsText = LangSystem.t('no_results');
    const noResultsSubText = LangSystem.t('no_results_sub');
    grid.innerHTML = `
      <div class="empty-state">
        <div style="font-size:3rem;margin-bottom:1rem">🔍</div>
        <h3>${noResultsText}</h3>
        <p>${noResultsSubText}</p>
      </div>`;
    return;
  }

  grid.innerHTML = products.map(p => buildProductCard(p)).join('');

  // Staggered entrance animation
  const cards = grid.querySelectorAll('.product-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }));
  });
}

init();
