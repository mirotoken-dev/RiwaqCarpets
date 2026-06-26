import { LangSystem } from './lang.js';

const ADMIN_PASSWORD = 'admin123';
const STORAGE_KEY = 'carpet_products';

LangSystem.init();

// ── Auth ──
const lockEl = document.getElementById('admin-lock');
const bodyEl = document.getElementById('admin-body');
const pwInput = document.getElementById('admin-pw-input');
const loginBtn = document.getElementById('admin-login-btn');
const errorEl = document.getElementById('admin-error');

function checkLogin() {
  const val = pwInput?.value || '';
  if (val === ADMIN_PASSWORD) {
    lockEl.style.display = 'none';
    bodyEl.classList.add('visible');
    loadStats();
    loadTable();
  } else {
    errorEl?.classList.add('visible');
    pwInput?.classList.add('error');
  }
}

loginBtn?.addEventListener('click', checkLogin);
pwInput?.addEventListener('keydown', e => { if (e.key === 'Enter') checkLogin(); });

document.getElementById('admin-logout')?.addEventListener('click', () => {
  bodyEl.classList.remove('visible');
  lockEl.style.display = 'flex';
  if (pwInput) pwInput.value = '';
  errorEl?.classList.remove('visible');
  pwInput?.classList.remove('error');
});

// ── Section navigation ──
function showSection(name) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`section-${name}`)?.classList.add('active');
  document.querySelector(`[data-section="${name}"]`)?.classList.add('active');

  const titles = {
    'dashboard': LangSystem.t('admin_dashboard'),
    'add-product': LangSystem.t('admin_add_product'),
    'all-products': LangSystem.t('admin_all_products'),
  };
  const el = document.getElementById('admin-section-title');
  if (el) el.textContent = titles[name] || '';
}

document.querySelectorAll('[data-section]').forEach(btn => {
  btn.addEventListener('click', () => showSection(btn.getAttribute('data-section')));
});

// ── Products storage ──
async function getProducts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  try {
    const res = await fetch('/products.json');
    const data = await res.json();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch {
    return [];
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  sessionStorage.removeItem('products_cache');
}

// ── Stats ──
async function loadStats() {
  const products = await getProducts();
  const total = products.length;
  const visible = products.filter(p => p.visible).length;
  const hidden = total - visible;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-visible').textContent = visible;
  document.getElementById('stat-hidden').textContent = hidden;
}

// ── Table ──
async function loadTable() {
  const products = await getProducts();
  const tbody = document.getElementById('products-table-body');
  if (!tbody) return;

  if (!products.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text-light);padding:2rem">No products yet. Add your first product!</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        ${p.image
          ? `<img class="table-img" src="${p.image}" alt="${p.nameEn}" onerror="this.style.background='var(--cream)'">`
          : `<div class="table-img" style="display:flex;align-items:center;justify-content:center;font-size:1.2rem;background:var(--cream)">🪅</div>`
        }
      </td>
      <td style="font-weight:600;color:var(--charcoal)">${p.ref}</td>
      <td>
        <div style="font-weight:500">${p.nameEn}</div>
        <div style="font-size:.78rem;color:var(--text-light)">${p.nameAr || ''}</div>
      </td>
      <td style="font-weight:600;color:var(--gold)">$${p.price?.toLocaleString() || 0}</td>
      <td>${p.style || ''}</td>
      <td><span class="badge-visible ${p.visible ? 'yes' : 'no'}">${p.visible ? 'Yes' : 'No'}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn-edit" onclick="editProduct(${p.id})" data-lang-key="admin_edit">Edit</button>
          <button class="btn-delete" onclick="deleteProduct(${p.id})" data-lang-key="admin_delete">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── Sizes chips ──
let currentSizes = [];

function renderSizeChips() {
  const container = document.getElementById('sizes-chips');
  if (!container) return;
  container.innerHTML = currentSizes.map((s, i) => `
    <div class="size-chip">
      ${s}
      <button type="button" onclick="removeSize(${i})">×</button>
    </div>
  `).join('');
}

window.removeSize = function(i) {
  currentSizes.splice(i, 1);
  renderSizeChips();
};

document.getElementById('add-size-btn')?.addEventListener('click', () => {
  const input = document.getElementById('f-size-input');
  const val = input?.value.trim();
  if (val && !currentSizes.includes(val)) {
    currentSizes.push(val);
    renderSizeChips();
  }
  if (input) input.value = '';
});

document.getElementById('f-size-input')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('add-size-btn')?.click();
  }
});

