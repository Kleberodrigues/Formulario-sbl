/**
 * Validators.js
 * Validações de campos do formulário
 */

import { t } from './translations.js'

/**
 * Validar nome completo
 * @param {string} name - Nome a validar
 * @param {string} lang - Idioma
 * @returns {object} - { valid: boolean, error: string }
 */
export function validateFullName(name, lang = 'pt-BR') {
  const trimmedName = name?.trim() || ''

  if (!trimmedName) {
    return {
      valid: false,
      error: t(lang, 'validation.required')
    }
  }

  if (trimmedName.length < 3) {
    return {
      valid: false,
      error: t(lang, 'validation.nameTooShort')
    }
  }

  if (trimmedName.length > 100) {
    return {
      valid: false,
      error: t(lang, 'validation.nameTooLong')
    }
  }

  // Verificar se tem pelo menos 2 palavras (nome e sobrenome)
  const words = trimmedName.split(/\s+/)
  if (words.length < 2) {
    return {
      valid: false,
      error: t(lang, 'validation.nameTooShort')
    }
  }

  return { valid: true, error: null }
}

/**
 * Validar email
 * @param {string} email - Email a validar
 * @param {string} lang - Idioma
 * @returns {object} - { valid: boolean, error: string }
 */
export function validateEmail(email, lang = 'pt-BR') {
  const trimmedEmail = email?.trim() || ''

  if (!trimmedEmail) {
    return {
      valid: false,
      error: t(lang, 'validation.required')
    }
  }

  // Regex simples para email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(trimmedEmail)) {
    return {
      valid: false,
      error: t(lang, 'validation.invalidEmail')
    }
  }

  return { valid: true, error: null }
}

/**
 * Validar telefone (formato internacional)
 * @param {string} phone - Telefone a validar
 * @param {string} lang - Idioma
 * @returns {object} - { valid: boolean, error: string }
 */
export function validatePhone(phone, lang = 'pt-BR') {
  const trimmedPhone = phone?.trim() || ''

  if (!trimmedPhone) {
    return {
      valid: false,
      error: t(lang, 'validation.required')
    }
  }

  // Remover caracteres não numéricos para contar
  const digitsOnly = trimmedPhone.replace(/\D/g, '')

  if (digitsOnly.length < 10) {
    return {
      valid: false,
      error: t(lang, 'validation.invalidPhone')
    }
  }

  return { valid: true, error: null }
}

/**
 * Validar mensagem (para chat)
 * @param {string} message - Mensagem a validar
 * @param {string} lang - Idioma
 * @returns {object} - { valid: boolean, error: string }
 */
export function validateMessage(message, lang = 'pt-BR') {
  const trimmedMessage = message?.trim() || ''

  if (!trimmedMessage) {
    return {
      valid: false,
      error: t(lang, 'validation.required')
    }
  }

  if (trimmedMessage.length > 500) {
    return {
      valid: false,
      error: t(lang, 'validation.messageTooLong')
    }
  }

  return { valid: true, error: null }
}

/**
 * Formatar telefone para exibição
 * @param {string} phone - Telefone bruto
 * @returns {string} - Telefone formatado
 */
export function formatPhone(phone) {
  if (!phone) return ''

  // Remover tudo exceto números e sinal de +
  const cleaned = phone.replace(/[^\d+]/g, '')

  return cleaned
}

/**
 * Limpar input (remover espaços extras)
 * @param {string} value - Valor a limpar
 * @returns {string} - Valor limpo
 */
export function cleanInput(value) {
  if (!value) return ''
  return value.trim().replace(/\s+/g, ' ')
}

/**
 * Criar mensagem de erro para input
 * @param {HTMLElement} input - Input element
 * @param {string} errorMessage - Mensagem de erro
 */
export function showInputError(input, errorMessage) {
  // Remover erro anterior se existir
  clearInputError(input)

  // Adicionar classe de erro
  input.classList.add('input-error')

  // Criar elemento de erro
  const errorDiv = document.createElement('div')
  errorDiv.className = 'input-error-message'
  errorDiv.textContent = errorMessage

  // Inserir após o input
  input.parentElement.appendChild(errorDiv)
}

/**
 * Limpar mensagem de erro do input
 * @param {HTMLElement} input - Input element
 */
export function clearInputError(input) {
  input.classList.remove('input-error')

  // Remover mensagem de erro se existir
  const errorMessage = input.parentElement.querySelector('.input-error-message')
  if (errorMessage) {
    errorMessage.remove()
  }
}

