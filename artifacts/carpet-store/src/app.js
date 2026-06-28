import { LangSystem } from './lang.js';
import { Wishlist } from './wishlist.js';
import { open as openLightbox } from './lightbox.js';
import { initNavbarScroll, initScrollAnimations, initCookieBanner, initBackToTop } from './animations.js';

const WA_NUMBER = '201000000000';
const PROMO_CODE = 'SAVE10';

export { WA_NUMBER, PROMO_CODE };

export function waFloatUrl() {
  const msg = LangSystem.t('wa_float_msg');
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function waProductUrl(product, selectedSize) {
  const name = LangSystem.current === 'ar' ? product.nameAr : product.nameEn;
  const msg = `Hi, I'm interested in "${name}" Ref: ${product.ref} in size ${selectedSize}. Can I get more info? I have a promo code ${PROMO_CODE}.`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function buildNavbar(activePage) {
  const lang = LangSystem.current;
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const wCount = Wishlist.count();

  nav.innerHTML = `
    <div class="navbar-brand">
      <div class="brand-logo">
        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      </div>
      <span class="brand-name">Maison<span>Tapis</span></span>
    </div>

    <nav class="nav-links-desktop">
      <ul class="nav-links">
        <li><a href="/" data-lang-key="nav_home" class="${activePage === 'home' ? 'active' : ''}">Home</a></li>
        <li><a href="/catalog.html" data-lang-key="nav_catalog" class="${activePage === 'catalog' ? 'active' : ''}">Catalog</a></li>
        <li><a href="mailto:contact@maisontapis.com" data-lang-key="nav_contact">Contact</a></li>
      </ul>
    </nav>

    <div class="nav-actions">
      <a href="/wishlist.html" class="nav-wishlist-btn ${activePage === 'wishlist' ? 'active' : ''}" aria-label="Wishlist">
        <svg viewBox="0 0 24 24" fill="${activePage === 'wishlist' ? 'var(--gold)' : 'none'}" stroke="currentColor" stroke-width="1.8">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        ${wCount > 0 ? `<span class="wishlist-count">${wCount}</span>` : ''}
      </a>
      <div class="lang-toggle">
        <button class="lang-btn ${lang === 'en' ? 'active' : ''}" data-lang-btn="en">EN</button>
        <button class="lang-btn ${lang === 'ar' ? 'active' : ''}" data-lang-btn="ar">AR</button>
      </div>
      <button class="hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;

  const mobileNav = document.getElementById('mobile-nav');
  if (mobileNav) {
    mobileNav.innerHTML = `
      <ul class="nav-links">
        <li><a href="/" data-lang-key="nav_home">Home</a></li>
        <li><a href="/catalog.html" data-lang-key="nav_catalog">Catalog</a></li>
        <li><a href="/wishlist.html" data-lang-key="nav_wishlist">Wishlist${wCount > 0 ? ` (${wCount})` : ''}</a></li>
        <li><a href="mailto:contact@maisontapis.com" data-lang-key="nav_contact">Contact</a></li>
      </ul>
      <div class="lang-toggle">
        <button class="lang-btn ${lang === 'en' ? 'active' : ''}" data-lang-btn="en">EN</button>
        <button class="lang-btn ${lang === 'ar' ? 'active' : ''}" data-lang-btn="ar">AR</button>
      </div>
    `;
  }

  const hamburger = document.getElementById('hamburger');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
  }

  LangSystem.bindButtons();
  LangSystem.apply(LangSystem.current);
}

export function buildFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="brand-name" style="font-family:'Playfair Display',serif;font-size:1.4rem;margin-bottom:1rem;">
          Maison<span style="color:var(--gold)">Tapis</span>
        </div>
        <p data-lang-key="footer_brand_desc">Purveyors of the world's finest handcrafted carpets since 1985. Each piece is a unique work of art.</p>
        <div class="footer-newsletter">
          <span class="nl-label">Newsletter</span>
          <div class="nl-form">
            <input class="nl-input" type="email" placeholder="your@email.com" aria-label="Email for newsletter" />
            <button class="nl-btn" onclick="this.textContent='✓';this.disabled=true" aria-label="Subscribe">Subscribe</button>
          </div>
        </div>
        <div class="footer-payment">
          <span class="pay-badge">Visa</span>
          <span class="pay-badge">Mastercard</span>
          <span class="pay-badge">PayPal</span>
        </div>
      </div>
      <div>
        <h4 data-lang-key="footer_shop">Shop</h4>
        <ul class="footer-links">
          <li><a href="/" data-lang-key="footer_links_home">Homepage</a></li>
          <li><a href="/catalog.html" data-lang-key="footer_links_catalog">All Carpets</a></li>
          <li><a href="/catalog.html?featured=true" data-lang-key="footer_links_featured">Featured</a></li>
        </ul>
      </div>
      <div>
        <h4 data-lang-key="footer_info">Information</h4>
        <ul class="footer-links">
          <li><a href="#" data-lang-key="footer_about">About Us</a></li>
          <li><a href="#" data-lang-key="footer_care">Carpet Care Guide</a></li>
          <li><a href="#" data-lang-key="footer_shipping">Shipping &amp; Returns</a></li>
        </ul>
      </div>
      <div>
        <h4 data-lang-key="footer_contact_title">Contact</h4>
        <div class="footer-contact">
          <a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            +${WA_NUMBER}
          </a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} MaisonTapis. <span data-lang-key="footer_copyright">All rights reserved.</span></span>
      <div class="social-links">
        <a href="#" aria-label="Instagram" class="instagram">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
        </a>
        <a href="#" aria-label="Facebook" class="facebook">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
        <a href="#" aria-label="Pinterest" class="pinterest">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
        </a>
      </div>
    </div>
  `;
}

export function buildWhatsAppFloat() {
  const btn = document.getElementById('whatsapp-float');
  if (!btn) return;
  btn.href = waFloatUrl();
  btn.setAttribute('aria-label', 'WhatsApp');
  btn.setAttribute('data-tooltip', LangSystem.current === 'ar' ? 'تحدث معنا!' : 'Chat with us!');
}

export function buildProductCard(product) {
  const name = LangSystem.current === 'ar' ? product.nameAr : product.nameEn;
  const nameSecondary = LangSystem.current === 'ar' ? product.nameEn : product.nameAr;
  const defaultSize = product.sizes?.[0] || '';
  const isWishlisted = Wishlist.has(product.id);
  const isLimited = product.id % 3 === 0;

  return `
    <div class="product-card" onclick="window.location.href='/product.html?id=${product.id}'">
      <div class="card-img-wrap">
        ${product.image
          ? `<img src="${product.image}" alt="${name}" loading="lazy" class="lb-trigger"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
               onclick="event.stopPropagation(); window.__openLightbox('${product.image}', '${name.replace(/'/g, "\\'")}');">`
          : ''
        }
        <div class="carpet-placeholder" ${product.image ? 'style="display:none"' : ''}>🪅</div>
        <span class="card-ref">${product.ref}</span>
        ${product.featured ? `<span class="card-badge">Featured</span>` : ''}
        <span class="card-stock-badge ${isLimited ? 'limited' : 'in-stock'}">${isLimited ? 'Limited' : 'In Stock'}</span>
        <button
          class="heart-btn ${isWishlisted ? 'active' : ''}"
          data-product-id="${product.id}"
          aria-label="Save to wishlist"
          onclick="event.stopPropagation(); window.__toggleWishlist(${product.id}, this)"
        >
          <svg viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <button class="quick-view-btn" onclick="event.stopPropagation(); window.location.href='/product.html?id=${product.id}'">Quick View</button>
      </div>
      <div class="card-body">
        <div class="card-meta">
          <div class="color-dot" style="background:${product.color}"></div>
          <span class="size-tag">${defaultSize}</span>
          <span class="size-tag" style="background:transparent;border-color:transparent;font-style:italic;color:var(--text-light)">${LangSystem.current === 'ar' ? product.styleAr : product.style}</span>
        </div>
        <div class="card-name">${name}</div>
        <div class="card-name-ar">${nameSecondary}</div>
        <div class="card-price">$${product.price.toLocaleString()}</div>
        <div class="card-actions">
          <a class="btn-gold-outline" href="/product.html?id=${product.id}" data-lang-key="view_details" onclick="event.stopPropagation()">View Details</a>
          <a class="btn-whatsapp" href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi, I'm interested in "${product.nameEn}" Ref: ${product.ref} (${defaultSize}). Promo: ${PROMO_CODE}`)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            <span data-lang-key="order_whatsapp">Order on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  `;
}

