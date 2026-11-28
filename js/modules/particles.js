import { prefersReducedMotion } from '../utils/dom.js';

/* ============================================================
   03. PARTICLES NETWORK — tsParticles with cursor grab
   ============================================================ */
export function initParticles() {
  const initParticles = () => {
    if (typeof tsParticles === 'undefined') return;
    if (!document.getElementById('particles-bg')) return;
    if (prefersReducedMotion) return;
    // Very small phones: skip the particle canvas (saves battery, avoids jank)
    if (window.innerWidth <= 480) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    tsParticles.load('particles-bg', {
      particles: {
        number: {
          value: isMobile ? 22 : 55,
          density: { enable: true, area: 1100 }
        },
        color: {
          value: ['#22C55E', '#B8935A', '#9CA3AF']
        },
        shape: { type: 'circle' },
        opacity: {
          value: 0.22,
          random: true,
          anim: { enable: true, speed: 0.25, min: 0.06, sync: false }
        },
        size: {
          value: { min: 0.6, max: 1.8 },
          random: true
        },
        move: {
          enable: true,
          speed: 0.3,
          direction: 'none',
          random: true,
          straight: false,
          outModes: 'out'
        },
        line_linked: {
          enable: true,
          distance: 140,
          color: '#22C55E',
          opacity: 0.08,
          width: 1
        }
      },
      interactivity: {
        detectsOn: 'window',
        events: {
          onHover: {
            enable: !isMobile,
            mode: 'grab',
            parallax: {
              enable: true,
              force: 22,
              smooth: 25
            }
          },
          onClick: {
            enable: !isMobile,
            mode: 'push'
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 190,
            line_linked: { opacity: 0.26 }
          },
          push: { quantity: 2 }
        }
      },
      background: { color: 'transparent' },
      detectRetina: !isMobile
    });
  };

  if (typeof tsParticles !== 'undefined') {
    initParticles();
  } else {
    window.addEventListener('load', initParticles);
  }
}
