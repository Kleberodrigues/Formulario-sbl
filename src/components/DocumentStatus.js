/**
 * Componente DocumentStatus
 * Badges de status para documentos (pending, uploaded, approved, rejected)
 */

import { t } from '../utils/translations.js'

/**
 * Status possíveis dos documentos
 */
export const DOCUMENT_STATUS = {
  PENDING: 'pending',
  UPLOADED: 'uploaded',
  APPROVED: 'approved',
  REJECTED: 'rejected'
}

/**
 * Configurações de ícones e cores por status
 */
const STATUS_CONFIG = {
  [DOCUMENT_STATUS.PENDING]: {
    icon: '⏳',
    color: '#F39C12', // Amarelo
    bgColor: '#FEF5E7'
  },
  [DOCUMENT_STATUS.UPLOADED]: {
    icon: '✓',
    color: '#27AE60', // Verde
    bgColor: '#E8F8F5'
  },
  [DOCUMENT_STATUS.APPROVED]: {
    icon: '✓✓',
    color: '#27AE60', // Verde escuro
    bgColor: '#D5F4E6'
  },
  [DOCUMENT_STATUS.REJECTED]: {
    icon: '✕',
    color: '#E74C3C', // Vermelho
    bgColor: '#FADBD8'
  }
}

/**
 * Criar badge de status
 * @param {object} options - Configurações
 * @param {string} options.status - Status do documento (pending, uploaded, approved, rejected)
 * @param {string} options.lang - Idioma atual
 * @param {string} options.label - Label customizado (opcional)
 * @param {boolean} options.showIcon - Mostrar ícone (default: true)
 * @returns {HTMLElement}
 */
export function createStatusBadge(options) {
  const {
    status,
    lang = 'pt-BR',
    label = null,
    showIcon = true
  } = options

  const config = STATUS_CONFIG[status] || STATUS_CONFIG[DOCUMENT_STATUS.PENDING]

  const badge = document.createElement('span')
  badge.className = `document-status document-status-${status}`
  badge.style.backgroundColor = config.bgColor
  badge.style.color = config.color
  badge.style.border = `1px solid ${config.color}`

  // Texto do status
  const statusText = label || t(lang, `documentsUpload.${status}`)

  // Conteúdo
  badge.innerHTML = `
    ${showIcon ? `<span class="status-icon">${config.icon}</span>` : ''}
    <span class="status-text">${statusText}</span>
  `

  return badge
}

/**
 * Criar card de documento com status
 * @param {object} options - Configurações
 * @param {string} options.documentType - Tipo do documento
 * @param {string} options.documentLabel - Label do documento
 * @param {string} options.status - Status atual
 * @param {string} options.lang - Idioma
 * @param {function} options.onUpload - Callback para upload
 * @param {function} options.onView - Callback para visualizar
 * @param {function} options.onRemove - Callback para remover
 * @param {string} options.fileName - Nome do arquivo (se uploaded)
 * @param {string} options.uploadedAt - Data de upload (se uploaded)
 * @returns {HTMLElement}
 */
export function createDocumentCard(options) {
  const {
    documentType,
    documentLabel,
    status = DOCUMENT_STATUS.PENDING,
    lang = 'pt-BR',
    onUpload = null,
    onView = null,
    onRemove = null,
    fileName = null,
    uploadedAt = null
  } = options

  const card = document.createElement('div')
  card.className = 'document-card'
  card.dataset.documentType = documentType
  card.dataset.status = status

  // Badge de status
  const badge = createStatusBadge({ status, lang })

  // Container do card
  card.innerHTML = `
    <div class="document-card-header">
      <h4 class="document-card-title">${documentLabel}</h4>
      <div class="document-card-status"></div>
    </div>
    <div class="document-card-body">
      ${fileName ? `
        <div class="document-card-file">
          <span class="file-icon">📄</span>
          <div class="file-info">
            <div class="file-name">${fileName}</div>
            ${uploadedAt ? `<div class="file-date">${uploadedAt}</div>` : ''}
          </div>
        </div>
      ` : ''}
    </div>
    <div class="document-card-actions">
      ${status === DOCUMENT_STATUS.PENDING && onUpload ? `
        <button type="button" class="btn btn-primary btn-sm" data-action="upload">
          ${t(lang, 'documentsUpload.uploadButton')}
        </button>
      ` : ''}
      ${status !== DOCUMENT_STATUS.PENDING && onView ? `
        <button type="button" class="btn btn-secondary btn-sm" data-action="view">
          Ver
        </button>
      ` : ''}
      ${status !== DOCUMENT_STATUS.PENDING && onRemove ? `
        <button type="button" class="btn btn-danger btn-sm" data-action="remove">
          Remover
        </button>
      ` : ''}
    </div>
  `

  // Inserir badge
  const statusContainer = card.querySelector('.document-card-status')
  statusContainer.appendChild(badge)

  // Event listeners
  if (onUpload) {
    const uploadBtn = card.querySelector('[data-action="upload"]')
    uploadBtn?.addEventListener('click', onUpload)
  }

  if (onView) {
    const viewBtn = card.querySelector('[data-action="view"]')
    viewBtn?.addEventListener('click', onView)
  }

  if (onRemove) {
    const removeBtn = card.querySelector('[data-action="remove"]')
    removeBtn?.addEventListener('click', onRemove)
  }

  return card
}

