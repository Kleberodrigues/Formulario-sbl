/**
 * DocumentsUploadPage - Step 12
 * Página de upload de documentos (5 tipos)
 */

import { t } from '../utils/translations.js'
import {
  DOCUMENT_STATUS,
  createDocumentCard,
  updateDocumentStatus
} from '../components/DocumentStatus.js'
import { createFileUpload } from '../components/FileUpload.js'
import { uploadCandidateDocument, updateCandidateFields } from '../services/supabaseService.js'
import { sendCompletionNotification } from '../services/automationService.js'
import { DOCUMENT_TYPES, DOCUMENT_LABELS, VALIDATION, STORAGE_CONFIG } from '../config/constants.js'

/**
 * Renderizar página de upload de documentos
 * @param {HTMLElement} container - Container onde será renderizado
 * @param {object} options - Opções { lang, onNext, onBack, formData }
 */
export function renderDocumentsUploadPage(container, options = {}) {
  const {
    lang = 'pt-BR',
    onNext = null,
    onBack = null,
    formData = {}
  } = options

  // Estado dos documentos
  const documentsState = formData.documents || {}

  container.innerHTML = `
    <div class="form-page documents-upload-page">
      <div class="form-header">
        <h2 class="form-title">${t(lang, 'documentsUpload.title')}</h2>
        <p class="form-subtitle">${t(lang, 'documentsUpload.subtitle')}</p>
      </div>

      <div class="form-content">
        <div id="documentsContainer" class="documents-grid"></div>

        <!-- Upload Modal (Hidden) -->
        <div id="uploadModal" class="modal" style="display: none;">
          <div class="modal-content">
            <div class="modal-header">
              <h3 id="modalTitle" class="modal-title"></h3>
              <button type="button" class="modal-close" id="closeModal">✕</button>
            </div>
            <div class="modal-body">
              <div id="uploadContainer"></div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="cancelUpload">
                ${t(lang, 'addressHistory.cancelButton')}
              </button>
              <button type="button" class="btn btn-primary" id="confirmUpload" disabled>
                ${t(lang, 'documentsUpload.uploadButton')}
              </button>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" id="backBtn">
            ${t(lang, 'documentsUpload.backButton')}
          </button>
          <button type="button" class="btn btn-primary" id="continueBtn" disabled>
            ${t(lang, 'documentsUpload.continueButton')}
          </button>
        </div>
      </div>
    </div>
  `

  const documentsContainer = container.querySelector('#documentsContainer')
  const uploadModal = container.querySelector('#uploadModal')
  const modalTitle = container.querySelector('#modalTitle')
  const uploadContainer = container.querySelector('#uploadContainer')
  const closeModalBtn = container.querySelector('#closeModal')
  const cancelUploadBtn = container.querySelector('#cancelUpload')
  const confirmUploadBtn = container.querySelector('#confirmUpload')
  const backBtn = container.querySelector('#backBtn')
  const continueBtn = container.querySelector('#continueBtn')

  let currentDocType = null
  let currentFile = null

  // Verificar se pode continuar (todos obrigatórios uploadados)
  const checkCanContinue = () => {
    const required = [
      DOCUMENT_TYPES.RIGHT_TO_WORK,
      DOCUMENT_TYPES.PROOF_OF_ADDRESS,
      DOCUMENT_TYPES.NATIONAL_INSURANCE,
      DOCUMENT_TYPES.BANK_STATEMENT
    ]

    const allUploaded = required.every(type =>
      documentsState[type] && documentsState[type].status === DOCUMENT_STATUS.UPLOADED
    )

    continueBtn.disabled = !allUploaded
  }

  // Abrir modal de upload
  const openUploadModal = (docType, docLabel) => {
    currentDocType = docType
    currentFile = null

    modalTitle.textContent = docLabel
    uploadModal.style.display = 'flex'
    uploadContainer.innerHTML = ''

    // Criar upload component
    const upload = createFileUpload({
      id: `doc_${docType}`,
      lang,
      onFileSelect: (file) => {
        currentFile = file
        confirmUploadBtn.disabled = !file
      },
      maxSizeMB: VALIDATION.MAX_FILE_SIZE_MB,
      allowedTypes: VALIDATION.ALLOWED_DOCUMENT_TYPES,
      accept: 'image/*,application/pdf',
      showPreview: true
    })

    uploadContainer.appendChild(upload)
    confirmUploadBtn.disabled = true
  }

  // Fechar modal
  const closeModal = () => {
    uploadModal.style.display = 'none'
    currentDocType = null
    currentFile = null
    uploadContainer.innerHTML = ''
  }

  // Fazer upload do documento
  const handleUpload = async () => {
    if (!currentFile || !currentDocType) return

    confirmUploadBtn.disabled = true
    confirmUploadBtn.textContent = t(lang, 'system.saving')

    try {
      // Upload para Supabase Storage + salvar em candidate_documents
      const uploadResult = await uploadCandidateDocument(
        formData.candidateId,
        currentDocType,
        currentFile
      )

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed')
      }

      const docUrl = uploadResult.url

      // Atualizar estado local
      documentsState[currentDocType] = {
        url: docUrl,
        uploaded_at: new Date().toISOString(),
        status: DOCUMENT_STATUS.UPLOADED,
        file_name: currentFile.name
      }

      // Atualizar UI
      updateDocumentStatus(currentDocType, DOCUMENT_STATUS.UPLOADED, {
        fileName: currentFile.name,
        uploadedAt: new Date().toLocaleDateString(lang),
        lang,
        onView: () => window.open(docUrl, '_blank'),
        onRemove: () => handleRemove(currentDocType)
      })

      console.log(`✅ Documento ${currentDocType} salvo no Supabase`)

      checkCanContinue()
      closeModal()

    } catch (error) {
      console.error('❌ Erro ao fazer upload de documento:', error)
      alert(t(lang, 'validation.uploadFailed'))
      confirmUploadBtn.disabled = false
      confirmUploadBtn.textContent = t(lang, 'documentsUpload.uploadButton')
    }
  }

  // Remover documento
  const handleRemove = async (docType) => {
    if (!confirm(t(lang, 'addressHistory.deleteAddress') + '?')) return

    try {
      delete documentsState[docType]

      updateDocumentStatus(docType, DOCUMENT_STATUS.PENDING, {
        lang,
        onUpload: () => openUploadModal(docType, DOCUMENT_LABELS[docType])
      })

      await saveFormStep(formData.email, 11, {
        documents: documentsState
      })

      checkCanContinue()
    } catch (error) {
      console.error('Error removing document:', error)
      alert(t(lang, 'system.error'))
    }
  }

  // Renderizar cards dos documentos
  const renderDocuments = () => {
    documentsContainer.innerHTML = ''

    Object.values(DOCUMENT_TYPES).forEach((docType) => {
      const docState = documentsState[docType]
      const isOptional = docType === DOCUMENT_TYPES.VAT_CERTIFICATE

      const card = createDocumentCard({
        documentType: docType,
        documentLabel: DOCUMENT_LABELS[docType], // Usar label diretamente
        status: docState ? docState.status : DOCUMENT_STATUS.PENDING,
        lang,
        onUpload: () => openUploadModal(docType, DOCUMENT_LABELS[docType]),
        onView: docState ? () => window.open(docState.url, '_blank') : null,
        onRemove: docState ? () => handleRemove(docType) : null,
        fileName: docState?.file_name,
        uploadedAt: docState ? new Date(docState.uploaded_at).toLocaleDateString(lang) : null
      })

      documentsContainer.appendChild(card)
    })
  }

  renderDocuments()
  checkCanContinue()

  // Event listeners
  closeModalBtn.addEventListener('click', closeModal)
  cancelUploadBtn.addEventListener('click', closeModal)
  confirmUploadBtn.addEventListener('click', handleUpload)

  backBtn.addEventListener('click', () => {
    if (onBack) onBack()
  })

  continueBtn.addEventListener('click', async () => {
    continueBtn.disabled = true
    continueBtn.textContent = t(lang, 'system.saving')

    try {
      // Marcar candidato como completo
      await updateCandidateFields(formData.candidateId, {
        is_completed: true,
        completed_at: new Date().toISOString(),
        status: 'completed'
      })

      console.log('✅ Step 11 (DocumentsUpload) - Candidato marcado como completo')

      // 🔔 ENVIAR NOTIFICAÇÃO N8N DE CONCLUSÃO
      try {
        await sendCompletionNotification({
          candidate_id: formData.candidateId,
          email: formData.email,
          full_name: formData.fullName,
          phone: formData.phone,
          language: formData.language || 'en',
          depot_location: formData.selectedDepot,
          depot_code: formData.depotCode,
          completed_at: new Date().toISOString()
        })

        console.log('✅ Notificação n8n de conclusão enviada')
      } catch (n8nError) {
        console.warn('⚠️ Erro ao enviar notificação n8n (não crítico):', n8nError.message)
        // Não bloquear o fluxo se n8n falhar
      }

      if (onNext) {
        onNext({ documents: documentsState })
      }
    } catch (error) {
      console.error('❌ Erro ao completar formulário:', error)
      alert(t(lang, 'system.error'))
      continueBtn.disabled = false
      continueBtn.textContent = t(lang, 'documentsUpload.continueButton')
    }
  })
}

export default {
  renderDocumentsUploadPage
}
