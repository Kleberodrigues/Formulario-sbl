/**
 * Main.js - Ponto de Entrada da Aplicação
 * SBL Onboarding Form
 */

import { initSupabase, isSupabaseConfigured } from './config/supabase.js'
import { STEPS } from './config/constants.js'
import { createHeader } from './components/Header.js'
import { createProgressBar, updateProgressBar } from './components/ProgressBar.js'
import { createWelcomePage } from './pages/WelcomePage.js'
import { renderDepotPage } from './pages/DepotPage.js'
import { createContactPage } from './pages/ContactPage.js'
import { renderPersonalInfoPage } from './pages/PersonalInfoPage.js'
import { renderAddressHistoryPage } from './pages/AddressHistoryPage.js'
import { renderAdditionalInfoPage } from './pages/AdditionalInfoPage.js'
import { renderProfilePhotoPage } from './pages/ProfilePhotoPage.js'
import { renderDrivingLicencePage } from './pages/DrivingLicencePage.js'
import { renderBankDetailsPage } from './pages/BankDetailsPage.js'
import { renderDocumentGuidePage } from './pages/DocumentGuidePage.js'
import { renderDocumentsUploadPage } from './pages/DocumentsUploadPage.js'
import { createCompletionPage } from './pages/CompletionPage.js'

/**
 * Estado global da aplicação
 */
const appState = {
  currentStep: STEPS.WELCOME,
  formData: {},
  sessionId: null
}

/**
 * Inicializar aplicação
 */
async function initApp() {
  console.log('🚀 Inicializando SBL Onboarding Form...')

  // Inicializar Supabase
  const supabase = initSupabase()

  if (!isSupabaseConfigured()) {
    console.warn('⚠️ Supabase não configurado. Configure as variáveis de ambiente.')
    console.warn('VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY necessários.')
  }

  // Carregar dados salvos (se houver)
  loadSavedProgress()

  // Renderizar aplicação
  renderApp()
}

/**
 * Carregar progresso salvo do localStorage
 */
function loadSavedProgress() {
  try {
    const savedData = localStorage.getItem('sbl_form_data')

    if (savedData) {
      const data = JSON.parse(savedData)
      appState.currentStep = data.currentStep || STEPS.WELCOME
      appState.formData = data
      appState.sessionId = data.sessionId

      console.log('📂 Progresso carregado:', appState)
    }
  } catch (error) {
    console.error('❌ Erro ao carregar progresso:', error)
  }
}

/**
 * Renderizar aplicação
 */
function renderApp() {
  const headerContainer = document.getElementById('header-container')
  const progressContainer = document.getElementById('progress-container')
  const stepContainer = document.getElementById('step-container')

  // Renderizar Header
  const header = createHeader()
  headerContainer.innerHTML = ''
  headerContainer.appendChild(header)

  // Renderizar Progress Bar
  const progressBar = createProgressBar(appState.currentStep)
  progressContainer.innerHTML = ''
  progressContainer.appendChild(progressBar)

  // Renderizar Step atual
  renderCurrentStep(stepContainer)
}

/**
 * Renderizar step atual
 * @param {HTMLElement} container - Container onde renderizar
 */
function renderCurrentStep(container) {
  container.innerHTML = ''

  switch (appState.currentStep) {
    case STEPS.WELCOME:
      renderWelcomeStep(container)
      break

    case STEPS.DEPOT:
      renderDepotStep(container)
      break

    case STEPS.CONTACT:
      renderContactStep(container)
      break

    case STEPS.PERSONAL_INFO:
      renderPersonalInfoStep(container)
      break

    case STEPS.ADDRESS_HISTORY:
      renderAddressHistoryStep(container)
      break

    case STEPS.ADDITIONAL_INFO:
      renderAdditionalInfoStep(container)
      break

    case STEPS.PROFILE_PHOTO:
      renderProfilePhotoStep(container)
      break

    case STEPS.DRIVING_LICENCE:
      renderDrivingLicenceStep(container)
      break

    case STEPS.BANK_DETAILS:
      renderBankDetailsStep(container)
      break

    case STEPS.DOCUMENT_GUIDE:
      renderDocumentGuideStep(container)
      break

    case STEPS.DOCUMENTS_UPLOAD:
      renderDocumentsUploadStep(container)
      break

    default:
      console.error('Step inválido:', appState.currentStep)
      renderErrorStep(container)
      break
  }

  // Adicionar animação
  container.firstChild?.classList.add('fade-in')
}

/**
 * Renderizar Step de Boas-vindas
 * @param {HTMLElement} container - Container
 */
