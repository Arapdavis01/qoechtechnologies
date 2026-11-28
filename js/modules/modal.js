/* ============================================================
   11. MODAL HELPERS
   ============================================================ */
let lastFocusedEl = null;

export function openModal(modal) {
  if (!modal) return;
  lastFocusedEl = document.activeElement;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const focusable = modal.querySelector('button, [href], input, select, textarea');
  if (focusable) setTimeout(() => focusable.focus(), 80);
}

export function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');

  const anyOpen = document.querySelector('.modal.open');
  if (!anyOpen) document.body.style.overflow = '';

  if (lastFocusedEl && lastFocusedEl.focus) lastFocusedEl.focus();
}

export function initModals() {
document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('[data-close]');
    if (!closeBtn) return;

    const modal = closeBtn.closest('.modal');
    if (!modal) return;

    if (closeBtn.tagName === 'A' && closeBtn.getAttribute('href') === '#contact') {
      closeModal(modal);
      return;
    }

    e.preventDefault();
    closeModal(modal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.open').forEach((m) => closeModal(m));
    }
  });

  // Keep Tab / Shift+Tab inside the open modal
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const modal = document.querySelector('.modal.open');
    if (!modal) return;

    const focusables = Array.from(
      modal.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null);

    if (!focusables.length) { e.preventDefault(); return; }

    const first = focusables[0];
    const last  = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (!modal.contains(active)) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  });
}
