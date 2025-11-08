/**
 * PersonalInfoPage - Step 5
 * Página de informações pessoais
 */

import { t } from '../utils/translations.js'
import { validateBirthDate, validatePhone } from '../utils/validators.js'
import { saveFormStep } from '../services/supabaseService.js'

/**
 * Renderizar página de informações pessoais
 * @param {HTMLElement} container - Container onde será renderizado
 * @param {object} options - Opções { lang, onNext, onBack, formData }
 */
export function renderPersonalInfoPage(container, options = {}) {
  const {
    lang = 'pt-BR',
    onNext = null,
    onBack = null,
    formData = {}
  } = options

  container.innerHTML = `
    <div class="form-page personal-info-page">
      <div class="form-header">
        <h2 class="form-title">${t(lang, 'personalInfo.title')}</h2>
        <p class="form-subtitle">${t(lang, 'personalInfo.subtitle')}</p>
      </div>

      <form id="personalInfoForm" class="form-content">
        <!-- Data de Nascimento -->
        <div class="form-group">
          <label for="birthDate" class="form-label">
            ${t(lang, 'personalInfo.birthDate')} *
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            class="form-input"
            value="${formData.birthDate || ''}"
            required
          />
        </div>

        <!-- Cidade de Nascimento -->
        <div class="form-group">
          <label for="birthCity" class="form-label">
            ${t(lang, 'personalInfo.birthCity')} *
          </label>
          <input
            type="text"
            id="birthCity"
            name="birthCity"
            class="form-input"
            placeholder="${t(lang, 'personalInfo.birthCityPlaceholder')}"
            value="${formData.birthCity || ''}"
            required
          />
        </div>

        <!-- Nome da Mãe -->
        <div class="form-row form-row-2">
          <div class="form-group">
            <label for="motherName" class="form-label">
              ${t(lang, 'personalInfo.motherName')} *
            </label>
            <input
              type="text"
              id="motherName"
              name="motherName"
              class="form-input"
              placeholder="${t(lang, 'personalInfo.motherNamePlaceholder')}"
              value="${formData.motherName || ''}"
              required
            />
          </div>

          <div class="form-group">
            <label for="motherSurname" class="form-label">
              ${t(lang, 'personalInfo.motherSurname')} *
            </label>
            <input
              type="text"
              id="motherSurname"
              name="motherSurname"
              class="form-input"
              placeholder="${t(lang, 'personalInfo.motherSurnamePlaceholder')}"
              value="${formData.motherSurname || ''}"
              required
            />
          </div>
        </div>

        <!-- Next of Kin -->
        <div class="form-section">
          <h3 class="form-section-title">Next of Kin</h3>

          <div class="form-group">
            <label for="nextOfKinName" class="form-label">
              ${t(lang, 'personalInfo.nextOfKinName')} *
            </label>
            <input
              type="text"
              id="nextOfKinName"
              name="nextOfKinName"
              class="form-input"
              placeholder="${t(lang, 'personalInfo.nextOfKinNamePlaceholder')}"
              value="${formData.nextOfKinName || ''}"
              required
            />
          </div>

          <div class="form-row form-row-2">
            <div class="form-group">
              <label for="nextOfKinRelationship" class="form-label">
                ${t(lang, 'personalInfo.nextOfKinRelationship')} *
              </label>
              <input
                type="text"
                id="nextOfKinRelationship"
                name="nextOfKinRelationship"
                class="form-input"
                placeholder="${t(lang, 'personalInfo.nextOfKinRelationshipPlaceholder')}"
                value="${formData.nextOfKinRelationship || ''}"
                required
              />
            </div>

            <div class="form-group">
              <label for="nextOfKinPhone" class="form-label">
                ${t(lang, 'personalInfo.nextOfKinPhone')} *
              </label>
              <input
                type="tel"
                id="nextOfKinPhone"
                name="nextOfKinPhone"
                class="form-input"
                placeholder="${t(lang, 'personalInfo.nextOfKinPhonePlaceholder')}"
                value="${formData.nextOfKinPhone || ''}"
                required
              />
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" id="backBtn">
            ${t(lang, 'personalInfo.backButton')}
          </button>
          <button type="submit" class="btn btn-primary" id="continueBtn">
            ${t(lang, 'personalInfo.continueButton')}
          </button>
        </div>
      </form>
    </div>
  `

  // Event listeners
  const form = container.querySelector('#personalInfoForm')
  const backBtn = container.querySelector('#backBtn')
  const continueBtn = container.querySelector('#continueBtn')

  // Voltar
  backBtn.addEventListener('click', () => {
    if (onBack) onBack()
  })

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formDataObj = new FormData(form)
    const data = {
      birthDate: formDataObj.get('birthDate'),
      birthCity: formDataObj.get('birthCity').trim(),
      motherName: formDataObj.get('motherName').trim(),
      motherSurname: formDataObj.get('motherSurname').trim(),
      nextOfKinName: formDataObj.get('nextOfKinName').trim(),
      nextOfKinRelationship: formDataObj.get('nextOfKinRelationship').trim(),
      nextOfKinPhone: formDataObj.get('nextOfKinPhone').trim()
    }

    // Validar data de nascimento
    const birthDateValidation = validateBirthDate(data.birthDate, lang)
    if (!birthDateValidation.valid) {
      alert(birthDateValidation.error)
      return
    }

    // Validar telefone do parente
    const phoneValidation = validatePhone(data.nextOfKinPhone, lang)
    if (!phoneValidation.valid) {
      alert(phoneValidation.error)
      return
    }

    // Salvar
    continueBtn.disabled = true
    continueBtn.textContent = t(lang, 'system.saving')

    try {
      await saveFormStep(formData.email, 4, data)

      if (onNext) {
        onNext(data)
      }
    } catch (error) {
      console.error('Error saving personal info:', error)
      alert(t(lang, 'system.error'))
      continueBtn.disabled = false
      continueBtn.textContent = t(lang, 'personalInfo.continueButton')
    }
  })
}

export default {
  renderPersonalInfoPage
}
