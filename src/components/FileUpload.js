/**
 * Componente FileUpload
 * Upload de arquivos com drag & drop, preview e validação
 */

import { validateFileUpload } from '../utils/validators.js'
import { t } from '../utils/translations.js'

/**
 * Criar componente de upload de arquivo
 * @param {object} options - Configurações do upload
 * @param {string} options.id - ID único do input
 * @param {string} options.lang - Idioma atual
 * @param {function} options.onFileSelect - Callback quando arquivo é selecionado
 * @param {number} options.maxSizeMB - Tamanho máximo em MB
 * @param {string[]} options.allowedTypes - Tipos MIME permitidos
 * @param {string} options.accept - Atributo accept do input (ex: 'image/*')
 * @param {boolean} options.showPreview - Mostrar preview da imagem (default: true)
 * @returns {HTMLElement}
 */
export function createFileUpload(options) {
  const {
    id,
    lang = 'pt-BR',
    onFileSelect,
    maxSizeMB = 10,
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    accept = 'image/*,application/pdf',
    showPreview = true
  } = options

  const container = document.createElement('div')
  container.className = 'file-upload-container'
  container.dataset.uploadId = id

  // Área de drag & drop
  const dropZone = document.createElement('div')
  dropZone.className = 'file-upload-dropzone'
  dropZone.innerHTML = `
    <div class="file-upload-icon">📁</div>
    <p class="file-upload-text">${t(lang, 'profilePhoto.dragDrop')}</p>
    <p class="file-upload-or">${t(lang, 'profilePhoto.or')}</p>
    <label for="${id}" class="file-upload-button">
      ${t(lang, 'profilePhoto.selectFile')}
    </label>
    <p class="file-upload-info">
      ${t(lang, 'profilePhoto.maxSize')} | ${t(lang, 'profilePhoto.formats')}
    </p>
  `

  // Input file (hidden)
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.id = id
  fileInput.name = id
  fileInput.accept = accept
  fileInput.className = 'file-upload-input'
  fileInput.style.display = 'none'

  // Preview container
  const previewContainer = document.createElement('div')
  previewContainer.className = 'file-upload-preview'
  previewContainer.style.display = 'none'

  // Error message container
  const errorContainer = document.createElement('div')
  errorContainer.className = 'file-upload-error'
  errorContainer.style.display = 'none'

  // Função para processar arquivo selecionado
  const handleFileSelect = (file) => {
    // Limpar erro anterior
    errorContainer.style.display = 'none'
    errorContainer.textContent = ''

    // Validar arquivo
    const validation = validateFileUpload(file, { maxSizeMB, allowedTypes }, lang)

    if (!validation.valid) {
      // Mostrar erro
      errorContainer.textContent = validation.error
      errorContainer.style.display = 'block'

      // Limpar preview
      previewContainer.innerHTML = ''
      previewContainer.style.display = 'none'

      return
    }

    // Mostrar preview se for imagem
    if (showPreview && file.type.startsWith('image/')) {
      const reader = new FileReader()

      reader.onload = (e) => {
        previewContainer.innerHTML = `
          <div class="file-preview-wrapper">
            <img src="${e.target.result}" alt="Preview" class="file-preview-image" />
            <button type="button" class="file-preview-remove" data-action="remove">
              ✕
            </button>
          </div>
        `
        previewContainer.style.display = 'block'
        dropZone.style.display = 'none'

        // Botão remover
        const removeBtn = previewContainer.querySelector('[data-action="remove"]')
        removeBtn.addEventListener('click', () => {
          fileInput.value = ''
          previewContainer.innerHTML = ''
          previewContainer.style.display = 'none'
          dropZone.style.display = 'flex'

          if (onFileSelect) {
            onFileSelect(null)
          }
        })
      }

      reader.readAsDataURL(file)
    } else if (file.type === 'application/pdf') {
      // Preview para PDF
      previewContainer.innerHTML = `
        <div class="file-preview-wrapper">
          <div class="file-preview-pdf">
            <span class="file-preview-icon">📄</span>
            <span class="file-preview-name">${file.name}</span>
            <span class="file-preview-size">${(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
          <button type="button" class="file-preview-remove" data-action="remove">
            ✕
          </button>
        </div>
      `
      previewContainer.style.display = 'block'
      dropZone.style.display = 'none'

      // Botão remover
      const removeBtn = previewContainer.querySelector('[data-action="remove"]')
      removeBtn.addEventListener('click', () => {
        fileInput.value = ''
        previewContainer.innerHTML = ''
        previewContainer.style.display = 'none'
        dropZone.style.display = 'flex'

        if (onFileSelect) {
          onFileSelect(null)
        }
      })
    }

    // Callback com arquivo válido
    if (onFileSelect) {
      onFileSelect(file)
    }
  }

  // Event listener para input file
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
  })

  // Drag & drop events
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault()
    dropZone.classList.add('file-upload-dragover')
  })

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('file-upload-dragover')
  })

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault()
    dropZone.classList.remove('file-upload-dragover')

    const file = e.dataTransfer.files[0]
    if (file) {
      // Atualizar input file
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      fileInput.files = dataTransfer.files

      handleFileSelect(file)
    }
  })

  // Montar componente
  container.appendChild(dropZone)
  container.appendChild(fileInput)
  container.appendChild(previewContainer)
  container.appendChild(errorContainer)

  return container
}

/**
 * Obter arquivo atual do componente
 * @param {string} uploadId - ID do upload
 * @returns {File|null}
 */
export function getUploadedFile(uploadId) {
  const container = document.querySelector(`[data-upload-id="${uploadId}"]`)
  if (!container) return null

  const input = container.querySelector('input[type="file"]')
  return input?.files[0] || null
}

/**
 * Limpar upload
 * @param {string} uploadId - ID do upload
 */
export function clearUpload(uploadId) {
  const container = document.querySelector(`[data-upload-id="${uploadId}"]`)
  if (!container) return

  const input = container.querySelector('input[type="file"]')
  const preview = container.querySelector('.file-upload-preview')
  const dropZone = container.querySelector('.file-upload-dropzone')
  const error = container.querySelector('.file-upload-error')

  if (input) input.value = ''
  if (preview) {
    preview.innerHTML = ''
    preview.style.display = 'none'
  }
  if (dropZone) dropZone.style.display = 'flex'
  if (error) {
    error.textContent = ''
    error.style.display = 'none'
  }
}

export default {
  createFileUpload,
  getUploadedFile,
  clearUpload
}
