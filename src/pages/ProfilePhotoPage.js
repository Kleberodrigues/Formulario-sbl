/**
 * ProfilePhotoPage - Step 8
 * Página de foto de perfil (selfie)
 */

import { t } from '../utils/translations.js'
import { createFileUpload, getUploadedFile } from '../components/FileUpload.js'
import { saveFormStep } from '../services/supabaseService.js'
import { uploadFile } from '../services/supabaseService.js'
import { VALIDATION, STORAGE_CONFIG } from '../config/constants.js'

/**
 * Renderizar página de foto de perfil
 * @param {HTMLElement} container - Container onde será renderizado
 * @param {object} options - Opções { lang, onNext, onBack, formData }
 */
export function renderProfilePhotoPage(container, options = {}) {
  const {
    lang = 'pt-BR',
    onNext = null,
    onBack = null,
    formData = {}
  } = options

  let selectedFile = null

  container.innerHTML = `
    <div class="form-page profile-photo-page">
      <div class="form-header">
        <h2 class="form-title">${t(lang, 'profilePhoto.title')}</h2>
        <p class="form-subtitle">${t(lang, 'profilePhoto.subtitle')}</p>
      </div>

      <div class="form-content">
        <div id="photoUploadContainer"></div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" id="backBtn">
            ${t(lang, 'profilePhoto.backButton')}
          </button>
          <button type="button" class="btn btn-primary" id="continueBtn">
            ${t(lang, 'profilePhoto.continueButton')}
          </button>
        </div>
      </div>
    </div>
  `

  const photoContainer = container.querySelector('#photoUploadContainer')
  const backBtn = container.querySelector('#backBtn')
  const continueBtn = container.querySelector('#continueBtn')

  // Criar componente de upload
  const upload = createFileUpload({
    id: 'profilePhoto',
    lang,
    onFileSelect: (file) => {
      selectedFile = file
      continueBtn.disabled = !file
    },
    maxSizeMB: VALIDATION.MAX_PHOTO_SIZE_MB,
    allowedTypes: VALIDATION.ALLOWED_IMAGE_TYPES,
    accept: 'image/*',
    showPreview: true
  })

  photoContainer.appendChild(upload)

  // Se já tem foto salva, mostrar preview
  if (formData.profilePhotoUrl) {
    // TODO: Carregar preview da foto existente
    continueBtn.disabled = false
  }

  // Voltar
  backBtn.addEventListener('click', () => {
    if (onBack) onBack()
  })

  // Continuar
  continueBtn.addEventListener('click', async () => {
    // Validar que tem foto
    const file = getUploadedFile('profilePhoto')

    if (!file && !formData.profilePhotoUrl) {
      alert(t(lang, 'validation.required'))
      return
    }

    // Se não mudou a foto, apenas continuar
    if (!file && formData.profilePhotoUrl) {
      if (onNext) {
        onNext({ profilePhotoUrl: formData.profilePhotoUrl })
      }
      return
    }

    // Fazer upload
    continueBtn.disabled = true
    continueBtn.textContent = t(lang, 'system.saving')

    try {
      // Upload para Supabase Storage
      const filePath = `${STORAGE_CONFIG.PATHS.PROFILE_PHOTOS}/${formData.email}_${Date.now()}.${file.name.split('.').pop()}`

      const uploadResult = await uploadFile(file, filePath)

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed')
      }

      const photoUrl = uploadResult.url

      // Salvar URL no banco
      await saveFormStep(formData.email, 7, {
        profilePhotoUrl: photoUrl
      })

      if (onNext) {
        onNext({ profilePhotoUrl: photoUrl })
      }
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert(t(lang, 'validation.uploadFailed'))
      continueBtn.disabled = false
      continueBtn.textContent = t(lang, 'profilePhoto.continueButton')
    }
  })
}

export default {
  renderProfilePhotoPage
}
