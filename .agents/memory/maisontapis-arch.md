---
name: MaisonTapis Architecture
description: Key architecture decisions, file layout, and conventions for the luxury carpet store MPA
---

## Stack
- Vite MPA (multi-page app), pure HTML + CSS + Vanilla JS ES modules
- artifact: `artifacts/carpet-store`, workflow: `artifacts/carpet-store: web`
- No framework, no TypeScript

## Key files
- `src/app.js` — shared `initShared()`, `buildNavbar()`, `buildFooter()`, `buildProductCard()`, `fetchProducts()`, `waFloatUrl()`
- `src/animations.js` — `initScrollAnimations`, `initCounters`, `initParallax`, `initNavbarScroll`, `initPromoSlider`, `initTestimonialCarousel`, `initCookieBanner`, `initBackToTop`
- `src/lang.js` — `LangSystem` for EN/AR RTL switching
- `src/catalog.js`, `src/product.js`, `src/wishlist-page.js`, `src/admin.js`
- `src/lightbox.js` — fullscreen image overlay, `open(src, alt)` export
- `public/products.json` — 11 products; products 9–11 (LA639, LA-STR, LA453) have real images
- `src/styles.css` — 1600+ lines; new sections appended after the `.skeleton` block

## Conventions
- WA_NUMBER = `'201000000000'`, PROMO_CODE = `'SAVE10'`
- All pages call `initShared(pageName)` which wires navbar, footer, WA float, scroll animations, cookie banner, back-to-top
- index.html additionally calls page-specific animations: `initPromoSlider`, `initTestimonialCarousel`, `initCounters`, `initParallax`
- `.anim-fadein` + `.anim-visible` for IntersectionObserver scroll reveals; `.anim-stagger > .anim-child` for staggered children
- `.navbar-scrolled` added via JS on scroll >80px
- Cookie consent stored in `localStorage.mt_cookie`
- Product card stagger animation: inline style transition with RAF double-frame trick (not CSS classes)
- Catalog has URL param support: `?style=Classic` pre-selects style filter

**Why:** No framework was an explicit user requirement for a fast, lightweight luxury storefront.
