let _overlay = null;

function getOverlay() {
  if (_overlay) return _overlay;

  _overlay = document.createElement('div');
  _overlay.id = 'lightbox-overlay';
  _overlay.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-container">
      <button class="lb-close" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <div class="lb-img-wrap">
        <img class="lb-img" src="" alt="" />
      </div>
      <div class="lb-caption"></div>
    </div>
  `;
  document.body.appendChild(_overlay);

  _overlay.querySelector('.lb-backdrop').addEventListener('click', close);
  _overlay.querySelector('.lb-close').addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  return _overlay;
}

export function open(src, alt) {
  if (!src) return;
  const overlay = getOverlay();
  const img = overlay.querySelector('.lb-img');
  const caption = overlay.querySelector('.lb-caption');

  img.src = '';
  img.alt = alt || '';
  caption.textContent = alt || '';

  overlay.classList.add('lb-visible');
  document.body.style.overflow = 'hidden';

  img.onload = () => overlay.querySelector('.lb-img-wrap').classList.add('lb-loaded');
  img.onerror = () => {};
  img.src = src;
}

export function close() {
  if (!_overlay) return;
  _overlay.classList.remove('lb-visible');
  _overlay.querySelector('.lb-img-wrap').classList.remove('lb-loaded');
  document.body.style.overflow = '';
}

window.__openLightbox = open;
