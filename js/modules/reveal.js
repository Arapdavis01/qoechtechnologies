/* ============================================================
   07. FADE-UP SCROLL ANIMATIONS
   ------------------------------------------------------------
   On mobile, sections that become horizontal carousels have
   their children marked visible immediately — otherwise cards
   that scroll off to the right stay invisible until swiped.
   ============================================================ */
export function initReveal() {
  const CAROUSEL_PARENTS = '.services-grid, .featured-projects-grid, .process-timeline, .why-grid';
  const isMobileLoad = window.innerWidth <= 768;

  const fadeEls = document.querySelectorAll(
    '.fade-up, .section-head, .section-divider, ' +
    '.service-card, .solution-card, ' +
    '.featured-project-card, .other-system-item, .capability-item, ' +
    '.tech-category, .why-card, .process-step, .stat-card, ' +
    '.value-item, .contact-card, .testimonial-carousel, ' +
    '.eagle-readout'
  );

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    fadeEls.forEach((el, i) => {
      el.classList.add('fade-up');

      // Mobile carousel children — reveal instantly, no observer
      if (isMobileLoad && el.closest(CAROUSEL_PARENTS)) {
        el.classList.add('visible');
        return;
      }

      el.style.transitionDelay = Math.min(i * 40, 240) + 'ms';
      fadeObserver.observe(el);
    });
  } else {
    fadeEls.forEach((el) => el.classList.add('visible'));
  }
}
