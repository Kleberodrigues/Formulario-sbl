/**
 * AdditionalInfoPage - Step 7
 * Página de informações adicionais (NI, UTR, VAT)
 */

import { t } from '../utils/translations.js'
import {
  validateNationalInsuranceNumber,
  validateUTRNumber,
  validateVATNumber
} from '../utils/validators.js'
import { updateCandidateFields } from '../services/supabaseService.js'

/**
 * Renderizar página de informações adicionais
 * @param {HTMLElement} container - Container onde será renderizado
 * @param {object} options - Opções { lang, onNext, onBack, formData }
 */
export function renderAdditionalInfoPage(container, options = {}) {
  const {
    lang = 'pt-BR',
    onNext = null,
    onBack = null,
    formData = {}
  } = options

  container.innerHTML = `
    <div class="form-page additional-info-page">
      <div class="form-header">
        <h2 class="form-title">${t(lang, 'additionalInfo.title')}</h2>
        <p class="form-subtitle">${t(lang, 'additionalInfo.subtitle')}</p>
      </div>

      <form id="additionalInfoForm" class="form-content">
        <!-- National Insurance Number -->
        <div class="form-group">
          <label for="niNumber" class="form-label">
            ${t(lang, 'additionalInfo.niNumber')} *
          </label>
          <input
            type="text"
            id="niNumber"
            name="niNumber"
            class="form-input"
            placeholder="${t(lang, 'additionalInfo.niNumberPlaceholder')}"
            value="${formData.nationalInsuranceNumber || ''}"
            maxlength="13"
            required
          />
          <div class="form-helper">
            Format: XX 999999 X (e.g., AB 123456 C)
          </div>
        </div>

        <!-- UTR Number -->
        <div class="form-group">
          <label for="utrNumber" class="form-label">
            ${t(lang, 'additionalInfo.utrNumber')} *
          </label>
          <input
            type="text"
            id="utrNumber"
            name="utrNumber"
            class="form-input"
            placeholder="${t(lang, 'additionalInfo.utrNumberPlaceholder')}"
            value="${formData.utrNumber || ''}"
            maxlength="10"
            required
          />
          <div class="form-helper">
            10 digits
          </div>
        </div>

        <!-- Employment Status -->
        <div class="form-group">
          <label for="employmentStatus" class="form-label">
            ${t(lang, 'additionalInfo.employmentStatus')} *
          </label>
          <select
            id="employmentStatus"
            name="employmentStatus"
            class="form-input form-select"
            required
          >
            <option value="">Select...</option>
            <option value="employed" ${formData.employmentStatus === 'employed' ? 'selected' : ''}>
              Employed
            </option>
            <option value="self-employed" ${formData.employmentStatus === 'self-employed' ? 'selected' : ''}>
              Self-Employed
            </option>
            <option value="unemployed" ${formData.employmentStatus === 'unemployed' ? 'selected' : ''}>
              Unemployed
            </option>
            <option value="student" ${formData.employmentStatus === 'student' ? 'selected' : ''}>
              Student
            </option>
            <option value="retired" ${formData.employmentStatus === 'retired' ? 'selected' : ''}>
              Retired
            </option>
          </select>
        </div>

        <!-- VAT Number (opcional) -->
        <div class="form-group">
          <label for="vatNumber" class="form-label">
            ${t(lang, 'additionalInfo.vatNumber')}
          </label>
          <input
            type="text"
            id="vatNumber"
            name="vatNumber"
            class="form-input"
            placeholder="${t(lang, 'additionalInfo.vatNumberPlaceholder')}"
            value="${formData.vatNumber || ''}"
            maxlength="15"
          />
          <div class="form-helper">
            Optional - For self-employed only
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" id="backBtn">
            ${t(lang, 'additionalInfo.backButton')}
          </button>
          <button type="submit" class="btn btn-primary" id="continueBtn">
            ${t(lang, 'additionalInfo.continueButton')}
          </button>
        </div>
      </form>
    </div>
  `

  // Event listeners
  const form = container.querySelector('#additionalInfoForm')
  const niNumberInput = container.querySelector('#niNumber')
  const utrNumberInput = container.querySelector('#utrNumber')
  const vatNumberInput = container.querySelector('#vatNumber')
  const employmentStatusSelect = container.querySelector('#employmentStatus')
  const backBtn = container.querySelector('#backBtn')
  const continueBtn = container.querySelector('#continueBtn')

  // Formatar NI Number automaticamente (inserir espaços)
  niNumberInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '').toUpperCase()

    if (value.length > 2) {
      value = value.slice(0, 2) + ' ' + value.slice(2)
    }
    if (value.length > 9) {
      value = value.slice(0, 9) + ' ' + value.slice(9)
    }

    e.target.value = value
  })

  // Formatar UTR (apenas números)
  utrNumberInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '')
  })

  // Mostrar/esconder VAT baseado no employment status
  employmentStatusSelect.addEventListener('change', () => {
    const isSelfEmployed = employmentStatusSelect.value === 'self-employed'
    vatNumberInput.parentElement.style.display = isSelfEmployed ? 'block' : 'none'
  })

  // Estado inicial do VAT
  const isSelfEmployed = formData.employmentStatus === 'self-employed'
  vatNumberInput.parentElement.style.display = isSelfEmployed ? 'block' : 'none'

  // Voltar
  backBtn.addEventListener('click', () => {
    if (onBack) onBack()
  })

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formDataObj = new FormData(form)
    const data = {
      nationalInsuranceNumber: formDataObj.get('niNumber').trim().replace(/\s/g, ''),
      utrNumber: formDataObj.get('utrNumber').trim(),
      employmentStatus: formDataObj.get('employmentStatus'),
      vatNumber: formDataObj.get('vatNumber').trim()
    }

    // Validar NI Number
    const niValidation = validateNationalInsuranceNumber(data.nationalInsuranceNumber, lang)
    if (!niValidation.valid) {
      alert(niValidation.error)
      return
    }

    // Validar UTR
    const utrValidation = validateUTRNumber(data.utrNumber, lang)
    if (!utrValidation.valid) {
      alert(utrValidation.error)
      return
    }

    // Validar VAT (se preenchido)
    if (data.vatNumber) {
      const vatValidation = validateVATNumber(data.vatNumber, lang)
      if (!vatValidation.valid) {
        alert(vatValidation.error)
        return
      }
    }

    // Salvar
    continueBtn.disabled = true
    continueBtn.textContent = t(lang, 'system.saving')

    try {
      // Atualizar informações adicionais do candidato
      await updateCandidateFields(formData.candidateId, {
        national_insurance_number: data.nationalInsuranceNumber,
        utr_number: data.utrNumber,
        employment_status: data.employmentStatus,
        vat_number: data.vatNumber
      })

      console.log('✅ Step 6 (AdditionalInfo) salvo no Supabase')

      if (onNext) {
        onNext(data)
      }
    } catch (error) {
      console.error('❌ Erro ao salvar informações adicionais:', error)
      alert(t(lang, 'system.error'))
      continueBtn.disabled = false
      continueBtn.textContent = t(lang, 'additionalInfo.continueButton')
    }
  })
}

export default {
  renderAdditionalInfoPage
}