function renderWelcomeStep(container) {
  const welcomePage = createWelcomePage((data) => {
    console.log('✅ Step 1 concluído:', data)

    // Atualizar estado
    appState.formData.language = data.language
    appState.sessionId = data.sessionId

    // Avançar para próximo step
    goToNextStep()
  })

  container.appendChild(welcomePage)
}

/**
 * Renderizar Step de Contato
 * @param {HTMLElement} container - Container
 */
function renderContactStep(container) {
  const contactPage = createContactPage(
    appState.formData, // Dados iniciais
    (data) => {
      console.log('✅ Step 2 concluído:', data)

      // Atualizar estado
      appState.formData.fullName = data.fullName
      appState.formData.email = data.email
      appState.formData.phone = data.phone

      // Avançar para próximo step
      goToNextStep()
    },
    () => {
      // Voltar para step anterior
      goToPreviousStep()
    }
  )

  container.appendChild(contactPage)
}

/**
 * Renderizar Step de Depósito
 * @param {HTMLElement} container - Container
 */
function renderDepotStep(container) {
  renderDepotPage(container, {
    lang: appState.formData.language || 'pt-BR',
    onNext: (data) => {
      console.log('✅ Step 2 concluído:', data)

      // Atualizar estado
      appState.formData.selectedDepot = data.selectedDepot
      appState.formData.depotAddress = data.depotAddress

      goToNextStep()
    },
    onBack: () => {
      goToPreviousStep()
    },
    formData: appState.formData
  })
}

/**
 * Renderizar Step de Informações Pessoais
 * @param {HTMLElement} container - Container
 */
function renderPersonalInfoStep(container) {
  renderPersonalInfoPage(container, {
    lang: appState.formData.language || 'pt-BR',
    onNext: (data) => {
      console.log('✅ Step 4 concluído:', data)

      // Atualizar estado
      Object.assign(appState.formData, data)

      goToNextStep()
    },
    onBack: () => {
      goToPreviousStep()
    },
    formData: appState.formData
  })
}

/**
 * Renderizar Step de Histórico de Endereços
 * @param {HTMLElement} container - Container
 */
function renderAddressHistoryStep(container) {
  renderAddressHistoryPage(container, {
    lang: appState.formData.language || 'pt-BR',
    onNext: (data) => {
      console.log('✅ Step 5 concluído:', data)

      // Atualizar estado
      appState.formData.addressHistory = data.addressHistory

      goToNextStep()
    },
    onBack: () => {
      goToPreviousStep()
    },
    formData: appState.formData
  })
}

/**
 * Renderizar Step de Informações Adicionais
 * @param {HTMLElement} container - Container
 */
function renderAdditionalInfoStep(container) {
  renderAdditionalInfoPage(container, {
    lang: appState.formData.language || 'pt-BR',
    onNext: (data) => {
      console.log('✅ Step 6 concluído:', data)

      // Atualizar estado
      Object.assign(appState.formData, data)

      goToNextStep()
    },
    onBack: () => {
      goToPreviousStep()
    },
    formData: appState.formData
  })
}

/**
 * Renderizar Step de Foto de Perfil
 * @param {HTMLElement} container - Container
 */
function renderProfilePhotoStep(container) {
  renderProfilePhotoPage(container, {
    lang: appState.formData.language || 'pt-BR',
    onNext: (data) => {
      console.log('✅ Step 7 concluído:', data)

      // Atualizar estado
      appState.formData.profilePhotoUrl = data.profilePhotoUrl

      goToNextStep()
    },
    onBack: () => {
      goToPreviousStep()
    },
    formData: appState.formData
  })
}

/**
 * Renderizar Step de Carteira de Motorista
 * @param {HTMLElement} container - Container
 */
function renderDrivingLicenceStep(container) {
  renderDrivingLicencePage(container, {
    lang: appState.formData.language || 'pt-BR',
    onNext: (data) => {
      console.log('✅ Step 8 concluído:', data)

      // Atualizar estado
      appState.formData.drivingLicenceFrontUrl = data.drivingLicenceFrontUrl
      appState.formData.drivingLicenceBackUrl = data.drivingLicenceBackUrl

      goToNextStep()
    },
    onBack: () => {
      goToPreviousStep()
    },
    formData: appState.formData
  })
}

/**
 * Renderizar Step de Dados Bancários
 * @param {HTMLElement} container - Container
 */
function renderBankDetailsStep(container) {
  renderBankDetailsPage(container, {
    lang: appState.formData.language || 'pt-BR',
    onNext: (data) => {
      console.log('✅ Step 9 concluído:', data)

      // Atualizar estado
      appState.formData.bankAccountNumber = data.bankAccountNumber
      appState.formData.bankSortCode = data.bankSortCode

      goToNextStep()
    },
    onBack: () => {
      goToPreviousStep()
    },
    formData: appState.formData
  })
}

