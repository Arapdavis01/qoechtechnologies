import { escapeHtml } from '../utils/dom.js';
import { openModal } from './modal.js';
import { projectData } from '../data/projects.js';

/* ============================================================
   10. PROJECT DATA + MODAL
   ============================================================ */
export function initProjectModal() {
const projectModal = document.getElementById('projectModal');
  const projectModalBody = document.getElementById('projectModalBody');

  const openProjectModal = (key) => {
    const data = projectData[key];
    if (!data || !projectModal || !projectModalBody) return;
    projectModal.setAttribute('aria-label', data.title);

    // SECURITY: Ensure liveUrl is safe (starts with http:// or https://)
    const isSafeUrl = data.liveUrl && /^https?:\/\//i.test(data.liveUrl);
    const liveLinkHTML = isSafeUrl
      ? `<a href="${escapeHtml(data.liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
           <i class="fas fa-up-right-from-square"></i>
           <span>Visit Live Site</span>
         </a>`
      : '';

    // SECURITY: Escape all dynamic content
    projectModalBody.innerHTML = `
      <img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.title)}" />
      <h3>${escapeHtml(data.title)}</h3>
      <div class="modal-meta">
        <span class="project-category"><i class="fas fa-tag"></i> ${escapeHtml(data.category)}</span>
        <span class="project-status ${escapeHtml(data.statusClass)}"><i class="fas fa-circle"></i> ${escapeHtml(data.status)}</span>
      </div>

      <div class="modal-section">
        <h4><i class="fas fa-circle-info"></i> Overview</h4>
        <p>${escapeHtml(data.overview)}</p>
      </div>

      <div class="modal-section">
        <h4><i class="fas fa-triangle-exclamation"></i> The Problem</h4>
        <p>${escapeHtml(data.problem)}</p>
      </div>

      <div class="modal-section">
        <h4><i class="fas fa-lightbulb"></i> The Solution</h4>
        <p>${escapeHtml(data.solution)}</p>
      </div>

      <div class="modal-section">
        <h4><i class="fas fa-list-check"></i> Key Features</h4>
        <ul>
          ${data.features.map((f) => `<li><i class="fas fa-check"></i><span>${escapeHtml(f)}</span></li>`).join('')}
        </ul>
      </div>

      <div class="modal-section">
        <h4><i class="fas fa-microchip"></i> Technology Stack</h4>
        <div class="modal-tech">
          ${data.tech.map((t) => `<span class="tag"><i class="fas fa-cube"></i> ${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>

      <div class="modal-section">
        <h4><i class="fas fa-chart-line"></i> Outcome</h4>
        <p>${escapeHtml(data.outcome)}</p>
      </div>

      <div class="modal-actions">
        <a href="#contact" class="btn btn-primary" data-close>
          <i class="fas fa-comments"></i>
          <span>Discuss a Similar Project</span>
        </a>
        ${liveLinkHTML}
      </div>
    `;

    // Hide a missing image without an inline onerror handler (CSP-safe)
    const modalImg = projectModalBody.querySelector('img');
    if (modalImg) modalImg.addEventListener('error', () => { modalImg.style.display = 'none'; }, { once: true });

    openModal(projectModal);
  };

  document.querySelectorAll('.project-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-project');
      openProjectModal(key);
    });
  });
}
