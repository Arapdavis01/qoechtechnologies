import { openModal } from './modal.js';

/* ============================================================
   16. TERMINAL MODAL — code sample viewer
   ============================================================ */
export function initTerminalModal() {
  const terminalModal = document.getElementById('terminalModal');
  const terminalTitle = document.getElementById('terminalTitle');
  const terminalCode  = document.getElementById('terminalCode');

  const openTerminalModal = ({ title = '~/qoech/project', code = '' } = {}) => {
    if (!terminalModal) return;

    if (terminalTitle) terminalTitle.textContent = title;
    if (terminalCode)  terminalCode.textContent  = code;   // textContent: no HTML parsing at all

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
}
