/**
 * WelcomePage - Step 1
 * Página de boas-vindas com seleção de idioma
 */

import { createFormStep, createStepContent, createStepButtons, setButtonLoading } from '../components/FormStep.js'
import { createLanguageSelector } from '../components/LanguageSelector.js'
import { STEPS } from '../config/constants.js'
import { t, getSavedLanguage } from '../utils/translations.js'
import { saveFormStep } from '../services/supabaseService.js'

/**
 * Criar página de boas-vindas (Step 1)
 * @param {function} onContinue - Callback ao clicar em Continuar
 * @returns {HTMLElement}
 */
export function createWelcomePage(onContinue) {
  const container = createFormStep('welcome', STEPS.WELCOME)

  let currentLanguage = getSavedLanguage()

  // Função para atualizar textos quando idioma mudar
  function updateTexts() {
    const lang = getSavedLanguage()

    const headerTitle = container.querySelector('.welcome-header-title')
    if (headerTitle) headerTitle.textContent = t(lang, 'welcome.headerTitle')

    const title = container.querySelector('.welcome-main-title')
    if (title) title.textContent = t(lang, 'welcome.title')

    const description = container.querySelector('.welcome-description')
    if (description) description.textContent = t(lang, 'welcome.description')

    const privacyText = container.querySelector('.privacy-text')
    if (privacyText) privacyText.textContent = t(lang, 'welcome.privacyText')

    const privacyLink = container.querySelector('.privacy-link')
    if (privacyLink) privacyLink.textContent = t(lang, 'welcome.privacyLink')

    const languageLabel = container.querySelector('.language-dropdown-label')
    if (languageLabel) languageLabel.textContent = t(lang, 'welcome.preferredLanguage')

    const continueButton = container.querySelector('.btn-continue')
    if (continueButton && !continueButton.classList.contains('loading')) {
      continueButton.textContent = t(lang, 'welcome.continueButton')
    }
  }

  // Conteúdo personalizado (não usar createStepContent padrão)
  const content = document.createElement('div')
  content.className = 'welcome-content'

  content.innerHTML = `
    <div class="welcome-header">
      <p class="welcome-header-title">${t(currentLanguage, 'welcome.headerTitle')}</p>
      <h1 class="welcome-main-title">${t(currentLanguage, 'welcome.title')}</h1>
    </div>

    <p class="welcome-description">${t(currentLanguage, 'welcome.description')}</p>

    <div class="welcome-privacy">
      <p class="privacy-text-line">
        <span class="privacy-text">${t(currentLanguage, 'welcome.privacyText')}</span>
        <a href="#" class="privacy-link">${t(currentLanguage, 'welcome.privacyLink')}</a>.
      </p>
    </div>
  `

  container.appendChild(content)

  // Dropdown de idioma
  const languageDropdownContainer = document.createElement('div')
  languageDropdownContainer.className = 'language-dropdown-container'

  const languageDropdown = document.createElement('select')
  languageDropdown.className = 'language-dropdown-select'
  languageDropdown.id = 'language-select'

  // Opções de idioma
  const languages = [
    { value: 'pt-BR', label: 'Português' },
    { value: 'en', label: 'English' },
    { value: 'bg', label: 'Български' },
    { value: 'ro', label: 'Română' }
  ]

  languages.forEach(lang => {
    const option = document.createElement('option')
    option.value = lang.value
    option.textContent = lang.label
    if (lang.value === currentLanguage) {
      option.selected = true
    }
    languageDropdown.appendChild(option)
  })

  // Event listener para mudança de idioma
  languageDropdown.addEventListener('change', (e) => {
    currentLanguage = e.target.value
    localStorage.setItem('language', currentLanguage)
    updateTexts()
  })

  languageDropdownContainer.innerHTML = `
    <label for="language-select" class="language-dropdown-label">${t(currentLanguage, 'welcome.preferredLanguage')}</label>
  `
  languageDropdownContainer.appendChild(languageDropdown)

  container.appendChild(languageDropdownContainer)

  // Botões de navegação
  const buttons = createStepButtons({
    showBack: false,
    continueText: t(currentLanguage, 'welcome.continueButton'),
    onContinue: async (e) => {
      e.preventDefault()

      const continueButton = container.querySelector('.btn-continue')

      try {
        // Mostrar loading
        setButtonLoading(
          continueButton,
          true,
          t(currentLanguage, 'welcome.loadingButton')
        )

        // Obter email temporário ou gerar um ID temporário
        // (no Step 1 não temos email ainda, então usamos um ID de sessão)
        const sessionId = getOrCreateSessionId()

        // Salvar idioma selecionado no Supabase
        // Nota: Como não temos email ainda, vamos criar um registro temporário
        // que será atualizado com o email no Step 2
        await saveWelcomeStep(sessionId, currentLanguage)

        // Callback para próximo step
        if (onContinue) {
          onContinue({ language: currentLanguage, sessionId })
        }
      } catch (error) {
        console.error('Erro ao salvar idioma:', error)
        alert(t(currentLanguage, 'system.networkError'))
      } finally {
        // Remover loading
        setButtonLoading(continueButton, false)
      }
    }
  })

  container.appendChild(buttons)

  return container
}

/**
 * Obter ou criar ID de sessão
 * @returns {string}
 */
function getOrCreateSessionId() {
  let sessionId = localStorage.getItem('sbl_session_id')

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('sbl_session_id', sessionId)
  }

  return sessionId
}

/**
 * Salvar dados do step de boas-vindas
 * @param {string} sessionId - ID da sessão
 * @param {string} language - Idioma selecionado
 */
async function saveWelcomeStep(sessionId, language) {
  try {
    // Salvar no localStorage temporariamente
    const formData = {
      sessionId,
      language,
      currentStep: STEPS.WELCOME,
      completedSteps: [STEPS.WELCOME],
      timestamp: new Date().toISOString()
    }

    localStorage.setItem('sbl_form_data', JSON.stringify(formData))

    // Nota: No Step 2 faremos a primeira gravação real no Supabase com email
    console.log('✅ Idioma salvo localmente:', language)

    return true
  } catch (error) {
    console.error('❌ Erro ao salvar welcome step:', error)
    throw error
  }
}

/**
 * Renderizar WelcomePage em um container
 * @param {HTMLElement} container - Container
 * @param {function} onContinue - Callback ao continuar
 */
export function renderWelcomePage(container, onContinue) {
  container.innerHTML = ''
  const welcomePage = createWelcomePage(onContinue)
  container.appendChild(welcomePage)
}

export default {
  createWelcomePage,
  renderWelcomePage
}
