/* ============================================================
   19. EAGLE FLIGHT ANIMATION — full choreography
   ============================================================ */
export function initEagle() {
    const navbar    = document.getElementById('navbar');
    const eagle     = document.getElementById('navFlyingEagle');
    const burst     = document.getElementById('navBurst');
    const brandQ    = document.getElementById('brandQ');
    const navStatus = document.getElementById('navStatus');
    if (!navbar || !eagle || !burst || !brandQ || !navStatus) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const FIRST_DELAY   = 10000;
    const REPEAT_DELAY  = 20000;

    const T_SHAKE_MS    = 600;
    const T_SWAP_MS     = 400;
    const T_FLIGHT_OUT  = 6000;
    const T_PILL_MS     = 2600;
    const T_CROUCH_MS   = 250;
    const T_FLIGHT_BACK = 5500;
    const T_RESET_MS    = 600;

    let idleTimer = null;
    let running   = false;
    let firstRun  = true;

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

    const armNext = () => {
      if (running) return;
      clearTimeout(idleTimer);
      const wait = firstRun ? FIRST_DELAY : REPEAT_DELAY;
      idleTimer = setTimeout(() => {
        firstRun = false;
        runSequence();
      }, wait);
    };

    const runSequence = () => {
      if (running) return;
      if (window.innerWidth <= 1024) { armNext(); return; }
      running = true;

      const pos = computePositions();

      eagle.style.left = pos.startX + 'px';
      eagle.style.top  = pos.startY + 'px';
      eagle.style.setProperty('--fly-distance', pos.outDistance + 'px');
      eagle.src = 'images/logo/eagle-right.png';

      burst.style.left = pos.startX + 'px';
      burst.style.top  = pos.startY + 'px';

      burst.classList.add('active');
      brandQ.classList.add('nav-ring-shake');

      setTimeout(() => brandQ.classList.remove('nav-ring-shake'), T_SHAKE_MS);

      setTimeout(() => { brandQ.style.opacity = '0'; }, T_SHAKE_MS + 100);

      setTimeout(() => {
        brandQ.src = 'images/logo/q-ring.png';
        brandQ.style.opacity = '1';
        eagle.classList.add('flying');
      }, T_SHAKE_MS + 100 + T_SWAP_MS);

      setTimeout(() => burst.classList.remove('active'), T_SHAKE_MS + 1500);

      const tTouchdown = T_SHAKE_MS + T_SWAP_MS + T_FLIGHT_OUT;

      setTimeout(() => {
        eagle.classList.remove('flying');
        eagle.style.left = pos.endX + 'px';
        eagle.style.top  = (pos.endY - PERCH_OFFSET) + 'px';
        eagle.classList.add('perched');
      }, tTouchdown);

      const tImpact = tTouchdown + 350;

      setTimeout(() => {
        navStatus.classList.add('systems-checking');
        swapStatusText('Checking…');

        spawnSparks(pos.endX, pos.endY);

        navbar.classList.add('impact');
        setTimeout(() => navbar.classList.remove('impact'), 500);
      }, tImpact);

      const tCrouchStart = tTouchdown + T_PILL_MS - T_CROUCH_MS;

      setTimeout(() => {
        eagle.classList.add('crouching');
        eagle.style.transform = 'translate(-50%, calc(-50% - 0px)) scale(1.08, 0.86)';
      }, tCrouchStart);

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

    armNext();
}
