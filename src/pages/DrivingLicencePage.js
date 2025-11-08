/**
 * DrivingLicencePage - Step 9
 * Página de upload da carteira de motorista (frente e verso)
 */

import { t } from '../utils/translations.js'
import { createFileUpload, getUploadedFile } from '../components/FileUpload.js'
import { saveFormStep, uploadFile } from '../services/supabaseService.js'
import { VALIDATION, STORAGE_CONFIG } from '../config/constants.js'

/**
 * Renderizar página de carteira de motorista
 * @param {HTMLElement} container - Container onde será renderizado
 * @param {object} options - Opções { lang, onNext, onBack, formData }
 */
export function renderDrivingLicencePage(container, options = {}) {
  const {
    lang = 'pt-BR',
    onNext = null,
    onBack = null,
    formData = {}
  } = options

  let frontFile = null
  let backFile = null

  container.innerHTML = `
    <div class="form-page driving-licence-page">
      <div class="form-header">
        <h2 class="form-title">${t(lang, 'drivingLicence.title')}</h2>
        <p class="form-subtitle">${t(lang, 'drivingLicence.subtitle')}</p>
      </div>

      <div class="form-content">
        <!-- Upload Frente -->
        <div class="form-section">
          <h3 class="form-section-title">${t(lang, 'drivingLicence.frontSide')}</h3>
          <div id="licenceFrontContainer"></div>
        </div>

        <!-- Upload Verso -->
        <div class="form-section">
          <h3 class="form-section-title">${t(lang, 'drivingLicence.backSide')}</h3>
          <div id="licenceBackContainer"></div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" id="backBtn">
            ${t(lang, 'drivingLicence.backButton')}
          </button>
          <button type="button" class="btn btn-primary" id="continueBtn" disabled>
            ${t(lang, 'drivingLicence.continueButton')}
          </button>
        </div>
      </div>
    </div>
  `

  const frontContainer = container.querySelector('#licenceFrontContainer')
  const backContainer = container.querySelector('#licenceBackContainer')
  const backBtn = container.querySelector('#backBtn')
  const continueBtn = container.querySelector('#continueBtn')

  // Verificar se pode continuar
  const checkCanContinue = () => {
    const hasFront = frontFile || formData.drivingLicenceFrontUrl
    const hasBack = backFile || formData.drivingLicenceBackUrl

    continueBtn.disabled = !(hasFront && hasBack)
  }

  // Upload Frente
  const frontUpload = createFileUpload({
    id: 'licenceFront',
    lang,
    onFileSelect: (file) => {
      frontFile = file
      checkCanContinue()
    },
    maxSizeMB: VALIDATION.MAX_FILE_SIZE_MB,
    allowedTypes: VALIDATION.ALLOWED_DOCUMENT_TYPES,
    accept: 'image/*,application/pdf',
    showPreview: true
  })

  frontContainer.appendChild(frontUpload)

  // Upload Verso
  const backUpload = createFileUpload({
    id: 'licenceBack',
    lang,
    onFileSelect: (file) => {
      backFile = file
      checkCanContinue()
    },
    maxSizeMB: VALIDATION.MAX_FILE_SIZE_MB,
    allowedTypes: VALIDATION.ALLOWED_DOCUMENT_TYPES,
    accept: 'image/*,application/pdf',
    showPreview: true
  })

  backContainer.appendChild(backUpload)

  // Verificar estado inicial
  checkCanContinue()

  // Voltar
  backBtn.addEventListener('click', () => {
    if (onBack) onBack()
  })

  // Continuar
  continueBtn.addEventListener('click', async () => {
    continueBtn.disabled = true
    continueBtn.textContent = t(lang, 'system.saving')

    try {
      let frontUrl = formData.drivingLicenceFrontUrl
      let backUrl = formData.drivingLicenceBackUrl

      // Upload frente se houver novo arquivo
      if (frontFile) {
        const frontPath = `${STORAGE_CONFIG.PATHS.DRIVING_LICENCES}/${formData.email}_front_${Date.now()}.${frontFile.name.split('.').pop()}`
        const frontResult = await uploadFile(frontFile, frontPath)

        if (!frontResult.success) {
          throw new Error(frontResult.error || 'Front upload failed')
        }

        frontUrl = frontResult.url
      }

      // Upload verso se houver novo arquivo
      if (backFile) {
        const backPath = `${STORAGE_CONFIG.PATHS.DRIVING_LICENCES}/${formData.email}_back_${Date.now()}.${backFile.name.split('.').pop()}`
        const backResult = await uploadFile(backFile, backPath)

        if (!backResult.success) {
          throw new Error(backResult.error || 'Back upload failed')
        }

        backUrl = backResult.url
      }

      // Salvar URLs no banco
      await saveFormStep(formData.email, 8, {
        drivingLicenceFrontUrl: frontUrl,
        drivingLicenceBackUrl: backUrl
      })

      if (onNext) {
        onNext({
          drivingLicenceFrontUrl: frontUrl,
          drivingLicenceBackUrl: backUrl
        })
      }
    } catch (error) {
      console.error('Error uploading driving licence:', error)
      alert(t(lang, 'validation.uploadFailed'))
      continueBtn.disabled = false
      continueBtn.textContent = t(lang, 'drivingLicence.continueButton')
    }
  })
}

export default {
  renderDrivingLicencePage
}
