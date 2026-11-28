/* ============================================================
   08. ABOUT TABS
   ============================================================ */
export function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // Keyboard support for the tabs: arrows, Home and End move between them
  const tabList = document.querySelector('.about-tabs');
  if (tabList) {
    tabList.addEventListener('keydown', (e) => {
      const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (!keys.includes(e.key)) return;
      const tabs = Array.from(tabBtns);
      const current = tabs.indexOf(document.activeElement);
      if (current === -1) return;
      e.preventDefault();
      let next = current;
      if (e.key === 'ArrowRight') next = (current + 1) % tabs.length;
      if (e.key === 'ArrowLeft')  next = (current - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End')  next = tabs.length - 1;
      tabs[next].click();
      tabs[next].focus();
    });
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');

      tabBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
        b.setAttribute('tabindex', '-1');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      btn.removeAttribute('tabindex');

      tabContents.forEach((content) => {
        content.classList.remove('active');
        if (content.id === tab + '-content') {
          content.classList.add('active');
        }
      });
    });
  });
}
