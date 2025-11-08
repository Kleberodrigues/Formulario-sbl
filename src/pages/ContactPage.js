/**
 * ContactPage.js
 * Step 2 - Dados de Contato
 */

import { createFormStep, createStepButtons, setButtonLoading } from '../components/FormStep.js'
import { STEPS } from '../config/constants.js'
import { t, getSavedLanguage } from '../utils/translations.js'
import {
  validateFullName,
  validateEmail,
  validatePhone,
  validateContactForm,
  showInputError,
  clearInputError,
  cleanInput
} from '../utils/validators.js'
import { upsertFormSubmission } from '../services/supabaseService.js'

/**
 * Criar Step de Contato
 * @param {object} initialData - Dados iniciais (se houver)
 * @param {function} onContinue - Callback ao continuar (data) => void
 * @param {function} onBack - Callback ao voltar
 * @returns {HTMLElement} - Container do step
 */
export function createContactPage(initialData = {}, onContinue, onBack) {
  const container = createFormStep('contact', STEPS.CONTACT)
  let currentLanguage = getSavedLanguage()

  // Estado dos campos
  const formState = {
    fullName: initialData.fullName || '',
    email: initialData.email || '',
    phone: initialData.phone || ''
  }

  /**
   * Criar conteúdo do step
   */
  function createContent() {
    const content = document.createElement('div')
    content.className = 'step-content'

    content.innerHTML = `
      <div class="step-header">
        <h1 class="step-title">${t(currentLanguage, 'contact.title')}</h1>
        <p class="step-subtitle">${t(currentLanguage, 'contact.subtitle')}</p>
      </div>

      <form class="contact-form" id="contactForm">
        <!-- Nome Completo -->
        <div class="form-group">
          <label class="form-label" for="fullName">
            ${t(currentLanguage, 'contact.fullName')}
            <span class="required-star">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            class="form-input"
            placeholder="${t(currentLanguage, 'contact.fullNamePlaceholder')}"
            value="${formState.fullName}"
            autocomplete="name"
            required
          />
        </div>

        <!-- Email -->
        <div class="form-group">
          <label class="form-label" for="email">
            ${t(currentLanguage, 'contact.email')}
            <span class="required-star">*</span>
          </label>
          <input
            type="email"
            id="email"
            class="form-input"
            placeholder="${t(currentLanguage, 'contact.emailPlaceholder')}"
            value="${formState.email}"
            autocomplete="email"
            required
          />
        </div>

        <!-- Telefone -->
        <div class="form-group">
          <label class="form-label" for="phone">
            ${t(currentLanguage, 'contact.phone')}
            <span class="required-star">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            class="form-input"
            placeholder="${t(currentLanguage, 'contact.phonePlaceholder')}"
            value="${formState.phone}"
            autocomplete="tel"
            required
          />
        </div>
      </form>
    `

    return content
  }

  /**
   * Validar campo individual
   */
  function validateField(fieldName, value) {
    const input = container.querySelector(`#${fieldName}`)
    if (!input) return false

    let validation
    switch (fieldName) {
      case 'fullName':
        validation = validateFullName(value, currentLanguage)
        break
      case 'email':
        validation = validateEmail(value, currentLanguage)
        break
      case 'phone':
        validation = validatePhone(value, currentLanguage)
        break
      default:
        return false
    }

    if (!validation.valid) {
      showInputError(input, validation.error)
      return false
    } else {
      clearInputError(input)
      return true
    }
  }

  /**
   * Setup event listeners para validação em tempo real
   */
  function setupValidation() {
    const fullNameInput = container.querySelector('#fullName')
    const emailInput = container.querySelector('#email')
    const phoneInput = container.querySelector('#phone')

    // Validar quando usuário sai do campo (blur)
    fullNameInput.addEventListener('blur', (e) => {
      const value = cleanInput(e.target.value)
      formState.fullName = value
      e.target.value = value
      validateField('fullName', value)
    })

    emailInput.addEventListener('blur', (e) => {
      const value = cleanInput(e.target.value)
      formState.email = value
      e.target.value = value
      validateField('email', value)
    })

    phoneInput.addEventListener('blur', (e) => {
      const value = cleanInput(e.target.value)
      formState.phone = value
      e.target.value = value
      validateField('phone', value)
    })

    // Limpar erro quando usuário começa a digitar
    fullNameInput.addEventListener('input', () => {
      clearInputError(fullNameInput)
    })

    emailInput.addEventListener('input', () => {
      clearInputError(emailInput)
    })

    phoneInput.addEventListener('input', () => {
      clearInputError(phoneInput)
    })
  }

  /**
   * Salvar dados de contato
   */
  async function saveContactData() {
    try {
      // Obter valores atuais dos inputs
      const fullNameInput = container.querySelector('#fullName')
      const emailInput = container.querySelector('#email')
      const phoneInput = container.querySelector('#phone')

      formState.fullName = cleanInput(fullNameInput.value)
      formState.email = cleanInput(emailInput.value)
      formState.phone = cleanInput(phoneInput.value)

      // Validar todos os campos
      const validation = validateContactForm(formState, currentLanguage)

      if (!validation.valid) {
        // Mostrar erros nos campos
        if (validation.errors.fullName) {
          showInputError(fullNameInput, validation.errors.fullName)
        }
        if (validation.errors.email) {
          showInputError(emailInput, validation.errors.email)
        }
        if (validation.errors.phone) {
          showInputError(phoneInput, validation.errors.phone)
        }

        // Focar no primeiro campo com erro
        const firstErrorField = Object.keys(validation.errors)[0]
        container.querySelector(`#${firstErrorField}`)?.focus()

        return false
      }

      // Salvar no localStorage
      const savedData = JSON.parse(localStorage.getItem('sbl_form_data') || '{}')
      const updatedData = {
        ...savedData,
        fullName: formState.fullName,
        email: formState.email,
        phone: formState.phone,
        currentStep: STEPS.CONTACT,
        completedSteps: [...new Set([...(savedData.completedSteps || []), STEPS.CONTACT])]
      }

      localStorage.setItem('sbl_form_data', JSON.stringify(updatedData))
      console.log('💾 Dados de contato salvos localmente')

      // Tentar salvar no Supabase (incluindo dados de steps anteriores)
      try {
        await upsertFormSubmission(formState.email, {
          fullName: formState.fullName,
          phone: formState.phone,
          language: savedData.language || currentLanguage,
          selectedDepot: savedData.selectedDepot,
          depotCode: savedData.depotCode,
          currentStep: STEPS.CONTACT,
          completedSteps: updatedData.completedSteps
        })
        console.log('✅ Dados salvos no Supabase (incluindo idioma e depot)')
      } catch (supabaseError) {
        console.warn('⚠️ Erro ao salvar no Supabase:', supabaseError.message)
        // Continuar mesmo se Supabase falhar (dados estão no localStorage)
      }

      return true
    } catch (error) {
      console.error('❌ Erro ao salvar dados de contato:', error)
      throw error
    }
  }

  /**
   * Handler do botão Continue
   */
  async function handleContinue(e) {
    e.preventDefault()

    const continueButton = container.querySelector('.btn-continue')

    try {
      setButtonLoading(continueButton, true, t(currentLanguage, 'system.saving'))

      const success = await saveContactData()

      if (success) {
        console.log('✅ Step 2 concluído:', formState)

        if (onContinue) {
          onContinue({
            fullName: formState.fullName,
            email: formState.email,
            phone: formState.phone
          })
        }
      }
    } catch (error) {
      alert(t(currentLanguage, 'system.networkError'))
      console.error('❌ Erro:', error)
    } finally {
      setButtonLoading(continueButton, false)
    }
  }

  /**
   * Handler do botão Back
   */
  function handleBack(e) {
    e.preventDefault()

    // Salvar dados antes de voltar
    const fullNameInput = container.querySelector('#fullName')
    const emailInput = container.querySelector('#email')
    const phoneInput = container.querySelector('#phone')

    formState.fullName = cleanInput(fullNameInput.value)
    formState.email = cleanInput(emailInput.value)
    formState.phone = cleanInput(phoneInput.value)

    // Salvar no localStorage (sem validação rigorosa)
    const savedData = JSON.parse(localStorage.getItem('sbl_form_data') || '{}')
    localStorage.setItem('sbl_form_data', JSON.stringify({
      ...savedData,
      fullName: formState.fullName,
      email: formState.email,
      phone: formState.phone
    }))

    if (onBack) {
      onBack()
    }
  }

  // Montar o step
  const content = createContent()
  container.appendChild(content)

  const buttons = createStepButtons({
    showBack: true,
    continueText: t(currentLanguage, 'contact.continueButton'),
    backText: t(currentLanguage, 'contact.backButton'),
    onContinue: handleContinue,
    onBack: handleBack
  })

  container.appendChild(buttons)

  // Setup validação
  setupValidation()

  // Focar no primeiro campo
  setTimeout(() => {
    container.querySelector('#fullName')?.focus()
  }, 100)

  return container
}

export default createContactPage
