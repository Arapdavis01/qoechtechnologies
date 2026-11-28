/* ============================================================
   14. FOOTER YEAR
   ============================================================ */
export function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
