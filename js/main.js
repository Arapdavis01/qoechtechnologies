/* ============================================================
   QOECH TECHNOLOGIES — MAIN SCRIPT
   ============================================================
   Table of Contents
   01. Preloader
   02. Scroll Progress Bar
   03. Cursor Glow
   04. Particles Network (tsParticles + cursor grab)
   05. Navbar Scroll State
   06. Mobile Menu + Animated Hamburger
   07. Active Nav Link on Scroll
   08. Smooth Scroll for Anchor Links
   09. Hero Typing Effect
   10. Fade-up Scroll Animations
   11. Stats Counter Animation
   12. About Tabs
   13. Service Data + Modal
   14. Project Data + Modal
   15. Modal Helpers (close, escape, overlay)
   16. Testimonial Carousel
   17. Contact Form (Formspree AJAX)
   18. Back to Top
   19. Footer Year
   20. Hero Parallax (subtle)
   ============================================================ */

(function () {
  'use strict';

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
     02. SCROLL PROGRESS BAR
     ============================================================ */
  const scrollProgress = document.getElementById('scrollProgress');
  const updateProgress = () => {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();


  /* ============================================================
     03. CURSOR GLOW (desktop only)
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

    // Smooth follow with requestAnimationFrame
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
     04. PARTICLES NETWORK — tsParticles with cursor grab
     ============================================================ */
  const initParticles = () => {
    if (typeof tsParticles === 'undefined') return;
    if (!document.getElementById('particles-bg')) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    tsParticles.load('particles-bg', {
      particles: {
        number: {
          value: isMobile ? 35 : 75,
          density: { enable: true, area: 900 }
        },
        color: {
          value: ['#39FF14', '#D4AF37', '#00FF88']
        },
        shape: { type: 'circle' },
        opacity: {
          value: 0.35,
          random: true,
          anim: { enable: true, speed: 0.4, min: 0.1, sync: false }
        },
        size: {
          value: { min: 1, max: 3 },
          random: true
        },
        move: {
          enable: true,
          speed: 0.45,
          direction: 'none',
          random: true,
          straight: false,
          outModes: 'out'
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#39FF14',
          opacity: 0.15,
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
              force: 35,
              smooth: 20
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
            distance: 200,
            line_linked: { opacity: 0.5 }
          },
          push: { quantity: 3 }
        }
      },
      background: { color: 'transparent' },
      detectRetina: !isMobile
    });
  };

  // Wait for tsParticles to be available (loaded with defer)
  if (typeof tsParticles !== 'undefined') {
    initParticles();
  } else {
    window.addEventListener('load', initParticles);
  }


  /* ============================================================
     05. NAVBAR SCROLL STATE
     ============================================================ */
  const navbar = document.getElementById('navbar');
  const onNavScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();


  /* ============================================================
     06. MOBILE MENU + ANIMATED HAMBURGER
     ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const navLinksAll = document.querySelectorAll('.nav-link');

  const openMenu = () => {
    hamburger.classList.add('open');
    navMenu.classList.add('open');
    navOverlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    navOverlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  navLinksAll.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger && hamburger.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close on resize above breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && hamburger && hamburger.classList.contains('open')) {
      closeMenu();
    }
  });


  /* ============================================================
     07. ACTIVE NAV LINK ON SCROLL
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActiveLink = () => {
    const scrollPos = window.scrollY + 140;
    let currentId = '';

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.clientHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + currentId) link.classList.add('active');
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('load', updateActiveLink);


  /* ============================================================
     08. SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 72;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
      window.scrollTo({ top, behavior: 'smooth' });

      // Update URL hash without jumping
      history.replaceState(null, '', targetId);
    });
  });


  /* ============================================================
     09. HERO TYPING EFFECT
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
    let typingTimeout;

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
        speed = 1800; // pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 400;
      }

      typingTimeout = setTimeout(typeLoop, speed);
    };

    // Start after preloader
    setTimeout(typeLoop, 1400);
  }


  /* ============================================================
     10. FADE-UP SCROLL ANIMATIONS
     ============================================================ */
  const fadeEls = document.querySelectorAll(
    '.fade-up, .section-head, .service-card, .solution-card, ' +
    '.featured-project-card, .other-system-item, .capability-item, ' +
    '.tech-category, .why-card, .process-step, .stat-card, ' +
    '.value-item, .contact-card, .testimonial-carousel'
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
      el.style.transitionDelay = Math.min(i * 40, 240) + 'ms';
      fadeObserver.observe(el);
    });
  } else {
    fadeEls.forEach((el) => el.classList.add('visible'));
  }


  /* ============================================================
     11. STATS COUNTER ANIMATION
     ============================================================ */
  const statNumbers = document.querySelectorAll('.stat-number');
  const animateStats = () => {
    statNumbers.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target')) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1600;
      const startTime = performance.now();

      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(tick);
    });
  };

  if (statNumbers.length) {
    if ('IntersectionObserver' in window) {
      const statsObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateStats();
              statsObserver.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      const statsGrid = document.querySelector('.stats-grid');
      if (statsGrid) statsObserver.observe(statsGrid);
    } else {
      animateStats();
    }
  }


  /* ============================================================
     12. ABOUT TABS
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
     13. SERVICE DATA + MODAL
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
     14. PROJECT DATA + MODAL
     ============================================================ */
  const projectData = {
    hardware: {
      title: 'Hardware Store Management System',
      category: 'Business Management',
      status: 'Live',
      statusClass: 'status-live',
      image: 'images/projects/hardware.jpg',
      liveUrl: '', // ← paste live URL here when available
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
      image: 'images/projects/agrovet.jpg',
      liveUrl: '', // ← paste live URL here when available
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
      image: 'images/projects/riverview.jpg',
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
     15. MODAL HELPERS
     ============================================================ */
  let lastFocusedEl = null;

  function openModal(modal) {
    if (!modal) return;
    lastFocusedEl = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus first focusable element
    const focusable = modal.querySelector('button, [href], input, select, textarea');
    if (focusable) setTimeout(() => focusable.focus(), 80);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');

    // Only unlock scroll if no other modal is open
    const anyOpen = document.querySelector('.modal.open');
    if (!anyOpen) document.body.style.overflow = '';

    if (lastFocusedEl && lastFocusedEl.focus) lastFocusedEl.focus();
  }

  // Close buttons inside modals (data-close attribute)
  document.querySelectorAll('.modal').forEach((modal) => {
    modal.querySelectorAll('[data-close]').forEach((el) => {
      el.addEventListener('click', (e) => {
        // If it's a link to #contact, let it scroll first
        if (el.tagName === 'A' && el.getAttribute('href') === '#contact') {
          closeModal(modal);
        } else {
          e.preventDefault();
          closeModal(modal);
        }
      });
    });
  });

  // Escape key closes any open modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.open').forEach((m) => closeModal(m));
    }
  });


  /* ============================================================
     16. TESTIMONIAL CAROUSEL
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
     17. CONTACT FORM (Formspree AJAX)
     ============================================================ */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const formSubmit = document.getElementById('formSubmit');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!formStatus || !formSubmit) return;

      // Reset status
      formStatus.className = 'form-status';
      formStatus.textContent = '';

      const formData = new FormData(contactForm);
      const name = (formData.get('name') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const message = (formData.get('message') || '').toString().trim();

      if (!name || !email || !message) {
        formStatus.classList.add('error');
        formStatus.textContent = 'Please fill in all required fields.';
        return;
      }

      const originalHTML = formSubmit.innerHTML;
      formSubmit.disabled = true;
      formSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Sending...</span>';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          formStatus.classList.add('success');
          formStatus.textContent = 'Message sent successfully. We will get back to you shortly.';
          contactForm.reset();
        } else {
          const data = await response.json().catch(() => ({}));
          const errorMsg =
            (data && data.errors && data.errors.map((er) => er.message).join(', ')) ||
            'Something went wrong. Please try again or email us at qoechtech@gmail.com.';
          formStatus.classList.add('error');
          formStatus.textContent = errorMsg;
        }
      } catch (err) {
        formStatus.classList.add('error');
        formStatus.textContent = 'Network error. Please try again or email us at qoechtech@gmail.com.';
      } finally {
        formSubmit.disabled = false;
        formSubmit.innerHTML = originalHTML;
      }
    });
  }


  /* ============================================================
     18. BACK TO TOP
     ============================================================ */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const toggleBackToTop = () => {
      if (window.scrollY > 500) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    };
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ============================================================
     19. FOOTER YEAR
     ============================================================ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ============================================================
     20. HERO PARALLAX (subtle, desktop only)
     ============================================================ */
  const hero = document.querySelector('.hero');
  if (hero && hasFinePointer) {
    window.addEventListener(
      'scroll',
      () => {
        const offset = window.scrollY;
        if (offset < window.innerHeight) {
          const grid = hero.querySelector('.hero-grid');
          if (grid) grid.style.transform = `translateY(${offset * 0.15}px)`;
        }
      },
      { passive: true }
    );
  }

})();
