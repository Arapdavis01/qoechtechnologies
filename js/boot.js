/* ============================================================
   BOOT — runs before anything else (classic script, in <head>)
   Kept as a separate file so the page needs no inline scripts,
   which lets the Content-Security-Policy block all of them.
   ============================================================ */
(function () {
  'use strict';

  // Prevent the browser from restoring an old scroll position on reload
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  // Strip any hash so the browser cannot auto-scroll to a section
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  // Reset scroll now, and again once parsing/loading is done
  window.scrollTo(0, 0);
  document.addEventListener('DOMContentLoaded', function () { window.scrollTo(0, 0); });
  window.addEventListener('load', function () { window.scrollTo(0, 0); });

  // Failsafe: if the main script fails to load (blocked, offline, old browser),
  // never leave the visitor staring at the preloader.
  window.addEventListener('load', function () {
    setTimeout(function () {
      var p = document.getElementById('preloader');
      if (p) p.classList.add('hidden');
    }, 5000);
  });
})();
