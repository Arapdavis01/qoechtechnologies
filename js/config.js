/* ============================================================
   QOECH TECHNOLOGIES — SITE CONFIG
   ------------------------------------------------------------
   The only place that holds addresses and tunable limits.
   Never put passwords, API keys or tokens in this file: every
   file in this website is public to anyone who opens it.
   ============================================================ */

// Request-a-system form endpoint
export const WIZARD_API = 'https://eaglevision-api.onrender.com/api/public/system-requests';

// Form behaviour
export const STORAGE_KEY = 'qoech_wizard_v1';       // draft saved in sessionStorage
export const TOTAL_STEPS = 4;
export const SUBMIT_TIMEOUT_MS = 60000;             // free hosting can take ~50s to wake
export const SLOW_NOTICE_MS = 5000;                 // tell the visitor we are still working

// Anti-abuse (client side; the API must enforce its own limits too)
export const MIN_FILL_MS = 4000;                    // a human needs more than 4s to fill 4 steps
export const RESUBMIT_COOLDOWN_MS = 60000;          // one request per minute per browser
export const COOLDOWN_KEY = 'qoech_last_submit';
