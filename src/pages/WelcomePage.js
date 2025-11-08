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

    const title = container.querySelector('.step-title')
    if (title) title.textContent = t(lang, 'welcome.title')

    const subtitle = container.querySelector('.step-subtitle')
    if (subtitle) subtitle.textContent = t(lang, 'welcome.subtitle')

    const description = container.querySelector('.welcome-description')
    if (description) description.textContent = t(lang, 'welcome.description')

    const languageLabel = container.querySelector('.language-label-text')
    if (languageLabel) languageLabel.textContent = t(lang, 'welcome.selectLanguage')

    const continueButton = container.querySelector('.btn-continue')
    if (continueButton && !continueButton.classList.contains('loading')) {
      continueButton.textContent = t(lang, 'welcome.continueButton')
    }
  }

  // Conteúdo do step
  const content = createStepContent(
    t(currentLanguage, 'welcome.title'),
    t(currentLanguage, 'welcome.subtitle')
  )

  // Descrição adicional
  const description = document.createElement('p')
  description.className = 'welcome-description'
  description.textContent = t(currentLanguage, 'welcome.description')
  content.appendChild(description)

  container.appendChild(content)

  // Label do seletor de idioma
  const languageLabel = document.createElement('div')
  languageLabel.className = 'language-label'
  languageLabel.innerHTML = `
    <p class="language-label-text">${t(currentLanguage, 'welcome.selectLanguage')}</p>
  `
  container.appendChild(languageLabel)

  // Seletor de idioma
  const languageSelector = createLanguageSelector((newLanguage) => {
    currentLanguage = newLanguage
    updateTexts()
  })

  container.appendChild(languageSelector)

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
