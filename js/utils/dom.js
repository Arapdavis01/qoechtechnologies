/* ============================================================
   SHARED HELPERS
   ============================================================ */

/** Escape text before it is placed inside an HTML string. */
export const escapeHtml = (str) =>
  String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

/**
 * Tidy text before it is sent to the API: strips real HTML tags and
 * comments, removes control characters, trims and limits the length.
 * A lone "<" such as "<50 staff" is kept so no text is lost.
 * This is a convenience only. The API must validate and escape too.
 */
export const sanitizeInput = (str, maxLength = 1000) => {
  if (!str) return '';
  const clean = String(str)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?[a-zA-Z][^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  return clean.trim().substring(0, maxLength);
};

export const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer =
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;
