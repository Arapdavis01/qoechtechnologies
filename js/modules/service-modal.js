import { escapeHtml } from '../utils/dom.js';
import { openModal } from './modal.js';
import { serviceData } from '../data/services.js';

/* ============================================================
   09. SERVICE DATA + MODAL
   ============================================================ */
export function initServiceModal() {
const serviceModal = document.getElementById('serviceModal');
  const serviceModalBody = document.getElementById('serviceModalBody');

  const openServiceModal = (key) => {
    const data = serviceData[key];
    if (!data || !serviceModal || !serviceModalBody) return;
    serviceModal.setAttribute('aria-label', data.title);

    // SECURITY: Wrap all dynamic data in escapeHtml() before injecting
    serviceModalBody.innerHTML = `
      <div class="modal-icon-large"><i class="${escapeHtml(data.icon)}"></i></div>
      <h3>${escapeHtml(data.title)}</h3>
      <p>${escapeHtml(data.description)}</p>

      <div class="modal-section">
        <h4><i class="fas fa-check-circle"></i> What's Included</h4>
        <ul>
          ${data.features.map((f) => `<li><i class="fas fa-check"></i><span>${escapeHtml(f)}</span></li>`).join('')}
        </ul>
      </div>

      <div class="modal-section">
        <h4><i class="fas fa-route"></i> Our Process</h4>
        <ul>
          ${data.process.map((p, i) => `<li><i class="fas fa-circle"></i><span><strong>${String(i + 1).padStart(2, '0')}.</strong> ${escapeHtml(p)}</span></li>`).join('')}
        </ul>
      </div>

      <div class="modal-section">
        <h4><i class="fas fa-microchip"></i> Technologies</h4>
        <div class="modal-tech">
          ${data.technologies.map((t) => `<span class="tag"><i class="fas fa-cube"></i> ${escapeHtml(t)}</span>`).join('')}
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
}
