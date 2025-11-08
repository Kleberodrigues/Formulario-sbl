/**
 * Componente ImagePreview
 * Preview de imagens carregadas com opção de remover
 */

/**
 * Criar preview de imagem
 * @param {object} options - Configurações
 * @param {string} options.imageUrl - URL da imagem
 * @param {string} options.alt - Texto alternativo
 * @param {function} options.onRemove - Callback ao remover (opcional)
 * @param {boolean} options.showRemove - Mostrar botão remover (default: true)
 * @param {string} options.className - Classe CSS adicional
 * @returns {HTMLElement}
 */
export function createImagePreview(options) {
  const {
    imageUrl,
    alt = 'Preview',
    onRemove = null,
    showRemove = true,
    className = ''
  } = options

  const container = document.createElement('div')
  container.className = `image-preview-container ${className}`

  const wrapper = document.createElement('div')
  wrapper.className = 'image-preview-wrapper'

  // Imagem
  const img = document.createElement('img')
  img.src = imageUrl
  img.alt = alt
  img.className = 'image-preview-img'

  // Indicador de loading
  img.addEventListener('load', () => {
    container.classList.add('image-preview-loaded')
  })

  img.addEventListener('error', () => {
    container.classList.add('image-preview-error')
    img.src = '/assets/image-error.svg' // Fallback
  })

  wrapper.appendChild(img)

  // Botão remover (se habilitado)
  if (showRemove) {
    const removeBtn = document.createElement('button')
    removeBtn.type = 'button'
    removeBtn.className = 'image-preview-remove'
    removeBtn.innerHTML = '✕'
    removeBtn.setAttribute('aria-label', 'Remove image')

    removeBtn.addEventListener('click', () => {
      if (onRemove) {
        onRemove()
      }
      container.remove()
    })

    wrapper.appendChild(removeBtn)
  }

  container.appendChild(wrapper)

  return container
}

/**
 * Criar preview de múltiplas imagens
 * @param {object[]} images - Array de imagens { url, alt }
 * @param {function} onRemove - Callback ao remover (index)
 * @returns {HTMLElement}
 */
export function createMultipleImagePreview(images, onRemove = null) {
  const container = document.createElement('div')
  container.className = 'image-preview-grid'

  images.forEach((image, index) => {
    const preview = createImagePreview({
      imageUrl: image.url,
      alt: image.alt || `Image ${index + 1}`,
      onRemove: onRemove ? () => onRemove(index) : null
    })

    container.appendChild(preview)
  })

  return container
}

/**
 * Criar preview de documento (PDF, etc)
 * @param {object} options - Configurações
 * @param {string} options.fileName - Nome do arquivo
 * @param {string} options.fileSize - Tamanho do arquivo (formatado)
 * @param {string} options.fileType - Tipo do arquivo (pdf, doc, etc)
 * @param {function} options.onRemove - Callback ao remover
 * @param {function} options.onView - Callback ao visualizar
 * @returns {HTMLElement}
 */
export function createDocumentPreview(options) {
  const {
    fileName,
    fileSize,
    fileType = 'pdf',
    onRemove = null,
    onView = null
  } = options

  const container = document.createElement('div')
  container.className = 'document-preview-container'

  // Ícone baseado no tipo
  const icons = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    default: '📁'
  }

  const icon = icons[fileType.toLowerCase()] || icons.default

  container.innerHTML = `
    <div class="document-preview-wrapper">
      <div class="document-preview-icon">${icon}</div>
      <div class="document-preview-info">
        <div class="document-preview-name">${fileName}</div>
        <div class="document-preview-size">${fileSize}</div>
      </div>
      <div class="document-preview-actions">
        ${onView ? '<button type="button" class="btn-icon" data-action="view">👁️</button>' : ''}
        ${onRemove ? '<button type="button" class="btn-icon" data-action="remove">🗑️</button>' : ''}
      </div>
    </div>
  `

  // Event listeners
  if (onView) {
    const viewBtn = container.querySelector('[data-action="view"]')
    viewBtn?.addEventListener('click', onView)
  }

  if (onRemove) {
    const removeBtn = container.querySelector('[data-action="remove"]')
    removeBtn?.addEventListener('click', () => {
      onRemove()
      container.remove()
    })
  }

  return container
}

/**
 * Formatar tamanho de arquivo
 * @param {number} bytes - Tamanho em bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Criar preview a partir de File object
 * @param {File} file - Objeto File
 * @param {function} onRemove - Callback ao remover
 * @returns {Promise<HTMLElement>}
 */
export function createPreviewFromFile(file, onRemove = null) {
  return new Promise((resolve) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()

      reader.onload = (e) => {
        const preview = createImagePreview({
          imageUrl: e.target.result,
          alt: file.name,
          onRemove
        })
        resolve(preview)
      }

      reader.readAsDataURL(file)
    } else {
      const preview = createDocumentPreview({
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        fileType: file.name.split('.').pop(),
        onRemove
      })
      resolve(preview)
    }
  })
}

export default {
  createImagePreview,
  createMultipleImagePreview,
  createDocumentPreview,
  createPreviewFromFile,
  formatFileSize
}