/**
 * Validar todos os campos de contato
 * @param {object} data - { fullName, email, phone }
 * @param {string} lang - Idioma
 * @returns {object} - { valid: boolean, errors: object }
 */
export function validateContactForm(data, lang = 'pt-BR') {
  const errors = {}

  // Validar nome
  const nameValidation = validateFullName(data.fullName, lang)
  if (!nameValidation.valid) {
    errors.fullName = nameValidation.error
  }

  // Validar email
  const emailValidation = validateEmail(data.email, lang)
  if (!emailValidation.valid) {
    errors.email = emailValidation.error
  }

  // Validar telefone
  const phoneValidation = validatePhone(data.phone, lang)
  if (!phoneValidation.valid) {
    errors.phone = phoneValidation.error
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validar National Insurance Number (UK)
 * Formato: XX 999999 X (2 letras, 6 dígitos, 1 letra)
 * @param {string} niNumber - NI Number a validar
 * @param {string} lang - Idioma
 * @returns {object} - { valid: boolean, error: string }
 */
export function validateNationalInsuranceNumber(niNumber, lang = 'pt-BR') {
  const trimmed = niNumber?.trim()?.replace(/\s/g, '') || ''

  if (!trimmed) {
    return {
      valid: false,
      error: t(lang, 'validation.required')
    }
  }

  // Formato: 2 letras, 6 dígitos, 1 letra
  // Letras permitidas: A-Z exceto D, F, I, Q, U, V
  const niRegex = /^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/i

  if (!niRegex.test(trimmed)) {
    return {
      valid: false,
      error: t(lang, 'validation.invalidNiNumber')
    }
  }

  return { valid: true, error: null }
}

/**
 * Validar UTR Number (Unique Taxpayer Reference)
 * Formato: 10 dígitos
 * @param {string} utr - UTR a validar
 * @param {string} lang - Idioma
 * @returns {object} - { valid: boolean, error: string }
 */
export function validateUTRNumber(utr, lang = 'pt-BR') {
  const trimmed = utr?.trim()?.replace(/\s/g, '') || ''

  if (!trimmed) {
    return {
      valid: false,
      error: t(lang, 'validation.required')
    }
  }

  const utrRegex = /^[0-9]{10}$/

  if (!utrRegex.test(trimmed)) {
    return {
      valid: false,
      error: t(lang, 'validation.invalidUtr')
    }
  }

  return { valid: true, error: null }
}

/**
 * Validar VAT Number (UK)
 * Formato: GB999999999 ou 999999999 (9 dígitos)
 * @param {string} vat - VAT a validar
 * @param {string} lang - Idioma
 * @returns {object} - { valid: boolean, error: string }
 */
export function validateVATNumber(vat, lang = 'pt-BR') {
  const trimmed = vat?.trim()?.replace(/\s/g, '') || ''

  if (!trimmed) {
    // VAT é opcional
    return { valid: true, error: null }
  }

  const vatRegex = /^(GB)?([0-9]{9}([0-9]{3})?|[A-Z]{2}[0-9]{3})$/i

  if (!vatRegex.test(trimmed)) {
    return {
      valid: false,
      error: t(lang, 'validation.invalidVat')
    }
  }

  return { valid: true, error: null }
}

/**
 * Validar Sort Code (UK)
 * Formato: XX-XX-XX (6 dígitos com ou sem hífens)
 * @param {string} sortCode - Sort Code a validar
 * @param {string} lang - Idioma
 * @returns {object} - { valid: boolean, error: string }
 */
export function validateSortCode(sortCode, lang = 'pt-BR') {
  const trimmed = sortCode?.trim() || ''

  if (!trimmed) {
    return {
      valid: false,
      error: t(lang, 'validation.required')
    }
  }

  const sortCodeRegex = /^[0-9]{2}-?[0-9]{2}-?[0-9]{2}$/

  if (!sortCodeRegex.test(trimmed)) {
    return {
      valid: false,
      error: t(lang, 'validation.invalidSortCode')
    }
  }

  return { valid: true, error: null }
}

/**
 * Validar Account Number (UK)
 * Formato: 8 dígitos
 * @param {string} accountNumber - Account Number a validar
 * @param {string} lang - Idioma
 * @returns {object} - { valid: boolean, error: string }
 */
export function validateAccountNumber(accountNumber, lang = 'pt-BR') {
  const trimmed = accountNumber?.trim()?.replace(/\s/g, '') || ''

  if (!trimmed) {
    return {
      valid: false,
      error: t(lang, 'validation.required')
    }
  }

  const accountRegex = /^[0-9]{8}$/

  if (!accountRegex.test(trimmed)) {
    return {
      valid: false,
      error: t(lang, 'validation.invalidAccountNumber')
    }
  }

  return { valid: true, error: null }
}

/**
 * Validar UK Postcode
 * @param {string} postcode - Postcode a validar
 * @param {string} lang - Idioma
 * @returns {object} - { valid: boolean, error: string }
 */
export function validateUKPostcode(postcode, lang = 'pt-BR') {
  const trimmed = postcode?.trim() || ''

  if (!trimmed) {
    return {
      valid: false,
      error: t(lang, 'validation.required')
    }
  }

  const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i

  if (!postcodeRegex.test(trimmed)) {
    return {
      valid: false,
      error: t(lang, 'validation.invalidPostcode')
    }
  }

  return { valid: true, error: null }
}

/**
 * Validar data de nascimento (18+ anos)
 * @param {string} birthDate - Data no formato YYYY-MM-DD
 * @param {string} lang - Idioma
 * @returns {object} - { valid: boolean, error: string }
 */
export function validateBirthDate(birthDate, lang = 'pt-BR') {
  if (!birthDate) {
    return {
      valid: false,
      error: t(lang, 'validation.required')
    }
  }

  const date = new Date(birthDate)

  // Verificar se é uma data válida
  if (isNaN(date.getTime())) {
    return {
      valid: false,
      error: t(lang, 'validation.invalidDate')
    }
  }

  // Calcular idade
  const today = new Date()
  let age = today.getFullYear() - date.getFullYear()
  const monthDiff = today.getMonth() - date.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--
  }

  // Verificar se tem pelo menos 18 anos
  if (age < 18) {
    return {
      valid: false,
      error: t(lang, 'validation.ageRequirement')
    }
  }

  return { valid: true, error: null }
}

/**
 * Validar tamanho de arquivo
 * @param {File} file - Arquivo a validar
 * @param {number} maxSizeMB - Tamanho máximo em MB
 * @param {string} lang - Idioma
 * @returns {object} - { valid: boolean, error: string }
 */
export function validateFileSize(file, maxSizeMB, lang = 'pt-BR') {
  if (!file) {
    return {
      valid: false,
      error: t(lang, 'validation.required')
    }
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: t(lang, 'validation.fileTooLarge').replace('{size}', maxSizeMB)
    }
  }

  return { valid: true, error: null }
}

