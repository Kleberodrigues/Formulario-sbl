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
    <div class="progress-steps">
      ${Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const stepNumber = i + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return `
          <div class="progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
            <div class="step-circle">
              ${isCompleted ? '✓' : stepNumber}
            </div>
          </div>
        `
      }).join('')}
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

  // Atualizar círculos dos steps
  const steps = progressBar.querySelectorAll('.progress-step')
  steps.forEach((step, index) => {
    const stepNumber = index + 1
    const circle = step.querySelector('.step-circle')

    step.classList.remove('active', 'completed')

    if (stepNumber === currentStep) {
      step.classList.add('active')
      if (circle) circle.textContent = stepNumber
    } else if (stepNumber < currentStep) {
      step.classList.add('completed')
      if (circle) circle.textContent = '✓'
    } else {
      if (circle) circle.textContent = stepNumber
    }
  })
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
