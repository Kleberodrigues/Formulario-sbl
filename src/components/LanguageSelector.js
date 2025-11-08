/**
 * Componente LanguageSelector
 * Seletor de idioma com 4 opções: Português, English, Български, Română
 */

import { LANGUAGE_OPTIONS, DEFAULT_LANGUAGE } from '../config/constants.js'
import { getSavedLanguage, saveLanguage } from '../utils/translations.js'

/**
 * Criar seletor de idioma
 * @param {function} onLanguageChange - Callback quando idioma mudar
 * @returns {HTMLElement}
 */
export function createLanguageSelector(onLanguageChange) {
  const container = document.createElement('div')
  container.className = 'language-selector'

  const currentLanguage = getSavedLanguage()

  // Container dos botões de idioma
  const buttonsContainer = document.createElement('div')
  buttonsContainer.className = 'language-buttons'

  LANGUAGE_OPTIONS.forEach(lang => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'language-button'
    button.dataset.lang = lang.code

    // Marcar idioma ativo
    if (lang.code === currentLanguage) {
      button.classList.add('active')
    }

    button.innerHTML = `
      <span class="language-flag">${lang.flag}</span>
      <span class="language-label">${lang.label}</span>
    `

    // Event listener para mudança de idioma
    button.addEventListener('click', () => {
      // Remover active de todos
      buttonsContainer.querySelectorAll('.language-button').forEach(btn => {
        btn.classList.remove('active')
      })

      // Adicionar active ao clicado
      button.classList.add('active')

      // Salvar idioma
      saveLanguage(lang.code)

      // Callback
      if (onLanguageChange) {
        onLanguageChange(lang.code)
      }
    })

    buttonsContainer.appendChild(button)
  })

  container.appendChild(buttonsContainer)

  return container
}

/**
 * Criar dropdown de idioma (versão compacta)
 * @param {function} onLanguageChange - Callback quando idioma mudar
 * @returns {HTMLElement}
 */
export function createLanguageDropdown(onLanguageChange) {
  const container = document.createElement('div')
  container.className = 'language-dropdown'

  const currentLanguage = getSavedLanguage()
  const currentLangOption = LANGUAGE_OPTIONS.find(l => l.code === currentLanguage) || LANGUAGE_OPTIONS[0]

  const select = document.createElement('select')
  select.className = 'language-select'
  select.value = currentLanguage

  LANGUAGE_OPTIONS.forEach(lang => {
    const option = document.createElement('option')
    option.value = lang.code
    option.textContent = `${lang.flag} ${lang.label}`

    if (lang.code === currentLanguage) {
      option.selected = true
    }

    select.appendChild(option)
  })

  select.addEventListener('change', (e) => {
    const selectedLang = e.target.value
    saveLanguage(selectedLang)

    if (onLanguageChange) {
      onLanguageChange(selectedLang)
    }
  })

  container.appendChild(select)

  return container
}

/**
 * Obter idioma atual
 * @returns {string}
 */
export function getCurrentLanguage() {
  return getSavedLanguage()
}

export default {
  createLanguageSelector,
  createLanguageDropdown,
  getCurrentLanguage
}
