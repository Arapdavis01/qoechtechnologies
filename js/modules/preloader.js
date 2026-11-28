/* ============================================================
   01. PRELOADER
   ============================================================ */
export function initPreloader() {
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => preloader.classList.add('hidden'), 900);
    }
  });
}
