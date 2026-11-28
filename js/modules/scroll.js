import { hasFinePointer } from '../utils/dom.js';

/* ============================================================
   18. UNIFIED SCROLL LOOP
   ============================================================ */
export function initScroll() {
  const scrollProgressEl = document.getElementById('scrollProgress');
  const navbarEl         = document.getElementById('navbar');
  const backToTopEl      = document.getElementById('backToTop');
  const heroEl           = document.querySelector('.hero');
  const statsGridEl      = document.querySelector('.stats-grid');
  const statNumbersAll   = document.querySelectorAll('.stat-number');
  const sectionList      = document.querySelectorAll('section[id]');
  const navLinkEls       = document.querySelectorAll('.nav-link');

  const updateProgressBar = () => {
    if (!scrollProgressEl) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressEl.style.width = pct + '%';
  };

  const updateNavbarState = () => {
    if (!navbarEl) return;
    navbarEl.classList.toggle('scrolled', window.scrollY > 40);
  };

  const updateActiveLink = () => {
    if (!sectionList.length) return;
    const scrollPos = window.scrollY + 160;
    let currentId = '';

    sectionList.forEach((section) => {
      const top = section.offsetTop;
      const height = section.clientHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinkEls.forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + currentId);
    });
  };

  const updateBackToTop = () => {
    if (!backToTopEl) return;
    backToTopEl.classList.toggle('visible', window.scrollY > 500);
  };

  const updateHeroParallax = () => {
    if (!heroEl || !hasFinePointer) return;
    const offset = window.scrollY;
    if (offset > window.innerHeight) return;
    const grid = heroEl.querySelector('.hero-grid');
    if (grid) grid.style.transform = `translateY(${offset * 0.15}px)`;
  };

  let statsAnimated = false;
  const runStatsAnimation = () => {
    statNumbersAll.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1600;
      const startTime = performance.now();

      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(tick);
    });
  };

  const maybeAnimateStats = () => {
    if (statsAnimated || !statsGridEl) return;
    const rect = statsGridEl.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      statsAnimated = true;
      runStatsAnimation();
    }
  };

  let scrollTicking = false;
  const handleScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;

    window.requestAnimationFrame(() => {
      updateProgressBar();
      updateNavbarState();
      updateActiveLink();
      updateBackToTop();
      updateHeroParallax();
      maybeAnimateStats();
      scrollTicking = false;
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  window.addEventListener('load', () => {
    updateProgressBar();
    updateNavbarState();
    updateActiveLink();
    updateBackToTop();
    maybeAnimateStats();
  });

  if (backToTopEl) {
    backToTopEl.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
