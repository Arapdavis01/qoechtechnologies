import { prefersReducedMotion } from '../utils/dom.js';

/* ============================================================
   12. TESTIMONIAL CAROUSEL
   ============================================================ */
export function initTestimonials() {
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
  const testimonialCarousel = document.getElementById('testimonialCarousel');

  if (testimonialSlides.length && testimonialDots.length) {
    let currentSlide = 0;
    let autoplayTimer = null;

    const goToSlide = (index) => {
      testimonialSlides.forEach((s) => s.classList.remove('active'));
      testimonialDots.forEach((d) => d.classList.remove('active'));
      testimonialSlides[index].classList.add('active');
      testimonialDots[index].classList.add('active');
      currentSlide = index;
    };

    const nextSlide = () => {
      const next = (currentSlide + 1) % testimonialSlides.length;
      goToSlide(next);
    };

    const startAutoplay = () => {
      stopAutoplay();
      if (prefersReducedMotion) return;
      autoplayTimer = setInterval(nextSlide, 6000);
    };

    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    testimonialDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goToSlide(i);
        startAutoplay();
      });
    });

    if (testimonialCarousel) {
      testimonialCarousel.addEventListener('mouseenter', stopAutoplay);
      testimonialCarousel.addEventListener('mouseleave', startAutoplay);
      // Touch and keyboard users: pause while interacting, resume after
      testimonialCarousel.addEventListener('touchstart', stopAutoplay, { passive: true });
      testimonialCarousel.addEventListener('touchend', startAutoplay, { passive: true });
      testimonialCarousel.addEventListener('focusin', stopAutoplay);
      testimonialCarousel.addEventListener('focusout', startAutoplay);
    }

    startAutoplay();
  }
}
