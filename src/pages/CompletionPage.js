/**
 * CompletionPage - Página Final
 * Página de conclusão do formulário
 */

import { t } from '../utils/translations.js'
import { COMPANY } from '../config/constants.js'

/**
 * Criar página de conclusão
 * @param {object} formData - Dados do formulário completo
 * @returns {HTMLElement} - Elemento da página
 */
export function createCompletionPage(formData = {}) {
  const lang = formData.language || 'pt-BR'
  const firstName = formData.fullName ? formData.fullName.split(' ')[0] : ''

  const page = document.createElement('div')
  page.className = 'form-page completion-page'

  page.innerHTML = `
    <div class="completion-container">
      <!-- Success Icon -->
      <div class="completion-icon">
        <div class="success-checkmark">
          <div class="check-icon">
            <span class="icon-line line-tip"></span>
            <span class="icon-line line-long"></span>
            <div class="icon-circle"></div>
            <div class="icon-fix"></div>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div class="completion-header">
        <h1 class="completion-title">
          ${t(lang, 'completion.title')}
        </h1>
        <p class="completion-subtitle">
          ${firstName ? t(lang, 'completion.greeting').replace('{name}', firstName) : t(lang, 'completion.greetingGeneric')}
        </p>
      </div>

      <!-- Completion Details -->
      <div class="completion-content">
        <div class="completion-card">
          <div class="completion-info">
            <div class="info-row">
              <span class="info-icon">📧</span>
              <div class="info-content">
                <span class="info-label">${t(lang, 'completion.emailLabel')}</span>
                <span class="info-value">${formData.email || ''}</span>
              </div>
            </div>

            <div class="info-row">
              <span class="info-icon">📅</span>
              <div class="info-content">
                <span class="info-label">${t(lang, 'completion.dateLabel')}</span>
                <span class="info-value">${formatDate(formData.completedAt || new Date().toISOString(), lang)}</span>
              </div>
            </div>

            <div class="info-row">
              <span class="info-icon">🏢</span>
              <div class="info-content">
                <span class="info-label">${t(lang, 'completion.depotLabel')}</span>
                <span class="info-value">${formData.depotName || t(lang, 'completion.notSpecified')}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Next Steps -->
        <div class="next-steps-card">
          <h3 class="next-steps-title">
            <span class="steps-icon">📋</span>
            ${t(lang, 'completion.nextStepsTitle')}
          </h3>
          <ul class="next-steps-list">
            <li class="next-step-item">
              <span class="step-number">1</span>
              <span class="step-text">${t(lang, 'completion.step1')}</span>
            </li>
            <li class="next-step-item">
              <span class="step-number">2</span>
              <span class="step-text">${t(lang, 'completion.step2')}</span>
            </li>
            <li class="next-step-item">
              <span class="step-number">3</span>
              <span class="step-text">${t(lang, 'completion.step3')}</span>
            </li>
          </ul>
        </div>

        <!-- Contact Information -->
        <div class="contact-card">
          <h3 class="contact-title">
            <span class="contact-icon">💬</span>
            ${t(lang, 'completion.contactTitle')}
          </h3>
          <div class="contact-info">
            <div class="contact-item">
              <span class="contact-icon-small">📧</span>
              <a href="mailto:recruitment@silvabrothers.co.uk" class="contact-link">
                recruitment@silvabrothers.co.uk
              </a>
            </div>
            <div class="contact-item">
              <span class="contact-icon-small">📞</span>
              <a href="tel:+442012345678" class="contact-link">
                +44 20 1234 5678
              </a>
            </div>
            <div class="contact-item">
              <span class="contact-icon-small">🌐</span>
              <a href="${COMPANY.WEBSITE}" target="_blank" rel="noopener noreferrer" class="contact-link">
                ${COMPANY.WEBSITE.replace('https://', '')}
              </a>
            </div>
          </div>
        </div>

        <!-- Important Notice -->
        <div class="notice-card">
          <div class="notice-icon">ℹ️</div>
          <div class="notice-content">
            <p class="notice-text">
              ${t(lang, 'completion.importantNotice')}
            </p>
          </div>
        </div>

        <!-- Brand Footer -->
        <div class="completion-footer">
          <img src="${COMPANY.LOGO_URL}" alt="${COMPANY.NAME}" class="completion-logo" />
          <p class="completion-company">${COMPANY.NAME}</p>
          <p class="completion-tagline">${t(lang, 'completion.tagline')}</p>
        </div>
      </div>
    </div>
  `

  return page
}

/**
 * Formatar data para exibição
 * @param {string} isoDate - Data no formato ISO
 * @param {string} lang - Idioma
 * @returns {string} - Data formatada
 */
function formatDate(isoDate, lang) {
  try {
    const date = new Date(isoDate)

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }

    return date.toLocaleDateString(lang, options)
  } catch (error) {
    console.error('Erro ao formatar data:', error)
    return isoDate
  }
}

export default {
  createCompletionPage
}