// ── Form ──
function resetForm() {
  const form = document.getElementById('product-form');
  form?.reset();
  document.getElementById('edit-id').value = '';
  currentSizes = [];
  renderSizeChips();
  document.getElementById('f-color').value = '#C9A84C';
  document.getElementById('f-visible').checked = true;
  document.getElementById('f-featured').checked = false;
  document.getElementById('form-submit-btn').setAttribute('data-lang-key', 'admin_form_save');
  document.getElementById('form-submit-btn').textContent = LangSystem.t('admin_form_save');
  document.getElementById('form-title').setAttribute('data-lang-key', 'admin_add_product');
  document.getElementById('form-title').textContent = LangSystem.t('admin_add_product');
}

document.getElementById('form-cancel-btn')?.addEventListener('click', () => {
  resetForm();
  showSection('all-products');
});

window.editProduct = async function(id) {
  const products = await getProducts();
  const p = products.find(prod => prod.id === id);
  if (!p) return;

  document.getElementById('edit-id').value = id;
  document.getElementById('f-name-en').value = p.nameEn || '';
  document.getElementById('f-name-ar').value = p.nameAr || '';
  document.getElementById('f-ref').value = p.ref || '';
  document.getElementById('f-price').value = p.price || '';
  document.getElementById('f-color').value = p.color || '#C9A84C';
  document.getElementById('f-color-name').value = p.colorName || '';
  document.getElementById('f-color-name-ar').value = p.colorNameAr || '';
  document.getElementById('f-material').value = p.material || '';
  document.getElementById('f-material-ar').value = p.materialAr || '';
  document.getElementById('f-style').value = p.style || 'Modern';
  document.getElementById('f-image').value = p.image || '';
  document.getElementById('f-desc').value = p.description || '';
  document.getElementById('f-desc-ar').value = p.descriptionAr || '';
  document.getElementById('f-visible').checked = !!p.visible;
  document.getElementById('f-featured').checked = !!p.featured;
  currentSizes = [...(p.sizes || [])];
  renderSizeChips();

  document.getElementById('form-submit-btn').setAttribute('data-lang-key', 'admin_form_update');
  document.getElementById('form-submit-btn').textContent = LangSystem.t('admin_form_update');
  document.getElementById('form-title').setAttribute('data-lang-key', 'admin_add_product');
  document.getElementById('form-title').textContent = LangSystem.t('admin_add_product');

  showSection('add-product');
};

window.deleteProduct = async function(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  const products = await getProducts();
  const updated = products.filter(p => p.id !== id);
  saveProducts(updated);
  loadTable();
  loadStats();
  showToast(LangSystem.t('toast_deleted'), 'success');
};

document.getElementById('product-form')?.addEventListener('submit', async e => {
  e.preventDefault();

  const editId = document.getElementById('edit-id').value;
  const isEdit = !!editId;

  const products = await getProducts();
  const newId = isEdit ? parseInt(editId) : Math.max(0, ...products.map(p => p.id)) + 1;

  const product = {
    id: newId,
    ref: document.getElementById('f-ref').value.trim(),
    nameEn: document.getElementById('f-name-en').value.trim(),
    nameAr: document.getElementById('f-name-ar').value.trim(),
    price: parseFloat(document.getElementById('f-price').value) || 0,
    color: document.getElementById('f-color').value,
    colorName: document.getElementById('f-color-name').value.trim(),
    colorNameAr: document.getElementById('f-color-name-ar').value.trim(),
    material: document.getElementById('f-material').value.trim(),
    materialAr: document.getElementById('f-material-ar').value.trim(),
    style: document.getElementById('f-style').value,
    sizes: [...currentSizes],
    image: document.getElementById('f-image').value.trim(),
    description: document.getElementById('f-desc').value.trim(),
    descriptionAr: document.getElementById('f-desc-ar').value.trim(),
    visible: document.getElementById('f-visible').checked,
    featured: document.getElementById('f-featured').checked,
  };

  if (!product.nameEn || !product.ref || !product.price) {
    showToast(LangSystem.t('toast_error'), 'error');
    return;
  }

  let updated;
  if (isEdit) {
    updated = products.map(p => p.id === newId ? product : p);
  } else {
    updated = [...products, product];
  }

  saveProducts(updated);
  resetForm();
  loadTable();
  loadStats();
  showSection('all-products');
  showToast(isEdit ? LangSystem.t('toast_updated') : LangSystem.t('toast_saved'), 'success');
});

// ── Toast ──
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type}`;
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => toast.classList.remove('show'), 3500);
}
