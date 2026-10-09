/* ============================================================
   QOECH TECHNOLOGIES — MAIN SCRIPT
   ============================================================
   Table of Contents
   01. Preloader
   02. Cursor Glow
   03. Particles Network (tsParticles + cursor grab)
   04. Mobile Menu + Animated Hamburger
   05. Smooth Scroll for Anchor Links
   06. Hero Typing Effect
   07. Fade-up Scroll Animations
   08. About Tabs
   09. Service Data + Modal
   10. Project Data + Modal
   11. Modal Helpers (close, escape, overlay, delegation)
   12. Testimonial Carousel
   13. Contact Wizard (Request a System)
   14. Footer Year
   15. Image Modal — full-screen gallery viewer
   16. Terminal Modal — code sample viewer
   17. Public API (window.QOECH)
   18. Unified Scroll Loop — progress bar, navbar state,
       active link, back-to-top, hero parallax, stats counter
   19. Eagle Flight Animation — full choreography
   20. Mobile Carousel Pagination — dots + swipe hint
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     00. INITIAL SCROLL RESET
     ------------------------------------------------------------
     Some mobile browsers still restore a previous scroll position
     despite `history.scrollRestoration = 'manual'`, and iOS Safari
     sometimes scrolls to the first focused field on load. This
     forces the page to the top on every load, and pairs with the
     wizard's "no auto-focus on load" behaviour (see Section 13).
     ============================================================ */
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  window.addEventListener('load', () => {
    window.scrollTo(0, 0);
  });


  /* ============================================================
     01. PRELOADER
     ============================================================ */
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => preloader.classList.add('hidden'), 900);
    }
  });


  /* ============================================================
     02. CURSOR GLOW (desktop only)
     ============================================================ */
  const cursorGlow = document.getElementById('cursorGlow');
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (cursorGlow && hasFinePointer) {
    let cx = 0, cy = 0, tx = 0, ty = 0;

    document.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorGlow.style.opacity = '0.85';
    });

    const animateCursor = () => {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      cursorGlow.style.left = cx + 'px';
      cursorGlow.style.top = cy + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
  }


  /* ============================================================
     03. PARTICLES NETWORK — tsParticles with cursor grab
     ============================================================ */
  const initParticles = () => {
    if (typeof tsParticles === 'undefined') return;
    if (!document.getElementById('particles-bg')) return;

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


  /* ============================================================
     04. MOBILE MENU + ANIMATED HAMBURGER
     ============================================================ */
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


  /* ============================================================
     05. SMOOTH SCROLL FOR ANCHOR LINKS
     Reads the actual navbar bottom edge so the scroll position
     accounts for the floating pill's top offset.
     ============================================================ */
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


  /* ============================================================
     06. HERO TYPING EFFECT
     ============================================================ */
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

    setTimeout(typeLoop, 1400);
  }


  /* ============================================================
     07. FADE-UP SCROLL ANIMATIONS
     ------------------------------------------------------------
     On mobile, sections that become horizontal carousels have
     their children marked visible immediately — otherwise cards
     that scroll off to the right stay invisible until swiped.
     ============================================================ */
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


  /* ============================================================
     08. ABOUT TABS
     ============================================================ */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');

      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      tabContents.forEach((content) => {
        content.classList.remove('active');
        if (content.id === tab + '-content') {
          content.classList.add('active');
        }
      });
    });
  });


  /* ============================================================
     09. SERVICE DATA + MODAL
     ============================================================ */
  const serviceData = {
    software: {
      icon: 'fas fa-code',
      title: 'Software Development',
      description: 'Custom business systems and applications built around your exact workflows. From internal tools to full business platforms, we design software that fits the way you work.',
      features: [
        'Custom business logic and rules',
        'Scalable architecture from day one',
        'Role-based access and user management',
        'API integrations with third-party services',
        'Reporting and analytics dashboards',
        'Ongoing maintenance and improvements'
      ],
      process: [
        'Requirements gathering and analysis',
        'System architecture and data modelling',
        'Development with regular check-ins',
        'Testing and quality assurance',
        'Deployment and staff training',
        'Long-term support and iteration'
      ],
      technologies: ['PHP', 'Node.js', 'Python', 'MySQL', 'PostgreSQL', 'REST APIs']
    },
    web: {
      icon: 'fas fa-globe',
      title: 'Web Development',
      description: 'Modern websites, e-commerce platforms and web applications that perform across every device. We build for speed, SEO and conversion.',
      features: [
        'Fully responsive design',
        'SEO-optimized structure',
        'Fast loading and performance tuned',
        'Content management systems',
        'E-commerce and payment integrations',
        'Analytics and tracking setup'
      ],
      process: [
        'Discovery and site planning',
        'Wireframes and design mockups',
        'Development with modern frameworks',
        'Content population and SEO setup',
        'Launch and performance testing',
        'Post-launch support'
      ],
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'React', 'PHP', 'Node.js']
    },
    mobile: {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile Development',
      description: 'Android and cross-platform mobile applications built for real users, real devices and real network conditions.',
      features: [
        'Native Android development',
        'Cross-platform support',
        'Offline-first architecture',
        'Push notifications',
        'Secure authentication',
        'App store deployment'
      ],
      process: [
        'App concept and feature mapping',
        'UI/UX design for mobile',
        'Development and integration',
        'Testing across devices',
        'App store submission',
        'Updates and maintenance'
      ],
      technologies: ['Java', 'Kotlin', 'Android Studio', 'SQLite', 'REST APIs']
    },
    networking: {
      icon: 'fas fa-network-wired',
      title: 'Networking',
      description: 'Network installation, configuration and infrastructure for growing teams. We design networks that are fast, stable and secure.',
      features: [
        'LAN / WAN setup and design',
        'WiFi optimization and coverage',
        'Router and switch configuration',
        'Network monitoring and alerts',
        'VPN and remote access',
        'Structured cabling'
      ],
      process: [
        'Site survey and requirement analysis',
        'Network design and topology planning',
        'Hardware procurement guidance',
        'Installation and configuration',
        'Testing and optimization',
        'Documentation and handover'
      ],
      technologies: ['Cisco', 'MikroTik', 'Ubiquiti', 'TCP/IP', 'VPN', 'Monitoring Tools']
    },
    security: {
      icon: 'fas fa-shield-halved',
      title: 'Cybersecurity',
      description: 'Security solutions, system hardening and digital protection for your data, users and infrastructure.',
      features: [
        'Security audits and assessments',
        'System hardening and patching',
        'Firewall and intrusion detection',
        'Access control and MFA',
        'Backup and disaster recovery',
        'Security awareness training'
      ],
      process: [
        'Security assessment',
        'Vulnerability identification',
        'Hardening and remediation',
        'Monitoring and detection setup',
        'Backup and recovery planning',
        'Ongoing threat monitoring'
      ],
      technologies: ['Firewalls', 'IDS/IPS', 'MFA', 'Encryption', 'Backup Tools', 'SIEM']
    },
    database: {
      icon: 'fas fa-database',
      title: 'Database Solutions',
      description: 'Database design, management and integration for reliable data operations. We build databases that stay fast as they grow.',
      features: [
        'Database schema design',
        'Data normalization and modelling',
        'Query optimization',
        'Replication and failover',
        'Backup and recovery strategies',
        'Migration between engines'
      ],
      process: [
        'Data requirement analysis',
        'Schema and relationship design',
        'Implementation and indexing',
        'Performance tuning',
        'Backup and recovery setup',
        'Ongoing monitoring'
      ],
      technologies: ['MySQL', 'PostgreSQL', 'SQLite', 'Supabase', 'Firebase', 'Redis']
    },
    cloud: {
      icon: 'fas fa-cloud',
      title: 'Cloud Solutions',
      description: 'Cloud deployment, hosting and digital infrastructure that scales with your business without overshooting your budget.',
      features: [
        'Cloud architecture design',
        'Deployment and CI/CD pipelines',
        'Container orchestration',
        'Cost optimization',
        'High availability setup',
        'Monitoring and alerting'
      ],
      process: [
        'Cloud readiness assessment',
        'Architecture and cost planning',
        'Migration or greenfield deployment',
        'CI/CD and automation setup',
        'Monitoring and scaling rules',
        'Ongoing optimization'
      ],
      technologies: ['AWS', 'Vercel', 'Docker', 'Kubernetes', 'GitHub Actions', 'Cloudflare']
    },
    ai: {
      icon: 'fas fa-robot',
      title: 'AI & Automation',
      description: 'Intelligent solutions and business automation that save time, reduce cost and unlock insight from your data.',
      features: [
        'Workflow automation',
        'Smart integrations between systems',
        'Data extraction and processing',
        'Chatbots and virtual assistants',
        'Predictive reporting',
        'Custom AI tooling'
      ],
      process: [
        'Automation opportunity mapping',
        'Data and integration planning',
        'Solution design and build',
        'Testing with real workflows',
        'Deployment and monitoring',
        'Continuous improvement'
      ],
      technologies: ['Python', 'OpenAI API', 'Zapier', 'n8n', 'Node.js', 'APIs']
    }
  };

  const serviceModal = document.getElementById('serviceModal');
  const serviceModalBody = document.getElementById('serviceModalBody');

  const openServiceModal = (key) => {
    const data = serviceData[key];
    if (!data || !serviceModal || !serviceModalBody) return;

    serviceModalBody.innerHTML = `
      <div class="modal-icon-large"><i class="${data.icon}"></i></div>
      <h3>${data.title}</h3>
      <p>${data.description}</p>

      <div class="modal-section">
        <h4><i class="fas fa-check-circle"></i> What's Included</h4>
        <ul>
          ${data.features.map((f) => `<li><i class="fas fa-check"></i><span>${f}</span></li>`).join('')}
        </ul>
      </div>

      <div class="modal-section">
        <h4><i class="fas fa-route"></i> Our Process</h4>
        <ul>
          ${data.process.map((p, i) => `<li><i class="fas fa-circle"></i><span><strong>${String(i + 1).padStart(2, '0')}.</strong> ${p}</span></li>`).join('')}
        </ul>
      </div>

      <div class="modal-section">
        <h4><i class="fas fa-microchip"></i> Technologies</h4>
        <div class="modal-tech">
          ${data.technologies.map((t) => `<span class="tag"><i class="fas fa-cube"></i> ${t}</span>`).join('')}
        </div>
      </div>

      <div class="modal-actions">
        <a href="#contact" class="btn btn-primary" data-close>
          <i class="fas fa-paper-plane"></i>
          <span>Request This Service</span>
        </a>
      </div>
    `;

    openModal(serviceModal);
  };

  document.querySelectorAll('.service-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-service');
      openServiceModal(key);
    });
  });


  /* ============================================================
     10. PROJECT DATA + MODAL
     ============================================================ */
  const projectData = {
    hardware: {
      title: 'Hardware Store Management System',
      category: 'Business Management',
      status: 'Live',
      statusClass: 'status-live',
      image: 'images/projects/hardware.jpg?v=2',
      liveUrl: '',
      overview: 'A management system built for hardware stores that need to manage large product catalogs, track sales and monitor stock levels without spreadsheets.',
      problem: 'Hardware stores deal with hundreds of products, varying units and fast-moving stock. Manual tracking leads to stockouts, overstocking and difficulty knowing what is actually selling.',
      solution: 'We built a system that handles inventory tracking, sales processing, purchase recording and business reporting — designed around how hardware stores actually operate.',
      features: [
        'Inventory management for large catalogs',
        'Fast sales processing and receipts',
        'Low-stock alerts and reorder tracking',
        'Purchase and supplier records',
        'Daily, weekly and monthly business reports'
      ],
      tech: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
      outcome: 'Improved inventory accuracy and gave owners a clear view of stock and sales for better decisions.'
    },

    agrovet: {
      title: 'Agrovet Management System',
      category: 'Inventory & Sales',
      status: 'Live',
      statusClass: 'status-live',
      image: 'images/projects/agrovet.jpg?v=2',
      liveUrl: '',
      overview: 'A complete system for tracking sales, stock levels, purchases and inventory in agrovet businesses.',
      problem: 'Agrovet businesses struggled with manual inventory tracking, leading to stockouts, overstocking and difficulty reconciling sales and purchases.',
      solution: 'We developed a full inventory management system with real-time stock tracking, sales recording, purchase management and reporting.',
      features: [
        'Real-time sales and stock tracking',
        'Purchase and supplier management',
        'Low-stock alerts',
        'Product categorization',
        'Sales and inventory reports'
      ],
      tech: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
      outcome: 'The system now tracks all inventory movements and provides real-time stock visibility for better business decisions.'
    },

    riverview: {
      title: 'Riverview Resort Website',
      category: 'Hospitality & Web',
      status: 'Live',
      statusClass: 'status-live',
      image: 'images/projects/riverview.jpg?v=2',
      liveUrl: 'https://soyriverviewresort.com',
      overview: 'A modern, mobile-first website designed to present the resort, its rooms, amenities and location with clarity.',
      problem: 'The resort needed a professional online presence that matched the experience of the property itself — and that worked flawlessly on mobile, where most guests browse.',
      solution: 'We designed and built a clean, fast, responsive website focused on visuals, clarity and easy navigation.',
      features: [
        'Mobile-first responsive layout',
        'Clean presentation of rooms and amenities',
        'Photo and content sections',
        'Location and contact information',
        'Fast loading performance'
      ],
      tech: ['HTML5', 'CSS3', 'JavaScript'],
      outcome: 'A professional online presence that reflects the resort\'s brand and works across all devices.'
    }
  };

  const projectModal = document.getElementById('projectModal');
  const projectModalBody = document.getElementById('projectModalBody');

  const openProjectModal = (key) => {
    const data = projectData[key];
    if (!data || !projectModal || !projectModalBody) return;

    const liveLinkHTML = data.liveUrl
      ? `<a href="${data.liveUrl}" target="_blank" rel="noopener" class="btn btn-outline">
           <i class="fas fa-up-right-from-square"></i>
           <span>Visit Live Site</span>
         </a>`
      : '';

    projectModalBody.innerHTML = `
      <img src="${data.image}" alt="${data.title}" onerror="this.style.display='none'" />
      <h3>${data.title}</h3>
      <div class="modal-meta">
        <span class="project-category"><i class="fas fa-tag"></i> ${data.category}</span>
        <span class="project-status ${data.statusClass}"><i class="fas fa-circle"></i> ${data.status}</span>
      </div>

      <div class="modal-section">
        <h4><i class="fas fa-circle-info"></i> Overview</h4>
        <p>${data.overview}</p>
      </div>

      <div class="modal-section">
        <h4><i class="fas fa-triangle-exclamation"></i> The Problem</h4>
        <p>${data.problem}</p>
      </div>

      <div class="modal-section">
        <h4><i class="fas fa-lightbulb"></i> The Solution</h4>
        <p>${data.solution}</p>
      </div>

      <div class="modal-section">
        <h4><i class="fas fa-list-check"></i> Key Features</h4>
        <ul>
          ${data.features.map((f) => `<li><i class="fas fa-check"></i><span>${f}</span></li>`).join('')}
        </ul>
      </div>

      <div class="modal-section">
        <h4><i class="fas fa-microchip"></i> Technology Stack</h4>
        <div class="modal-tech">
          ${data.tech.map((t) => `<span class="tag"><i class="fas fa-cube"></i> ${t}</span>`).join('')}
        </div>
      </div>

      <div class="modal-section">
        <h4><i class="fas fa-chart-line"></i> Outcome</h4>
        <p>${data.outcome}</p>
      </div>

      <div class="modal-actions">
        <a href="#contact" class="btn btn-primary" data-close>
          <i class="fas fa-comments"></i>
          <span>Discuss a Similar Project</span>
        </a>
        ${liveLinkHTML}
      </div>
    `;

    openModal(projectModal);
  };

  document.querySelectorAll('.project-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-project');
      openProjectModal(key);
    });
  });


  /* ============================================================
     11. MODAL HELPERS
     ============================================================ */
  let lastFocusedEl = null;

  function openModal(modal) {
    if (!modal) return;
    lastFocusedEl = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const focusable = modal.querySelector('button, [href], input, select, textarea');
    if (focusable) setTimeout(() => focusable.focus(), 80);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');

    const anyOpen = document.querySelector('.modal.open');
    if (!anyOpen) document.body.style.overflow = '';

    if (lastFocusedEl && lastFocusedEl.focus) lastFocusedEl.focus();
  }

  // Event delegation — handles [data-close] even on dynamically injected content
  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('[data-close]');
    if (!closeBtn) return;

    const modal = closeBtn.closest('.modal');
    if (!modal) return;

    if (closeBtn.tagName === 'A' && closeBtn.getAttribute('href') === '#contact') {
      closeModal(modal);
      return;
    }

    e.preventDefault();
    closeModal(modal);
  });

  // Escape key closes any open modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.open').forEach((m) => closeModal(m));
    }
  });


  /* ============================================================
     12. TESTIMONIAL CAROUSEL
     ============================================================ */
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
    }

    startAutoplay();
  }


  /* ============================================================
     13. CONTACT WIZARD — Request a System
     ============================================================ */
  const WIZARD_API = 'https://eaglevision-api.onrender.com/api/public/system-requests';
  const STORAGE_KEY = 'qoech_wizard_v1';
  const TOTAL_STEPS = 4;

  const wizardForm     = document.getElementById('requestForm');
  const wizardProgress = document.getElementById('wizardProgress');
  const progressFill   = document.getElementById('progressFill');
  const wizardSteps    = wizardForm ? wizardForm.querySelectorAll('.wizard-step') : [];
  const progressSteps  = wizardForm ? document.querySelectorAll('.progress-step') : [];
  const wizardStatus   = document.getElementById('wizardStatus');
  const wizardSubmit   = document.getElementById('wizardSubmit');
  const wizardSuccess  = document.getElementById('wizardSuccess');
  const successRefCode = document.getElementById('successRefCode');
  const successReset   = document.getElementById('successReset');
  const hpWebsite      = document.getElementById('hpWebsite');

  let currentStep = 1;

  if (wizardForm) {

    const fieldNames = [
      'full_name', 'email', 'phone', 'company', 'location',
      'system_type', 'title', 'description',
      'features', 'target_users', 'budget_range', 'timeline',
      'reference_urls', 'source'
    ];

    const saveDraft = () => {
      try {
        const data = {};
        fieldNames.forEach((n) => {
          const el = wizardForm.elements[n];
          if (el) data[n] = el.value;
        });
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (_) {}
    };

    const restoreDraft = () => {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        fieldNames.forEach((n) => {
          const el = wizardForm.elements[n];
          if (el && typeof data[n] === 'string') el.value = data[n];
        });
      } catch (_) {}
    };

    const clearDraft = () => {
      try { sessionStorage.removeItem(STORAGE_KEY); } catch (_) {}
    };

    /* showStep(step, direction, scroll, focus)
       - `scroll` controls whether we smooth-scroll the form into view
       - `focus`  controls whether we auto-focus the first field
       On initial page load we pass both as `false` so mobile browsers
       don't scroll down to the contact section on first visit. */
    const showStep = (step, direction, scroll = true, focus = true) => {
      wizardSteps.forEach((el) => {
        const s = parseInt(el.dataset.step, 10);
        el.classList.remove('active', 'leaving-back');
        if (s === step) {
          el.setAttribute('aria-hidden', 'false');
          void el.offsetWidth;
          el.classList.add('active');
          if (direction === 'back') el.classList.add('leaving-back');
        } else {
          el.setAttribute('aria-hidden', 'true');
        }
      });

      progressSteps.forEach((el) => {
        const s = parseInt(el.dataset.step, 10);
        el.classList.toggle('active', s === step);
        el.classList.toggle('complete', s < step);
      });

      if (progressFill) {
        const pct = ((step - 1) / (TOTAL_STEPS - 1)) * 100;
        progressFill.style.width = pct + '%';
      }

      if (wizardProgress) wizardProgress.setAttribute('aria-valuenow', String(step));

      if (focus) {
        const activeEl = wizardForm.querySelector('.wizard-step.active');
        if (activeEl) {
          const firstInput = activeEl.querySelector('input:not(.hp-field), select, textarea');
          if (firstInput) setTimeout(() => firstInput.focus({ preventScroll: true }), 120);
        }
      }

      if (scroll) {
        const formWrap = wizardForm.closest('.contact-form-wrap');
        if (formWrap) {
          const top = formWrap.getBoundingClientRect().top + window.pageYOffset - 100;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    };

    const setFieldError = (name, message) => {
      const input = wizardForm.elements[name];
      const errEl = wizardForm.querySelector(`.field-error[data-error-for="${name}"]`);
      if (input) input.classList.add('invalid');
      if (errEl) {
        errEl.textContent = message || '';
        errEl.classList.toggle('visible', !!message);
      }
    };

    const clearFieldError = (name) => {
      const input = wizardForm.elements[name];
      const errEl = wizardForm.querySelector(`.field-error[data-error-for="${name}"]`);
      if (input) input.classList.remove('invalid');
      if (errEl) {
        errEl.textContent = '';
        errEl.classList.remove('visible');
      }
    };

    const clearAllErrors = () => {
      fieldNames.forEach(clearFieldError);
      if (wizardStatus) {
        wizardStatus.className = 'form-status';
        wizardStatus.textContent = '';
      }
    };

    const isValidEmail = (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

    const validateStep = (step) => {
      let ok = true;

      if (step === 1) {
        const name  = wizardForm.elements['full_name'].value.trim();
        const email = wizardForm.elements['email'].value.trim();

        clearFieldError('full_name');
        clearFieldError('email');

        if (!name) {
          setFieldError('full_name', 'Please enter your full name.');
          ok = false;
        }
        if (!email) {
          setFieldError('email', 'Please enter your email address.');
          ok = false;
        } else if (!isValidEmail(email)) {
          setFieldError('email', 'Please enter a valid email address.');
          ok = false;
        }
      }

      if (step === 2) {
        const type  = wizardForm.elements['system_type'].value;
        const title = wizardForm.elements['title'].value.trim();
        const desc  = wizardForm.elements['description'].value.trim();

        clearFieldError('system_type');
        clearFieldError('title');
        clearFieldError('description');

        if (!type) {
          setFieldError('system_type', 'Please select a system type.');
          ok = false;
        }
        if (!title) {
          setFieldError('title', 'Please give your project a title.');
          ok = false;
        }
        if (!desc) {
          setFieldError('description', 'Please describe your project.');
          ok = false;
        }
      }

      return ok;
    };

    wizardForm.addEventListener('click', (e) => {
      const nextBtn = e.target.closest('.wizard-next');
      const backBtn = e.target.closest('.wizard-back');

      if (nextBtn) {
        if (!validateStep(currentStep)) return;
        currentStep = Math.min(currentStep + 1, TOTAL_STEPS);
        showStep(currentStep, 'forward');
        saveDraft();
      }

      if (backBtn) {
        currentStep = Math.max(currentStep - 1, 1);
        showStep(currentStep, 'back');
      }
    });

    wizardForm.addEventListener('input', saveDraft);
    wizardForm.addEventListener('change', saveDraft);

    const buildPayload = () => {
      const get = (n) => {
        const el = wizardForm.elements[n];
        return el ? String(el.value || '').trim() : '';
      };
      return {
        full_name:      get('full_name'),
        email:          get('email'),
        phone:          get('phone')          || null,
        company:        get('company')        || null,
        location:       get('location')       || null,
        system_type:    get('system_type'),
        title:          get('title'),
        description:    get('description'),
        features:       get('features')       || null,
        target_users:   get('target_users')   || null,
        budget_range:   get('budget_range')   || null,
        timeline:       get('timeline')       || null,
        reference_urls: get('reference_urls') || null,
        attachment_url: null,
        source:         'website'
      };
    };

    const setSubmitting = (isSubmitting) => {
      if (!wizardSubmit) return;

      wizardSubmit.disabled = isSubmitting;

      if (isSubmitting) {
        wizardSubmit.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i><span>Submitting...</span>';
      } else {
        wizardSubmit.innerHTML =
          '<i class="fas fa-paper-plane"></i><span>Submit Request</span>';
      }

      wizardForm
        .querySelectorAll('input, select, textarea, button')
        .forEach((el) => {
          if (el === wizardSubmit) return;
          if (el.classList.contains('wizard-back') ||
              el.classList.contains('wizard-next')) {
            el.disabled = isSubmitting;
          }
        });
    };

    const showStatus = (type, message) => {
      if (!wizardStatus) return;
      wizardStatus.className = 'form-status ' + type;
      wizardStatus.textContent = message;
    };

    const showSuccess = (referenceCode) => {
      wizardSteps.forEach((el) => {
        el.classList.remove('active');
        el.setAttribute('aria-hidden', 'true');
      });

      if (wizardProgress) wizardProgress.style.display = 'none';

      if (successRefCode) {
        successRefCode.textContent = referenceCode || 'SYS-0000-0000';
      }
      if (wizardSuccess) {
        wizardSuccess.hidden = false;
        wizardSuccess.setAttribute('aria-hidden', 'false');
      }

      const formWrap = wizardForm.closest('.contact-form-wrap');
      if (formWrap) {
        const top = formWrap.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    };

    wizardForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAllErrors();

      if (hpWebsite && hpWebsite.value.trim() !== '') {
        showSuccess('SYS-0000-0000');
        return;
      }

      for (let s = 1; s <= TOTAL_STEPS; s++) {
        if (!validateStep(s)) {
          currentStep = s;
          showStep(s, 'forward');
          showStatus('error', 'Please fix the highlighted fields before submitting.');
          return;
        }
      }

      setSubmitting(true);

      try {
        const response = await fetch(WIZARD_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(buildPayload())
        });

        if (response.status === 201) {
          const data = await response.json().catch(() => ({}));
          clearDraft();
          showSuccess(data.reference_code || 'SYS-0000-0000');
          return;
        }

        if (response.status === 429) {
          showStatus('error', 'Too many requests. Please try again later or contact us directly.');
          return;
        }

        if (response.status === 400) {
          const data = await response.json().catch(() => ({}));
          const msg = data.message || data.error ||
            'Some required information is missing or invalid. Please review your entries.';
          showStatus('error', msg);
          return;
        }

        showStatus('error',
          'Something went wrong. Please try again or email qoechtech@gmail.com.');
      } catch (err) {
        showStatus('error',
          'Network error. Please try again or email qoechtech@gmail.com.');
      } finally {
        setSubmitting(false);
      }
    });

    if (successReset) {
      successReset.addEventListener('click', () => {
        wizardForm.reset();
        clearAllErrors();
        clearDraft();

        if (wizardSuccess) {
          wizardSuccess.hidden = true;
          wizardSuccess.setAttribute('aria-hidden', 'true');
        }
        if (wizardProgress) wizardProgress.style.display = '';

        currentStep = 1;
        showStep(1, 'back');
      });
    }

    restoreDraft();

    // On initial load: no scroll, no focus. Prevents mobile browsers
    // from jumping down to the contact form on first visit.
    showStep(1, 'forward', false, false);
  }


  /* ============================================================
     14. FOOTER YEAR
     ============================================================ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ============================================================
     15. IMAGE MODAL — full-screen gallery viewer
     ============================================================ */
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

  /* Thumbnails — swipe-guard prevents accidental opens when the user
     swipes the mobile carousel and lifts their finger on a card. */
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


  /* ============================================================
     16. TERMINAL MODAL — code sample viewer
     ============================================================ */
  const terminalModal = document.getElementById('terminalModal');
  const terminalTitle = document.getElementById('terminalTitle');
  const terminalCode  = document.getElementById('terminalCode');

  const escapeHtml = (str) => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const openTerminalModal = ({ title = '~/qoech/project', code = '' } = {}) => {
    if (!terminalModal) return;

    if (terminalTitle) terminalTitle.textContent = title;
    if (terminalCode)  terminalCode.innerHTML    = escapeHtml(code);

    openModal(terminalModal);
  };

  document.querySelectorAll('[data-open-terminal]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const raw = el.getAttribute('data-open-terminal') || '{}';
      try {
        const payload = JSON.parse(raw);
        openTerminalModal(payload);
      } catch (_) {
        openTerminalModal({ code: raw });
      }
    });
  });


  /* ============================================================
     17. PUBLIC API
     ============================================================ */
  window.QOECH = {
    openImageModal,
    openTerminalModal,
    openModal,
    closeModal
  };


  /* ============================================================
     18. UNIFIED SCROLL LOOP
     All scroll-driven work runs from one rAF-scheduled tick.
     Fires at most once per animation frame — no more six
     separate scroll listeners racing each other.
     ============================================================ */

  const scrollProgressEl = document.getElementById('scrollProgress');
  const navbarEl         = document.getElementById('navbar');
  const backToTopEl      = document.getElementById('backToTop');
  const heroEl           = document.querySelector('.hero');
  const statsGridEl      = document.querySelector('.stats-grid');
  const statNumbersAll   = document.querySelectorAll('.stat-number');
  const sectionList      = document.querySelectorAll('section[id]');
  const navLinkEls       = document.querySelectorAll('.nav-link');

  // ---- Progress bar ----
  const updateProgressBar = () => {
    if (!scrollProgressEl) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressEl.style.width = pct + '%';
  };

  // ---- Navbar scrolled state ----
  const updateNavbarState = () => {
    if (!navbarEl) return;
    navbarEl.classList.toggle('scrolled', window.scrollY > 40);
  };

  // ---- Active nav link ----
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

  // ---- Back to top visibility ----
  const updateBackToTop = () => {
    if (!backToTopEl) return;
    backToTopEl.classList.toggle('visible', window.scrollY > 500);
  };

  // ---- Subtle hero grid parallax (desktop only) ----
  const updateHeroParallax = () => {
    if (!heroEl || !hasFinePointer) return;
    const offset = window.scrollY;
    if (offset > window.innerHeight) return;
    const grid = heroEl.querySelector('.hero-grid');
    if (grid) grid.style.transform = `translateY(${offset * 0.15}px)`;
  };

  // ---- Stats counter (fires once) ----
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

  // ---- Single rAF-throttled scroll handler ----
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

  // Run once on load so the initial state is correct
  window.addEventListener('load', () => {
    updateProgressBar();
    updateNavbarState();
    updateActiveLink();
    updateBackToTop();
    maybeAnimateStats();
  });

  // Back-to-top button
  if (backToTopEl) {
    backToTopEl.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ============================================================
     19. EAGLE FLIGHT ANIMATION — full choreography
     ------------------------------------------------------------
     Every cycle:
       Ring shakes + bubbles → combined logo fades → empty ring
       → eagle glides right → hover → touchdown (shockwave, sparks,
       dot ignition, text flash, navbar flash, "Checking…") →
       perched bob → crouch → turn → glide back → land in ring
       → combined logo restores → repeat.

     Timing (fixed, cursor-independent):
       • First flight starts 10 seconds after page load
       • Every subsequent flight repeats every 20 seconds
     ============================================================ */
  (function eagleFlight() {
    const navbar    = document.getElementById('navbar');
    const eagle     = document.getElementById('navFlyingEagle');
    const burst     = document.getElementById('navBurst');
    const brandQ    = document.getElementById('brandQ');
    const navStatus = document.getElementById('navStatus');
    if (!navbar || !eagle || !burst || !brandQ || !navStatus) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    /* ---- Timing (ms) — keep T_FLIGHT_* in sync with CSS ---- */
    const FIRST_DELAY   = 10000;   // first flight: 10s after page load
    const REPEAT_DELAY  = 20000;   // every flight after that: every 20s

    const T_SHAKE_MS    = 600;
    const T_SWAP_MS     = 400;
    const T_FLIGHT_OUT  = 6000;    // CSS flyRight duration
    const T_PILL_MS     = 2600;    // hover + perch + bob
    const T_CROUCH_MS   = 250;
    const T_FLIGHT_BACK = 5500;    // CSS flyLeft duration
    const T_RESET_MS    = 600;

    /* ---- State ---- */
    let idleTimer = null;
    let running   = false;
    let firstRun  = true;

    /* ---- Helpers ---- */
    const computePositions = () => {
      const nbRect   = navbar.getBoundingClientRect();
      const ringRect = brandQ.getBoundingClientRect();
      const pillRect = navStatus.getBoundingClientRect();

      const startX = ringRect.left - nbRect.left + ringRect.width / 2;
      const startY = ringRect.top  - nbRect.top  + ringRect.height / 2;
      const endX   = pillRect.left - nbRect.left + pillRect.width / 2;
      const endY   = pillRect.top  - nbRect.top  + pillRect.height / 2;

      return {
        startX, startY, endX, endY,
        outDistance:  endX - startX,
        backDistance: startX - endX
      };
    };

    /* Perched eagle sits ON TOP of the pill, not inside it.
       Offset = half eagle height (26) + half pill height (~14). */
    const PERCH_OFFSET = 40;

    const spawnSparks = (x, y, count = 7) => {
      const container = document.createElement('div');
      container.className = 'nav-sparks';
      container.style.left = x + 'px';
      container.style.top  = y + 'px';
      navbar.appendChild(container);

      for (let i = 0; i < count; i++) {
        const spark = document.createElement('span');
        spark.className = 'nav-spark';
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
        const dist  = 24 + Math.random() * 22;
        spark.style.setProperty('--sx', Math.cos(angle) * dist + 'px');
        spark.style.setProperty('--sy', Math.sin(angle) * dist + 'px');
        spark.style.setProperty('--sd', (0.55 + Math.random() * 0.35) + 's');
        container.appendChild(spark);
      }
      setTimeout(() => container.remove(), 1300);
    };

    const swapStatusText = (text) => {
      const el = navStatus.querySelector('.status-text');
      if (!el) return;
      el.style.transition = 'opacity 0.2s ease';
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = text;
        el.style.opacity = '1';
      }, 200);
    };

    /* ---- Arm the next flight ----
       First call uses FIRST_DELAY (10s after load).
       Subsequent calls use REPEAT_DELAY (20s). */
    const armNext = () => {
      if (running) return;
      clearTimeout(idleTimer);
      const wait = firstRun ? FIRST_DELAY : REPEAT_DELAY;
      idleTimer = setTimeout(() => {
        firstRun = false;
        runSequence();
      }, wait);
    };

    /* ---- The full sequence ---- */
    const runSequence = () => {
      if (running) return;
      if (window.innerWidth <= 1024) { armNext(); return; }
      running = true;

      const pos = computePositions();

      /* Initial placement */
      eagle.style.left = pos.startX + 'px';
      eagle.style.top  = pos.startY + 'px';
      eagle.style.setProperty('--fly-distance', pos.outDistance + 'px');
      eagle.src = 'images/logo/eagle-right.png';

      burst.style.left = pos.startX + 'px';
      burst.style.top  = pos.startY + 'px';

      /* ---------- Phase 1: trigger — bubbles + ring shake ---------- */
      burst.classList.add('active');
      brandQ.classList.add('nav-ring-shake');

      setTimeout(() => brandQ.classList.remove('nav-ring-shake'), T_SHAKE_MS);

      /* ---------- Phase 2: combined logo fades out ---------- */
      setTimeout(() => { brandQ.style.opacity = '0'; }, T_SHAKE_MS + 100);

      /* ---------- Phase 3: empty ring, launch ---------- */
      setTimeout(() => {
        brandQ.src = 'images/logo/q-ring.png';
        brandQ.style.opacity = '1';
        eagle.classList.add('flying');
      }, T_SHAKE_MS + 100 + T_SWAP_MS);

      /* ---------- Phase 4: bubble cleanup ---------- */
      setTimeout(() => burst.classList.remove('active'), T_SHAKE_MS + 1500);

      /* ---------- Phase 5: arrival — hover → touchdown + impact ---------- */
      const tTouchdown = T_SHAKE_MS + T_SWAP_MS + T_FLIGHT_OUT;

      setTimeout(() => {
        eagle.classList.remove('flying');
        eagle.style.left = pos.endX + 'px';
        eagle.style.top  = (pos.endY - PERCH_OFFSET) + 'px';
        eagle.classList.add('perched');
      }, tTouchdown);

      /* Impact effects fire ~350ms after arrival (after hover beat) */
      const tImpact = tTouchdown + 350;

      setTimeout(() => {
        navStatus.classList.add('systems-checking');
        swapStatusText('Checking…');

        spawnSparks(pos.endX, pos.endY);

        navbar.classList.add('impact');
        setTimeout(() => navbar.classList.remove('impact'), 500);
      }, tImpact);

      /* ---------- Phase 6: pre-departure crouch ---------- */
      const tCrouchStart = tTouchdown + T_PILL_MS - T_CROUCH_MS;

      setTimeout(() => {
        eagle.classList.add('crouching');
        eagle.style.transform = 'translate(-50%, calc(-50% - 0px)) scale(1.08, 0.86)';
      }, tCrouchStart);

      /* ---------- Phase 7: depart — turn around, glide back ---------- */
      const tDepart = tTouchdown + T_PILL_MS;

      setTimeout(() => {
        navStatus.classList.remove('systems-checking');
        swapStatusText('Systems Online');

        eagle.style.transform = '';
        eagle.style.transition = '';
        eagle.classList.remove('crouching', 'perched');
        eagle.src = 'images/logo/eagle-left.png';
        eagle.style.left = pos.endX + 'px';
        eagle.style.top  = (pos.endY - PERCH_OFFSET) + 'px';
        eagle.style.setProperty('--fly-distance', pos.backDistance + 'px');
        eagle.classList.add('returning');
      }, tDepart);

      /* ---------- Phase 8: land back in ring, restore combined logo ---------- */
      const tLandBack = tDepart + T_FLIGHT_BACK;

      setTimeout(() => {
        eagle.classList.remove('returning');
        eagle.classList.add('hidden');

        brandQ.style.opacity = '0';
        setTimeout(() => {
          brandQ.src = 'images/logo/qoech-logo.png';
          brandQ.style.opacity = '1';
        }, 250);
      }, tLandBack);

      /* ---------- Phase 9: full reset + rearm ---------- */
      setTimeout(() => {
        eagle.classList.remove('hidden', 'perched', 'flying', 'returning', 'crouching');
        eagle.style.left = '';
        eagle.style.top  = '';
        eagle.style.transform = '';
        eagle.style.transition = '';
        eagle.style.removeProperty('--fly-distance');
        running = false;
        armNext();
      }, tLandBack + T_RESET_MS);
    };

    /* Kick off the first cycle — fires 10s after this script runs */
    armNext();
  })();


  /* ============================================================
     20. MOBILE CAROUSEL PAGINATION
     ------------------------------------------------------------
     On mobile (≤768px) the Services / Featured Projects / Process
     and Why Qoech sections become horizontal snap carousels
     (see CSS §27). This module adds:
       • A "Swipe" hint that fades on first interaction
       • Pagination dots that update as the user scrolls
       • Dot clicks that scroll to the matching card
     Disabled on desktop, cleaned up on resize back up.
     ============================================================ */
  (function mobileCarouselPagination() {
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

    /* Build hint + dots container for one track */
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

      /* Create one dot per card */
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

      /* Update active dot based on which card is centered */
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

      /* Fade the hint on first interaction (scroll or touch) */
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

      /* Re-measure if layout changes (e.g. orientation flip) */
      if ('ResizeObserver' in window) {
        const ro = new ResizeObserver(() => updateActiveDot());
        ro.observe(track);
      }

      updateActiveDot();
    };

    /* Tear down when leaving mobile */
    const teardownUI = (track) => {
      const meta = track.parentNode.querySelector(':scope > .mobile-carousel-meta');
      if (meta) meta.remove();
      track.dataset.carouselReady = '';
    };

    /* Sync all tracks based on current breakpoint */
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

    /* React to breakpoint changes */
    if (MQ.addEventListener) MQ.addEventListener('change', syncAll);
    else if (MQ.addListener) MQ.addListener(syncAll);
  })();

})();
