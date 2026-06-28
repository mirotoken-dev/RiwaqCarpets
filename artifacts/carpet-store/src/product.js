import { initShared, fetchProducts, buildProductCard, WA_NUMBER, PROMO_CODE } from './app.js';
import { LangSystem } from './lang.js';
import { open as openLightbox } from './lightbox.js';

initShared('catalog');

let selectedSize = '';
let currentProduct = null;

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);

  const allProducts = await fetchProducts();
  const product = allProducts.find(p => p.id === id);

  const content = document.getElementById('product-content');

  if (!product) {
    content.innerHTML = `
      <div style="text-align:center;padding:6rem 2rem;color:var(--text-light)">
        <div style="font-size:3rem;margin-bottom:1rem">🔍</div>
        <h2 style="margin-bottom:1rem" data-lang-key="product_not_found">Product not found.</h2>
        <a href="/catalog.html" class="btn-secondary" data-lang-key="product_back">← Back to Catalog</a>
      </div>`;
    return;
  }

  currentProduct = product;
  selectedSize = product.sizes?.[0] || '';

  document.title = `${product.nameEn} — MaisonTapis`;

  const lang = LangSystem.current;
  const name = lang === 'ar' ? product.nameAr : product.nameEn;
  const nameAlt = lang === 'ar' ? product.nameEn : product.nameAr;
  const desc = lang === 'ar' ? product.descriptionAr : product.description;
  const material = lang === 'ar' ? product.materialAr : product.material;
  const style = lang === 'ar' ? product.styleAr : product.style;
  const colorName = lang === 'ar' ? product.colorNameAr : product.colorName;

  content.innerHTML = `
    <nav style="padding:1.5rem clamp(1.5rem,5vw,4rem) 0;max-width:1200px;margin:0 auto">
      <div class="product-breadcrumb">
        <a href="/">Home</a><span>/</span>
        <a href="/catalog.html" data-lang-key="nav_catalog">Catalog</a><span>/</span>
        <span style="color:var(--charcoal)">${name}</span>
      </div>
    </nav>
    <div class="product-layout">
      <div class="product-image-wrap">
        ${product.image
          ? `<img id="main-img" src="${product.image}" alt="${name}" class="lb-trigger"
               onclick="window.__openLightbox('${product.image}', '${name.replace(/'/g, "\\'")}');"
               onerror="this.style.display='none';document.getElementById('img-placeholder').style.display='flex'">`
          : ''
        }
        <div id="img-placeholder" class="product-image-placeholder" ${product.image ? 'style="display:none"' : ''}>🪅</div>
        <span class="product-ref-badge">${product.ref}</span>
      </div>

      <div class="product-details">
        <h1 class="product-name" id="product-name">${name}</h1>
        <p class="product-name-ar" id="product-name-alt">${nameAlt || ''}</p>
        <div class="product-price">$${product.price.toLocaleString()}</div>

        <div class="product-attrs">
          <div class="attr-pill">
            <div style="width:12px;height:12px;border-radius:50%;background:${product.color};border:1px solid var(--border)"></div>
            <strong data-lang-key="product_color">Color:</strong> ${colorName}
          </div>
          <div class="attr-pill"><strong data-lang-key="product_material">Material:</strong> ${material}</div>
          <div class="attr-pill"><strong data-lang-key="product_style">Style:</strong> ${style}</div>
        </div>

        ${product.sizes?.length ? `
          <div class="size-selector">
            <label data-lang-key="product_select_size">Select Size</label>
            <div class="size-buttons" id="size-buttons">
              ${product.sizes.map((s, i) => `
                <button class="size-btn ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="product-divider"></div>
        <p class="product-desc">${desc || ''}</p>
        <div class="product-divider"></div>

        <div class="product-cta">
          <a id="order-btn" class="btn-whatsapp" href="#" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            <span data-lang-key="product_order_btn">Order on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  `;

  bindSizeButtons();
  updateOrderLink();

  // Related products
  const related = (await fetchProducts())
    .filter(p => p.visible && p.id !== product.id && (p.style === product.style || p.material === product.material))
    .slice(0, 3);
  const relGrid = document.getElementById('related-grid');
  if (relGrid && related.length) {
    relGrid.innerHTML = related.map(p => buildProductCard(p)).join('');
  } else if (relGrid) {
    document.querySelector('.related-section').style.display = 'none';
  }
}

function bindSizeButtons() {
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = btn.getAttribute('data-size');
      updateOrderLink();
    });
  });
}

function updateOrderLink() {
  const btn = document.getElementById('order-btn');
  if (!btn || !currentProduct) return;
  const msg = `Hi, I'm interested in "${currentProduct.nameEn}" Ref: ${currentProduct.ref} in size ${selectedSize || 'any'}. Can I get more info? I have a promo code ${PROMO_CODE}.`;
  btn.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

init();