/**
 * Validar tipo de arquivo
 * @param {File} file - Arquivo a validar
 * @param {string[]} allowedTypes - Tipos MIME permitidos
 * @param {string} lang - Idioma
 * @returns {object} - { valid: boolean, error: string }
 */
export function validateFileType(file, allowedTypes, lang = 'pt-BR') {
  if (!file) {
    return {
      valid: false,
      error: t(lang, 'validation.required')
    }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: t(lang, 'validation.invalidFileType')
    }
  }

  return { valid: true, error: null }
}

/**
 * Validar upload de arquivo completo
 * @param {File} file - Arquivo a validar
 * @param {object} options - { maxSizeMB, allowedTypes }
 * @param {string} lang - Idioma
 * @returns {object} - { valid: boolean, error: string }
 */
export function validateFileUpload(file, options, lang = 'pt-BR') {
  // Validar tamanho
  const sizeValidation = validateFileSize(file, options.maxSizeMB, lang)
  if (!sizeValidation.valid) {
    return sizeValidation
  }

  // Validar tipo
  const typeValidation = validateFileType(file, options.allowedTypes, lang)
  if (!typeValidation.valid) {
    return typeValidation
  }

  return { valid: true, error: null }
}

export default {
  validateFullName,
  validateEmail,
  validatePhone,
  validateMessage,
  validateNationalInsuranceNumber,
  validateUTRNumber,
  validateVATNumber,
  validateSortCode,
  validateAccountNumber,
  validateUKPostcode,
  validateBirthDate,
  validateFileSize,
  validateFileType,
  validateFileUpload,
  formatPhone,
  cleanInput,
  showInputError,
  clearInputError,
  validateContactForm
}
