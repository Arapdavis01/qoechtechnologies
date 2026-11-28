/* ============================================================
   20. MOBILE CAROUSEL PAGINATION
   ============================================================ */
export function initCarousel() {
    const TRACK_SELECTORS = [
      '.services-grid',
      '.featured-projects-grid',
      '.process-timeline',
      '.why-grid'
    ];
    const MQ = window.matchMedia('(max-width: 768px)');
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduce) return;

    const tracks = [];
    TRACK_SELECTORS.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => tracks.push(el));
    });
    if (!tracks.length) return;

    const buildUI = (track) => {
      if (track.dataset.carouselReady === '1') return;
      track.dataset.carouselReady = '1';

      const meta = document.createElement('div');
      meta.className = 'mobile-carousel-meta';
      meta.innerHTML =
        '<span class="mobile-carousel-hint" aria-hidden="true">' +
          '<i class="fas fa-hand-pointer"></i><span>Swipe</span>' +
        '</span>' +
        '<div class="mobile-carousel-dots" aria-hidden="true"></div>';

      track.parentNode.insertBefore(meta, track.nextSibling);

      const dotsWrap = meta.querySelector('.mobile-carousel-dots');
      const hint     = meta.querySelector('.mobile-carousel-hint');

      const cards = Array.from(track.children).filter(
        (c) => c.nodeType === 1
      );

      if (cards.length < 2) {
        meta.remove();
        track.dataset.carouselReady = '';
        return;
      }

      const dots = cards.map((card, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'mcd-dot';
        dot.setAttribute('aria-label', `Go to card ${i + 1}`);
        dot.addEventListener('click', () => {
          const targetLeft = card.offsetLeft - track.offsetLeft;
          track.scrollTo({ left: targetLeft, behavior: 'smooth' });
        });
        dotsWrap.appendChild(dot);
        return dot;
      });

      let rafLocked = false;
      const updateActiveDot = () => {
        const trackLeft = track.scrollLeft;
        const trackWidth = track.clientWidth;
        const viewCenter = trackLeft + trackWidth / 2;

        let bestIndex = 0;
        let bestDist = Infinity;

        cards.forEach((card, i) => {
          const cardCenter =
            card.offsetLeft - track.offsetLeft + card.offsetWidth / 2;
          const dist = Math.abs(cardCenter - viewCenter);
          if (dist < bestDist) {
            bestDist = dist;
            bestIndex = i;
          }
        });

        dots.forEach((d, i) =>
          d.classList.toggle('active', i === bestIndex)
        );
      };

      const onScroll = () => {
        if (rafLocked) return;
        rafLocked = true;
        requestAnimationFrame(() => {
          updateActiveDot();
          rafLocked = false;
        });
      };

      track.addEventListener('scroll', onScroll, { passive: true });

      let hintDismissed = false;
      const dismissHint = () => {
        if (hintDismissed) return;
        hintDismissed = true;
        hint.classList.add('hidden');
        setTimeout(() => hint.remove(), 600);
      };
      track.addEventListener('scroll', dismissHint, { passive: true, once: true });
      track.addEventListener('touchstart', dismissHint, { passive: true, once: true });
      setTimeout(dismissHint, 5000);

      if ('ResizeObserver' in window) {
        const ro = new ResizeObserver(() => updateActiveDot());
        ro.observe(track);
      }

      updateActiveDot();
    };

    const teardownUI = (track) => {
      const meta = track.parentNode.querySelector(':scope > .mobile-carousel-meta');
      if (meta) meta.remove();
      track.dataset.carouselReady = '';
    };

    const syncAll = () => {
      const isMobile = MQ.matches;
      tracks.forEach((track) => {
        if (isMobile) {
          buildUI(track);
        } else {
          teardownUI(track);
        }
      });
    };

    syncAll();

    if (MQ.addEventListener) MQ.addEventListener('change', syncAll);
    else if (MQ.addListener) MQ.addListener(syncAll);
}