window.__toggleWishlist = function(id, btn) {
  const added = Wishlist.toggle(id);
  const svg = btn.querySelector('svg');
  btn.classList.toggle('active', added);
  if (svg) svg.setAttribute('fill', added ? 'currentColor' : 'none');

  if (added) {
    btn.classList.remove('popping');
    void btn.offsetWidth;
    btn.classList.add('popping');
    btn.addEventListener('animationend', () => btn.classList.remove('popping'), { once: true });
  }

  const navBtn = document.querySelector('.nav-wishlist-btn');
  const count = Wishlist.count();
  if (navBtn) {
    let existingBadge = navBtn.querySelector('.wishlist-count');
    if (count > 0) {
      if (existingBadge) {
        existingBadge.textContent = count;
      } else {
        const span = document.createElement('span');
        span.className = 'wishlist-count';
        span.textContent = count;
        navBtn.appendChild(span);
      }
    } else if (existingBadge) {
      existingBadge.remove();
    }
  }
};

export async function fetchProducts() {
  const cached = sessionStorage.getItem('products_cache');
  if (cached) return JSON.parse(cached);

  const adminData = localStorage.getItem('carpet_products');
  if (adminData) {
    const products = JSON.parse(adminData);
    sessionStorage.setItem('products_cache', JSON.stringify(products));
    return products;
  }

  try {
    const res = await fetch('/products.json');
    const products = await res.json();
    sessionStorage.setItem('products_cache', JSON.stringify(products));
    return products;
  } catch (err) {
    console.error('Failed to load products:', err);
    return [];
  }
}

export function initShared(activePage) {
  LangSystem.init();
  buildNavbar(activePage);
  buildFooter();
  buildWhatsAppFloat();
  LangSystem.apply(LangSystem.current);
  initNavbarScroll();
  initScrollAnimations();
  initCookieBanner();
  initBackToTop();
}
