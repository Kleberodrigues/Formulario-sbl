/**
 * Componente FormStep (Base)
 * Componente genérico para steps do formulário
 */

/**
 * Criar container base para um step
 * @param {string} stepName - Nome do step (welcome, contact, etc)
 * @param {number} stepNumber - Número do step
 * @returns {HTMLElement}
 */
export function createFormStep(stepName, stepNumber) {
  const container = document.createElement('div')
  container.className = `form-step form-step-${stepName}`
  container.dataset.step = stepNumber

  return container
}

/**
 * Criar conteúdo do step com título e subtítulo
 * @param {string} title - Título do step
 * @param {string} subtitle - Subtítulo do step
 * @returns {HTMLElement}
 */
export function createStepContent(title, subtitle = '') {
  const content = document.createElement('div')
  content.className = 'step-content'

  if (title) {
    const titleElement = document.createElement('h2')
    titleElement.className = 'step-title'
    titleElement.textContent = title
    content.appendChild(titleElement)
  }

  if (subtitle) {
    const subtitleElement = document.createElement('p')
    subtitleElement.className = 'step-subtitle'
    subtitleElement.textContent = subtitle
    content.appendChild(subtitleElement)
  }

  return content
}

/**
 * Criar container para formulário do step
 * @returns {HTMLElement}
 */
export function createStepForm() {
  const form = document.createElement('form')
  form.className = 'step-form'
  form.setAttribute('novalidate', 'true') // Validação customizada

  return form
}

/**
 * Criar botões de navegação do step
 * @param {object} options - Opções dos botões
 * @param {boolean} options.showBack - Mostrar botão Voltar
 * @param {string} options.continueText - Texto do botão Continuar
 * @param {string} options.backText - Texto do botão Voltar
 * @param {function} options.onContinue - Callback ao clicar em Continuar
 * @param {function} options.onBack - Callback ao clicar em Voltar
 * @returns {HTMLElement}
 */
export function createStepButtons(options = {}) {
  const {
    showBack = false,
    continueText = 'Continuar',
    backText = 'Voltar',
    onContinue,
    onBack
  } = options

  const container = document.createElement('div')
  container.className = 'step-buttons'

  // Botão Voltar
  if (showBack) {
    const backButton = document.createElement('button')
    backButton.type = 'button'
    backButton.className = 'btn btn-secondary btn-back'
    backButton.textContent = backText

    if (onBack) {
      backButton.addEventListener('click', onBack)
    }

    container.appendChild(backButton)
  }

  // Botão Continuar
  const continueButton = document.createElement('button')
  continueButton.type = 'submit'
  continueButton.className = 'btn btn-primary btn-continue'
  continueButton.textContent = continueText

  if (onContinue) {
    continueButton.addEventListener('click', onContinue)
  }

  container.appendChild(continueButton)

  return container
}

/**
 * Criar campo de input genérico
 * @param {object} options - Opções do input
 * @returns {HTMLElement}
 */
export function createFormField(options = {}) {
  const {
    type = 'text',
    name,
    label,
    placeholder = '',
    required = false,
    value = '',
    pattern,
    minLength,
    maxLength
  } = options

  const fieldContainer = document.createElement('div')
  fieldContainer.className = 'form-field'

  // Label
  if (label) {
    const labelElement = document.createElement('label')
    labelElement.className = 'form-label'
    labelElement.setAttribute('for', name)
    labelElement.textContent = label

    if (required) {
      const requiredMark = document.createElement('span')
      requiredMark.className = 'required-mark'
      requiredMark.textContent = ' *'
      labelElement.appendChild(requiredMark)
    }

    fieldContainer.appendChild(labelElement)
  }

  // Input
  const input = document.createElement('input')
  input.type = type
  input.name = name
  input.id = name
  input.className = 'form-input'
  input.placeholder = placeholder
  input.value = value

  if (required) input.setAttribute('required', 'true')
  if (pattern) input.setAttribute('pattern', pattern)
  if (minLength) input.setAttribute('minlength', minLength)
  if (maxLength) input.setAttribute('maxlength', maxLength)

  fieldContainer.appendChild(input)

  // Container para mensagem de erro
  const errorMessage = document.createElement('span')
  errorMessage.className = 'error-message'
  errorMessage.style.display = 'none'
  fieldContainer.appendChild(errorMessage)

  return fieldContainer
}

/**
 * Mostrar erro em um campo
 * @param {HTMLElement} field - Container do campo
 * @param {string} message - Mensagem de erro
 */
export function showFieldError(field, message) {
  const input = field.querySelector('.form-input')
  const errorMessage = field.querySelector('.error-message')

  if (input) input.classList.add('error')
  if (errorMessage) {
    errorMessage.textContent = message
    errorMessage.style.display = 'block'
  }
}

/**
 * Limpar erro de um campo
 * @param {HTMLElement} field - Container do campo
 */
export function clearFieldError(field) {
  const input = field.querySelector('.form-input')
  const errorMessage = field.querySelector('.error-message')

  if (input) input.classList.remove('error')
  if (errorMessage) {
    errorMessage.textContent = ''
    errorMessage.style.display = 'none'
  }
}

/**
 * Mostrar loading no botão
 * @param {HTMLElement} button - Botão
 * @param {boolean} loading - Estado de loading
 * @param {string} loadingText - Texto durante loading
 */
export function setButtonLoading(button, loading, loadingText = 'Carregando...') {
  if (!button) return

  if (loading) {
    button.dataset.originalText = button.textContent
    button.textContent = loadingText
    button.disabled = true
    button.classList.add('loading')
  } else {
    button.textContent = button.dataset.originalText || 'Continuar'
    button.disabled = false
    button.classList.remove('loading')
  }
}

export default {
  createFormStep,
  createStepContent,
  createStepForm,
  createStepButtons,
  createFormField,
  showFieldError,
  clearFieldError,
  setButtonLoading
}
