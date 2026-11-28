import { openModal } from './modal.js';

/* ============================================================
   15. IMAGE MODAL — full-screen gallery viewer
   ============================================================ */
export function initImageModal() {
  const imageModal      = document.getElementById('imageModal');
  const imageModalImg   = document.getElementById('imageModalImg');
  const imageModalMeta  = document.getElementById('imageModalMeta');
  const imageModalTitle = document.getElementById('imageModalTitle');
  const imageModalDesc  = document.getElementById('imageModalDesc');
  const imageModalPrev  = imageModal ? imageModal.querySelector('[data-nav="prev"]') : null;
  const imageModalNext  = imageModal ? imageModal.querySelector('[data-nav="next"]') : null;

  let imageGallery = [];
  let imageIndex = 0;

  const renderImageModal = () => {
    if (!imageGallery.length || !imageModalImg) return;
    const item = imageGallery[imageIndex] || {};

    imageModalImg.src = item.src || '';
    imageModalImg.alt = item.alt || item.title || '';

    // SECURITY: Escape text content for safety
    if (imageModalMeta)  imageModalMeta.textContent  = item.meta  || '';
    if (imageModalTitle) imageModalTitle.textContent = item.title || '';
    if (imageModalDesc)  imageModalDesc.textContent  = item.desc  || '';

    const multi = imageGallery.length > 1;
    if (imageModalPrev) imageModalPrev.style.display = multi ? '' : 'none';
    if (imageModalNext) imageModalNext.style.display = multi ? '' : 'none';
  };

  const openImageModal = (images, startIndex = 0) => {
    if (!imageModal || !images || !images.length) return;

    imageGallery = Array.isArray(images) ? images : [images];
    imageIndex = Math.max(0, Math.min(startIndex, imageGallery.length - 1));

    renderImageModal();
    openModal(imageModal);
  };

  const navigateImage = (dir) => {
    if (imageGallery.length < 2) return;
    imageIndex = (imageIndex + dir + imageGallery.length) % imageGallery.length;
    renderImageModal();
  };

  if (imageModalPrev) imageModalPrev.addEventListener('click', () => navigateImage(-1));
  if (imageModalNext) imageModalNext.addEventListener('click', () => navigateImage(1));

  document.addEventListener('keydown', (e) => {
    if (!imageModal || !imageModal.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  navigateImage(-1);
    if (e.key === 'ArrowRight') navigateImage(1);
  });

  if (imageModal) {
    let touchStartX = 0;
    let touchStartY = 0;

    imageModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    imageModal.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      const dy = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        navigateImage(dx < 0 ? 1 : -1);
      }
    }, { passive: true });
  }

  document.querySelectorAll('.featured-project-thumb').forEach((thumb) => {
    const img = thumb.querySelector('img');
    if (!img) return;

    thumb.style.cursor = 'zoom-in';

    let touchStartX = 0;
    let touchStartY = 0;
    let didSwipe = false;

    thumb.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      didSwipe = false;
    }, { passive: true });

    thumb.addEventListener('touchmove', (e) => {
      const dx = Math.abs(e.touches[0].clientX - touchStartX);
      const dy = Math.abs(e.touches[0].clientY - touchStartY);
      if (dx > 10 || dy > 10) didSwipe = true;
    }, { passive: true });

    thumb.addEventListener('click', (e) => {
      if (didSwipe) { didSwipe = false; return; }
      if (e.target.closest('.project-status, .featured-flag')) return;

      const card    = thumb.closest('.featured-project-card');
      const titleEl = card ? card.querySelector('h3') : null;
      const catEl   = card ? card.querySelector('.project-category') : null;

      openImageModal([{
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt') || '',
        meta: catEl ? catEl.textContent.trim() : 'Project',
        title: titleEl ? titleEl.textContent.trim() : (img.getAttribute('alt') || ''),
        desc: 'Click outside or press ESC to close.'
      }], 0);
    });
  });
}
