/**
 * Componente ProgressBar
 * Barra de progresso do formulário multi-step
 */

import { TOTAL_STEPS } from '../config/constants.js'
import { t, getSavedLanguage } from '../utils/translations.js'

/**
 * Criar barra de progresso
 * @param {number} currentStep - Step atual (1-4)
 * @returns {HTMLElement}
 */
export function createProgressBar(currentStep = 1) {
  const container = document.createElement('div')
  container.className = 'progress-bar-container'

  // Calcular porcentagem
  const percentage = ((currentStep - 1) / TOTAL_STEPS) * 100

  const lang = getSavedLanguage()

  container.innerHTML = `
    <div class="progress-info">
      <span class="progress-text">
        ${t(lang, 'progress.step')} ${currentStep} ${t(lang, 'progress.of')} ${TOTAL_STEPS}
      </span>
      <span class="progress-percentage">${Math.round(percentage)}%</span>
    </div>
    <div class="progress-bar-track">
      <div
        class="progress-bar-fill"
        style="width: ${percentage}%"
        data-step="${currentStep}"
      ></div>
    </div>
  `

  return container
}

/**
 * Atualizar barra de progresso existente
 * @param {HTMLElement} progressBar - Elemento da barra de progresso
 * @param {number} currentStep - Novo step atual
 */
export function updateProgressBar(progressBar, currentStep) {
  if (!progressBar) return

  const percentage = ((currentStep - 1) / TOTAL_STEPS) * 100
  const lang = getSavedLanguage()

  // Atualizar texto
  const progressText = progressBar.querySelector('.progress-text')
  if (progressText) {
    progressText.textContent = `${t(lang, 'progress.step')} ${currentStep} ${t(lang, 'progress.of')} ${TOTAL_STEPS}`
  }

  // Atualizar porcentagem
  const progressPercentage = progressBar.querySelector('.progress-percentage')
  if (progressPercentage) {
    progressPercentage.textContent = `${Math.round(percentage)}%`
  }

  // Atualizar barra
  const progressFill = progressBar.querySelector('.progress-bar-fill')
  if (progressFill) {
    progressFill.style.width = `${percentage}%`
    progressFill.dataset.step = currentStep
  }
}

/**
 * Animar transição da barra de progresso
 * @param {HTMLElement} progressBar - Elemento da barra de progresso
 * @param {number} newStep - Novo step
 */
export function animateProgressBarTransition(progressBar, newStep) {
  const progressFill = progressBar?.querySelector('.progress-bar-fill')

  if (progressFill) {
    progressFill.style.transition = 'width 0.5s ease-in-out'
  }

  updateProgressBar(progressBar, newStep)
}

export default {
  createProgressBar,
  updateProgressBar,
  animateProgressBarTransition
}
