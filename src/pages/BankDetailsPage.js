/**
 * BankDetailsPage - Step 10
 * Página de dados bancários (Account Number e Sort Code)
 */

import { t } from '../utils/translations.js'
import {
  validateAccountNumber,
  validateSortCode
} from '../utils/validators.js'
import { saveFormStep } from '../services/supabaseService.js'

/**
 * Renderizar página de dados bancários
 * @param {HTMLElement} container - Container onde será renderizado
 * @param {object} options - Opções { lang, onNext, onBack, formData }
 */
export function renderBankDetailsPage(container, options = {}) {
  const {
    lang = 'pt-BR',
    onNext = null,
    onBack = null,
    formData = {}
  } = options

  container.innerHTML = `
    <div class="form-page bank-details-page">
      <div class="form-header">
        <h2 class="form-title">${t(lang, 'bankDetails.title')}</h2>
        <p class="form-subtitle">${t(lang, 'bankDetails.subtitle')}</p>
      </div>

      <form id="bankDetailsForm" class="form-content">
        <!-- Account Number -->
        <div class="form-group">
          <label for="accountNumber" class="form-label">
            ${t(lang, 'bankDetails.accountNumber')} *
          </label>
          <input
            type="text"
            id="accountNumber"
            name="accountNumber"
            class="form-input"
            placeholder="${t(lang, 'bankDetails.accountNumberPlaceholder')}"
            value="${formData.bankAccountNumber || ''}"
            maxlength="8"
            required
          />
          <div class="form-helper">
            8 digits
          </div>
        </div>

        <!-- Sort Code -->
        <div class="form-group">
          <label for="sortCode" class="form-label">
            ${t(lang, 'bankDetails.sortCode')} *
          </label>
          <input
            type="text"
            id="sortCode"
            name="sortCode"
            class="form-input"
            placeholder="${t(lang, 'bankDetails.sortCodePlaceholder')}"
            value="${formData.bankSortCode || ''}"
            maxlength="8"
            required
          />
          <div class="form-helper">
            Format: XX-XX-XX
          </div>
        </div>

        <!-- Payment Declaration -->
        <div class="form-section">
          <h3 class="form-section-title">${t(lang, 'bankDetails.declarationTitle')}</h3>
          <div class="declaration-box">
            <p class="declaration-text">
              ${t(lang, 'bankDetails.declarationText')}
            </p>
          </div>

          <label class="checkbox-label checkbox-label-large">
            <input
              type="checkbox"
              id="acceptDeclaration"
              name="acceptDeclaration"
              required
            />
            <span>${t(lang, 'bankDetails.acceptDeclaration')}</span>
          </label>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" id="backBtn">
            ${t(lang, 'bankDetails.backButton')}
          </button>
          <button type="submit" class="btn btn-primary" id="continueBtn">
            ${t(lang, 'bankDetails.continueButton')}
          </button>
        </div>
      </form>
    </div>
  `

  // Event listeners
  const form = container.querySelector('#bankDetailsForm')
  const accountNumberInput = container.querySelector('#accountNumber')
  const sortCodeInput = container.querySelector('#sortCode')
  const backBtn = container.querySelector('#backBtn')
  const continueBtn = container.querySelector('#continueBtn')

  // Formatar Account Number (apenas números)
  accountNumberInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '')
  })

  // Formatar Sort Code (XX-XX-XX)
  sortCodeInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '')

    if (value.length > 2) {
      value = value.slice(0, 2) + '-' + value.slice(2)
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + '-' + value.slice(5)
    }

    e.target.value = value.slice(0, 8)
  })

  // Voltar
  backBtn.addEventListener('click', () => {
    if (onBack) onBack()
  })

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formDataObj = new FormData(form)
    const data = {
      accountNumber: formDataObj.get('accountNumber').trim(),
      sortCode: formDataObj.get('sortCode').trim(),
      acceptDeclaration: formDataObj.get('acceptDeclaration') === 'on'
    }

    // Validar Account Number
    const accountValidation = validateAccountNumber(data.accountNumber, lang)
    if (!accountValidation.valid) {
      alert(accountValidation.error)
      return
    }

    // Validar Sort Code
    const sortCodeValidation = validateSortCode(data.sortCode, lang)
    if (!sortCodeValidation.valid) {
      alert(sortCodeValidation.error)
      return
    }

    // Verificar declaração
    if (!data.acceptDeclaration) {
      alert(t(lang, 'validation.required'))
      return
    }

    // Salvar (dados bancários devem ser encriptados no backend)
    continueBtn.disabled = true
    continueBtn.textContent = t(lang, 'system.saving')

    try {
      await saveFormStep(formData.email, 10, {
        bank_account_number: data.accountNumber, // Será encriptado no backend
        bank_sort_code: data.sortCode, // Será encriptado no backend
        payment_declaration_accepted: true,
        payment_declaration_accepted_at: new Date().toISOString()
      })

      if (onNext) {
        onNext({
          bankAccountNumber: data.accountNumber,
          bankSortCode: data.sortCode
        })
      }
    } catch (error) {
      console.error('Error saving bank details:', error)
      alert(t(lang, 'system.error'))
      continueBtn.disabled = false
      continueBtn.textContent = t(lang, 'bankDetails.continueButton')
    }
  })
}

export default {
  renderBankDetailsPage
}
