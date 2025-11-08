/**
 * DocumentGuidePage - Step 11
 * Página informativa sobre documentos e GDPR/DPA
 */

import { t } from '../utils/translations.js'

/**
 * Renderizar página de guia de documentos
 * @param {HTMLElement} container - Container onde será renderizado
 * @param {object} options - Opções { lang, onNext, onBack, formData }
 */
export function renderDocumentGuidePage(container, options = {}) {
  const {
    lang = 'pt-BR',
    onNext = null,
    onBack = null
  } = options

  container.innerHTML = `
    <div class="form-page document-guide-page">
      <div class="form-header">
        <h2 class="form-title">${t(lang, 'documentGuide.title')}</h2>
        <p class="form-subtitle">${t(lang, 'documentGuide.subtitle')}</p>
      </div>

      <div class="form-content">
        <!-- GDPR Info -->
        <div class="info-section">
          <div class="info-icon">🔒</div>
          <h3 class="info-title">${t(lang, 'documentGuide.gdprTitle')}</h3>
          <p class="info-text">
            ${t(lang, 'documentGuide.gdprText')}
          </p>
        </div>

        <!-- DPA Info -->
        <div class="info-section">
          <div class="info-icon">⚖️</div>
          <h3 class="info-title">${t(lang, 'documentGuide.dpaTitle')}</h3>
          <p class="info-text">
            ${t(lang, 'documentGuide.dpaText')}
          </p>
        </div>

        <!-- Required Documents -->
        <div class="info-section">
          <div class="info-icon">📄</div>
          <h3 class="info-title">${t(lang, 'documentGuide.requiredDocs')}</h3>
          <ul class="document-checklist">
            <li class="checklist-item">
              <span class="checklist-icon">✓</span>
              <span class="checklist-text">${t(lang, 'documentGuide.doc1')}</span>
            </li>
            <li class="checklist-item">
              <span class="checklist-icon">✓</span>
              <span class="checklist-text">${t(lang, 'documentGuide.doc2')}</span>
            </li>
            <li class="checklist-item">
              <span class="checklist-icon">✓</span>
              <span class="checklist-text">${t(lang, 'documentGuide.doc3')}</span>
            </li>
            <li class="checklist-item">
              <span class="checklist-icon">✓</span>
              <span class="checklist-text">${t(lang, 'documentGuide.doc4')}</span>
            </li>
            <li class="checklist-item checklist-item-optional">
              <span class="checklist-icon">○</span>
              <span class="checklist-text">${t(lang, 'documentGuide.doc5')}</span>
            </li>
          </ul>
        </div>

        <!-- Important Notes -->
        <div class="info-section info-section-warning">
          <div class="info-icon">⚠️</div>
          <h3 class="info-title">Important Notes</h3>
          <ul class="info-list">
            <li>All documents must be clear and readable</li>
            <li>Documents must be valid and not expired</li>
            <li>Accepted formats: JPG, PNG, PDF</li>
            <li>Maximum file size: 10MB per document</li>
          </ul>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" id="backBtn">
            ${t(lang, 'documentGuide.backButton')}
          </button>
          <button type="button" class="btn btn-primary" id="continueBtn">
            ${t(lang, 'documentGuide.continueButton')}
          </button>
        </div>
      </div>
    </div>
  `

  // Event listeners
  const backBtn = container.querySelector('#backBtn')
  const continueBtn = container.querySelector('#continueBtn')

  // Voltar
  backBtn.addEventListener('click', () => {
    if (onBack) onBack()
  })

  // Continuar (não precisa salvar nada, apenas página informativa)
  continueBtn.addEventListener('click', () => {
    if (onNext) {
      onNext()
    }
  })
}

export default {
  renderDocumentGuidePage
}
