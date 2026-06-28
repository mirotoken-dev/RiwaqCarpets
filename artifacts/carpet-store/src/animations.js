const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initScrollAnimations() {
  if (reducedMotion) {
    document.querySelectorAll('.anim-fadein, .anim-child').forEach(el => el.classList.add('anim-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('anim-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.anim-fadein').forEach((el, i) => {
    el.style.setProperty('--anim-delay', `${i * 0.07}s`);
    io.observe(el);
  });
  document.querySelectorAll('.anim-stagger > .anim-child').forEach((el, i) => {
    el.style.setProperty('--anim-delay', `${i * 0.1}s`);
    io.observe(el);
  });
}

export function initCounters() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      if (reducedMotion) { el.textContent = target + suffix; io.unobserve(el); return; }
      const steps = 60;
      const duration = 1800;
      let current = 0;
      const tick = setInterval(() => {
        current += target / steps;
        if (current >= target) { current = target; clearInterval(tick); }
        el.textContent = Math.round(current) + suffix;
      }, duration / steps);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num[data-target]').forEach(el => io.observe(el));
}

export function initParallax() {
  if (reducedMotion) return;
  const pattern = document.querySelector('.hero-pattern');
  if (!pattern) return;
  window.addEventListener('scroll', () => {
    pattern.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }, { passive: true });
}

export function initNavbarScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const handler = () => nav.classList.toggle('navbar-scrolled', window.scrollY > 80);
  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

export function initPromoSlider() {
  const slider = document.querySelector('.promo-slider');
  if (!slider) return;
  const slides = [...slider.querySelectorAll('.promo-slide')];
  const dots = [...slider.querySelectorAll('.promo-dot')];
  if (!slides.length) return;
  let cur = 0, timer;

  const show = n => {
    slides[cur].classList.remove('active');
    dots[cur]?.classList.remove('active');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('active');
    dots[cur]?.classList.add('active');
  };

  const start = () => { timer = setInterval(() => show(cur + 1), 4000); };
  const stop = () => clearInterval(timer);

  slides[0].classList.add('active');
  dots[0]?.classList.add('active');
  start();

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  slider.querySelector('.promo-prev')?.addEventListener('click', () => { stop(); show(cur - 1); start(); });
  slider.querySelector('.promo-next')?.addEventListener('click', () => { stop(); show(cur + 1); start(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { stop(); show(i); start(); }));
}

export function initTestimonialCarousel() {
  const track = document.querySelector('.testimonial-track');
  if (!track) return;
  const cards = [...track.querySelectorAll('.testimonial-card')];
  if (!cards.length) return;
  let cur = 0, timer;

  const getVisible = () => window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;

  const update = () => {
    const v = getVisible();
    const max = Math.max(0, cards.length - v);
    if (cur > max) cur = max;
    track.style.transform = `translateX(-${cur * (100 / v)}%)`;
  };

  const next = () => { const v = getVisible(); const max = cards.length - v; cur = cur < max ? cur + 1 : 0; update(); };
  const prev = () => { const v = getVisible(); const max = cards.length - v; cur = cur > 0 ? cur - 1 : max; update(); };
  const start = () => { timer = setInterval(next, 5000); };
  const stop = () => clearInterval(timer);

  track.closest('.testimonial-wrapper')?.addEventListener('mouseenter', stop);
  track.closest('.testimonial-wrapper')?.addEventListener('mouseleave', start);
  document.querySelector('.testimonial-prev')?.addEventListener('click', () => { stop(); prev(); start(); });
  document.querySelector('.testimonial-next')?.addEventListener('click', () => { stop(); next(); start(); });

  update();
  start();
  window.addEventListener('resize', update);
}

export function initCookieBanner() {
  if (localStorage.getItem('mt_cookie')) return;
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  setTimeout(() => banner.classList.add('visible'), 2200);
  document.getElementById('cookie-accept')?.addEventListener('click', () => {
    localStorage.setItem('mt_cookie', '1');
    banner.classList.remove('visible');
  });
}

export function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
