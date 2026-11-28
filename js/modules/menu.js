/* ============================================================
   04. MOBILE MENU + ANIMATED HAMBURGER
   ============================================================ */
export function initMenu() {
  const hamburger   = document.getElementById('hamburger');
  const navMenu     = document.getElementById('navMenu');
  const navOverlay  = document.getElementById('navOverlay');
  const navClose    = document.getElementById('navClose');
  const navLinksAll = document.querySelectorAll('.nav-link');

  const openMenu = () => {
    if (!hamburger || !navMenu) return;
    hamburger.classList.add('open');
    navMenu.classList.add('open');
    if (navOverlay) navOverlay.classList.add('open');
    document.body.classList.add('menu-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    if (!hamburger || !navMenu) return;
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('open');
    document.body.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });
  }

  if (navClose) {
    navClose.addEventListener('click', closeMenu);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  navLinksAll.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger && hamburger.classList.contains('open')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && hamburger && hamburger.classList.contains('open')) {
      closeMenu();
    }
  });
}
