import { sanitizeInput } from '../utils/dom.js';
import {
  WIZARD_API, STORAGE_KEY, TOTAL_STEPS, SUBMIT_TIMEOUT_MS, SLOW_NOTICE_MS,
  MIN_FILL_MS, RESUBMIT_COOLDOWN_MS, COOLDOWN_KEY
} from '../config.js';

/* ============================================================
   13. CONTACT WIZARD — Request a System
   ============================================================ */
export function initWizard() {

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

  const initAt = Date.now();   // used by the "too fast to be human" check

  let currentStep = 1;
  let isSubmitting = false; // SECURITY: Prevent double-submissions
  let apiWarmed = false;

  // Free-tier hosts sleep when idle. Poke the API once when the visitor
  // starts filling the form so it is awake by the time they submit.
  const warmApi = () => {
    if (apiWarmed) return;
    apiWarmed = true;
    try {
      fetch(new URL(WIZARD_API).origin + '/', { mode: 'no-cors', cache: 'no-store' }).catch(() => {});
    } catch (_) {}
  };

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
       - `focus`  controls whether we auto-focus the first field */
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

    wizardForm.addEventListener('focusin', warmApi, { once: true });
    wizardForm.addEventListener('input', saveDraft);
    wizardForm.addEventListener('change', saveDraft);

    const buildPayload = () => {
      const get = (n) => {
        const el = wizardForm.elements[n];
        return el ? el.value : '';
      };
      
      // SECURITY: Use sanitizeInput to strip HTML tags and limit length
      return {
        full_name:      sanitizeInput(get('full_name'), 100),
        email:          sanitizeInput(get('email'), 150),
        phone:          sanitizeInput(get('phone'), 20)   || null,
        company:        sanitizeInput(get('company'), 100) || null,
        location:       sanitizeInput(get('location'), 100) || null,
        system_type:    sanitizeInput(get('system_type'), 50),
        title:          sanitizeInput(get('title'), 150),
        description:    sanitizeInput(get('description'), 2000),
        features:       sanitizeInput(get('features'), 2000) || null,
        target_users:   sanitizeInput(get('target_users'), 200) || null,
        budget_range:   sanitizeInput(get('budget_range'), 50) || null,
        timeline:       sanitizeInput(get('timeline'), 50) || null,
        reference_urls: sanitizeInput(get('reference_urls'), 500) || null,
        attachment_url: null,
        source:         'website'
      };
    };

    const setSubmitting = (status) => {
      isSubmitting = status;
      if (!wizardSubmit) return;

      wizardSubmit.disabled = status;

      if (status) {
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
            el.disabled = status;
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
        // textContent is already safe against HTML injection; escaping here
        // would show "&amp;" literally. Limit the length instead.
        successRefCode.textContent = String(referenceCode || 'SYS-0000-0000').slice(0, 40);
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
      
      // SECURITY: Prevent double submits
      if (isSubmitting) return;

      clearAllErrors();

      // Bot checks: the hidden field must be empty, and the form must have
      // been open long enough for a person to fill it. Bots get a fake
      // success so they learn nothing and nothing is sent.
      const tooFast = Date.now() - initAt < MIN_FILL_MS;
      if ((hpWebsite && hpWebsite.value.trim() !== '') || tooFast) {
        showSuccess('SYS-0000-0000');
        return;
      }

      // One request per minute per browser
      try {
        const last = parseInt(localStorage.getItem(COOLDOWN_KEY) || '0', 10);
        const wait = RESUBMIT_COOLDOWN_MS - (Date.now() - last);
        if (last && wait > 0) {
          showStatus('error', 'Please wait ' + Math.ceil(wait / 1000) + ' seconds before sending another request.');
          return;
        }
      } catch (_) { /* storage blocked: skip the cooldown */ }

      for (let s = 1; s <= TOTAL_STEPS; s++) {
        if (!validateStep(s)) {
          currentStep = s;
          showStep(s, 'forward');
          showStatus('error', 'Please fix the highlighted fields before submitting.');
          return;
        }
      }

      setSubmitting(true);

      const controller = new AbortController();
      const abortTimer = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);
      const slowTimer  = setTimeout(() => {
        showStatus('info', 'Still working… our server may be waking up. Please keep this page open.');
      }, SLOW_NOTICE_MS);

      try {
        const response = await fetch(WIZARD_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(buildPayload()),
          signal: controller.signal
        });
        clearTimeout(slowTimer);
        if (wizardStatus && wizardStatus.classList.contains('info')) showStatus('', '');

        if (response.status === 201) {
          const data = await response.json().catch(() => ({}));
          clearDraft();
          try { localStorage.setItem(COOLDOWN_KEY, String(Date.now())); } catch (_) {}
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
        showStatus('error', err && err.name === 'AbortError'
          ? 'The server took too long to respond. Your answers are saved - please try again, or email qoechtech@gmail.com.'
          : 'Network error. Please try again or email qoechtech@gmail.com.');
      } finally {
        clearTimeout(abortTimer);
        clearTimeout(slowTimer);
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

    // On initial load: no scroll, no focus.
    showStep(1, 'forward', false, false);
  }
}