/**
 * Renderizar Step de Guia de Documentos
 * @param {HTMLElement} container - Container
 */
function renderDocumentGuideStep(container) {
  renderDocumentGuidePage(container, {
    lang: appState.formData.language || 'pt-BR',
    onNext: () => {
      console.log('✅ Step 10 concluído')
      goToNextStep()
    },
    onBack: () => {
      goToPreviousStep()
    },
    formData: appState.formData
  })
}

/**
 * Renderizar Step de Upload de Documentos
 * @param {HTMLElement} container - Container
 */
function renderDocumentsUploadStep(container) {
  renderDocumentsUploadPage(container, {
    lang: appState.formData.language || 'pt-BR',
    onNext: (data) => {
      console.log('✅ Step 11 concluído - Formulário completo!', data)

      // Atualizar estado
      appState.formData.documents = data.documents
      appState.formData.isCompleted = true
      appState.formData.completedAt = new Date().toISOString()

      // Mostrar mensagem de conclusão
      renderCompletionMessage(container)
    },
    onBack: () => {
      goToPreviousStep()
    },
    formData: appState.formData
  })
}

/**
 * Renderizar mensagem de conclusão
 * @param {HTMLElement} container - Container
 */
function renderCompletionMessage(container) {
  const completionPage = createCompletionPage(appState.formData)
  container.innerHTML = ''
  container.appendChild(completionPage)

  // Esconder barra de progresso na página de conclusão
  const progressContainer = document.getElementById('progress-container')
  if (progressContainer) {
    progressContainer.style.display = 'none'
  }

  // Limpar dados salvos localmente (já está no Supabase)
  localStorage.removeItem('sbl_form_data')
  localStorage.removeItem('sbl_abandonment')
}

/**
 * Renderizar página de erro
 * @param {HTMLElement} container - Container
 */
function renderErrorStep(container) {
  container.innerHTML = `
    <div class="form-page error-page">
      <div class="form-header">
        <h2 class="form-title">Erro</h2>
        <p class="form-subtitle">Ocorreu um erro ao carregar o formulário.</p>
      </div>
      <div class="form-content">
        <p>Por favor, recarregue a página ou entre em contato com o suporte.</p>
        <button type="button" class="btn btn-primary" onclick="location.reload()">
          Recarregar Página
        </button>
      </div>
    </div>
  `
}

/**
 * Avançar para próximo step
 */
function goToNextStep() {
  if (appState.currentStep < STEPS.DOCUMENTS_UPLOAD) {
    appState.currentStep++
    updateProgressAndRender()
  }
}

/**
 * Voltar para step anterior
 */
function goToPreviousStep() {
  if (appState.currentStep > STEPS.WELCOME) {
    appState.currentStep--
    updateProgressAndRender()
  }
}

/**
 * Atualizar progress bar e renderizar step
 */
function updateProgressAndRender() {
  // Atualizar progress bar
  const progressContainer = document.getElementById('progress-container')
  const progressBar = progressContainer.querySelector('.progress-bar-container')

  if (progressBar) {
    updateProgressBar(progressBar, appState.currentStep)
  }

  // Renderizar novo step
  const stepContainer = document.getElementById('step-container')
  renderCurrentStep(stepContainer)
}

/**
 * Detectar abandono de formulário
 */
function setupAbandonmentTracking() {
  // Detectar quando usuário sai da página
  window.addEventListener('beforeunload', (e) => {
    // Só rastrear se usuário começou a preencher e não completou
    if (appState.currentStep > STEPS.WELCOME && appState.currentStep <= STEPS.DOCUMENTS_UPLOAD && !appState.formData.isCompleted) {
      console.log('⚠️ Usuário abandonando formulário no step:', appState.currentStep)

      // Salvar estado de abandono
      const abandonmentData = {
        step: appState.currentStep,
        timestamp: new Date().toISOString(),
        formData: appState.formData
      }

      localStorage.setItem('sbl_abandonment', JSON.stringify(abandonmentData))

      // Nota: O navegador pode bloquear chamadas assíncronas aqui
      // O tracking real será feito por um service worker ou beacon API
    }
  })
}

/**
 * Iniciar aplicação quando DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', () => {
  initApp()
  setupAbandonmentTracking()

  console.log('✅ SBL Onboarding Form inicializado com sucesso!')
})

// Exportar para debugging
window.SBL = {
  appState,
  goToNextStep,
  goToPreviousStep,
  renderApp
}
