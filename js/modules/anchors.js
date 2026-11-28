/* ============================================================
   05. SMOOTH SCROLL FOR ANCHOR LINKS
   Reads the actual navbar bottom edge so the scroll position
   accounts for the floating pill's top offset.
   ============================================================ */
export function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navbar = document.getElementById('navbar');
      const navBottom = navbar ? navbar.getBoundingClientRect().bottom : 72;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navBottom - 20;
      window.scrollTo({ top, behavior: 'smooth' });

      history.replaceState(null, '', targetId);
    });
  });
}
