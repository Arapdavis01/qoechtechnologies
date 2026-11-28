import { prefersReducedMotion } from '../utils/dom.js';

/* ============================================================
   06. HERO TYPING EFFECT
   ============================================================ */
export function initTyping() {
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const phrases = [
      'Software Solutions.',
      'Web Platforms.',
      'Mobile Applications.',
      'Cloud Infrastructure.',
      'Cybersecurity.',
      'AI & Automation.'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    if (prefersReducedMotion) {
      typedEl.textContent = phrases[0];
    }

    const typeLoop = () => {
      const current = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
        typedEl.textContent = current.substring(0, charIndex);
      } else {
        charIndex++;
        typedEl.textContent = current.substring(0, charIndex);
      }

      let speed = isDeleting ? 45 : 90;

      if (!isDeleting && charIndex === current.length) {
        speed = 1800;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 400;
      }

      setTimeout(typeLoop, speed);
    };

    if (!prefersReducedMotion) setTimeout(typeLoop, 1400);
  }
}