/**
 * Criar lista de documentos com status
 * @param {object[]} documents - Array de documentos
 * @param {string} lang - Idioma
 * @returns {HTMLElement}
 */
export function createDocumentList(documents, lang = 'pt-BR') {
  const container = document.createElement('div')
  container.className = 'document-list'

  documents.forEach((doc) => {
    const card = createDocumentCard({
      ...doc,
      lang
    })

    container.appendChild(card)
  })

  return container
}

/**
 * Atualizar status de um documento na lista
 * @param {string} documentType - Tipo do documento
 * @param {string} newStatus - Novo status
 * @param {object} data - Dados adicionais (fileName, uploadedAt, etc)
 */
export function updateDocumentStatus(documentType, newStatus, data = {}) {
  const card = document.querySelector(`[data-document-type="${documentType}"]`)
  if (!card) return

  // Atualizar dataset
  card.dataset.status = newStatus

  // Atualizar badge
  const statusContainer = card.querySelector('.document-card-status')
  statusContainer.innerHTML = ''

  const badge = createStatusBadge({
    status: newStatus,
    lang: data.lang || 'pt-BR'
  })
  statusContainer.appendChild(badge)

  // Atualizar body se houver dados
  if (data.fileName) {
    const body = card.querySelector('.document-card-body')
    body.innerHTML = `
      <div class="document-card-file">
        <span class="file-icon">📄</span>
        <div class="file-info">
          <div class="file-name">${data.fileName}</div>
          ${data.uploadedAt ? `<div class="file-date">${data.uploadedAt}</div>` : ''}
        </div>
      </div>
    `
  }

  // Atualizar ações
  updateDocumentActions(card, newStatus, data)
}

/**
 * Atualizar ações do card baseado no status
 * @param {HTMLElement} card - Card do documento
 * @param {string} status - Status atual
 * @param {object} data - Dados com callbacks
 */
function updateDocumentActions(card, status, data) {
  const actionsContainer = card.querySelector('.document-card-actions')
  actionsContainer.innerHTML = ''

  const lang = data.lang || 'pt-BR'

  if (status === DOCUMENT_STATUS.PENDING && data.onUpload) {
    const uploadBtn = document.createElement('button')
    uploadBtn.type = 'button'
    uploadBtn.className = 'btn btn-primary btn-sm'
    uploadBtn.textContent = t(lang, 'documentsUpload.uploadButton')
    uploadBtn.addEventListener('click', data.onUpload)
    actionsContainer.appendChild(uploadBtn)
  }

  if (status !== DOCUMENT_STATUS.PENDING) {
    if (data.onView) {
      const viewBtn = document.createElement('button')
      viewBtn.type = 'button'
      viewBtn.className = 'btn btn-secondary btn-sm'
      viewBtn.textContent = '👁️ Ver'
      viewBtn.addEventListener('click', data.onView)
      actionsContainer.appendChild(viewBtn)
    }

    if (data.onRemove) {
      const removeBtn = document.createElement('button')
      removeBtn.type = 'button'
      removeBtn.className = 'btn btn-danger btn-sm'
      removeBtn.textContent = '🗑️ Remover'
      removeBtn.addEventListener('click', data.onRemove)
      actionsContainer.appendChild(removeBtn)
    }
  }
}

export default {
  DOCUMENT_STATUS,
  createStatusBadge,
  createDocumentCard,
  createDocumentList,
  updateDocumentStatus
}
