/**
 * ChatPage - Step 4
 * Página de mensagem de chat
 */

import { t } from '../utils/translations.js'
import { validateMessage } from '../utils/validators.js'
import { saveFormStep } from '../services/supabaseService.js'

/**
 * Renderizar página de chat
 * @param {HTMLElement} container - Container onde será renderizado
 * @param {object} options - Opções { lang, onNext, onBack, formData }
 */
export function renderChatPage(container, options = {}) {
  const {
    lang = 'pt-BR',
    onNext = null,
    onBack = null,
    formData = {}
  } = options

  container.innerHTML = `
    <div class="form-page chat-page">
      <div class="form-header">
        <h2 class="form-title">${t(lang, 'chat.title')}</h2>
        <p class="form-subtitle">${t(lang, 'chat.subtitle')}</p>
      </div>

      <form id="chatForm" class="form-content">
        <div class="form-group">
          <label for="chatMessage" class="form-label">
            ${t(lang, 'chat.messagePlaceholder')}
          </label>
          <textarea
            id="chatMessage"
            name="chatMessage"
            class="form-input form-textarea"
            rows="5"
            placeholder="${t(lang, 'chat.messagePlaceholder')}"
            maxlength="500"
          >${formData.chatMessage || ''}</textarea>
          <div class="form-helper">
            <span id="charCount">0</span> / 500 ${t(lang, 'validation.messageTooLong').split('(')[0].trim()}
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" id="backBtn">
            ${t(lang, 'chat.backButton')}
          </button>
          <button type="submit" class="btn btn-primary" id="continueBtn">
            ${t(lang, 'chat.continueButton')}
          </button>
        </div>
      </form>
    </div>
  `

  // Event listeners
  const form = container.querySelector('#chatForm')
  const textarea = container.querySelector('#chatMessage')
  const charCount = container.querySelector('#charCount')
  const backBtn = container.querySelector('#backBtn')
  const continueBtn = container.querySelector('#continueBtn')

  // Atualizar contador de caracteres
  const updateCharCount = () => {
    charCount.textContent = textarea.value.length
  }

  textarea.addEventListener('input', updateCharCount)
  updateCharCount()

  // Voltar
  backBtn.addEventListener('click', () => {
    if (onBack) onBack()
  })

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const message = textarea.value.trim()

    // Validar
    const validation = validateMessage(message, lang)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    // Salvar
    continueBtn.disabled = true
    continueBtn.textContent = t(lang, 'system.saving')

    try {
      await saveFormStep(formData.email, 4, {
        messages: [
          ...(formData.messages || []),
          {
            text: message,
            timestamp: new Date().toISOString(),
            sender: 'user'
          }
        ]
      })

      if (onNext) {
        onNext({ chatMessage: message })
      }
    } catch (error) {
      console.error('Error saving chat:', error)
      alert(t(lang, 'system.error'))
      continueBtn.disabled = false
      continueBtn.textContent = t(lang, 'chat.continueButton')
    }
  })
}

export default {
  renderChatPage
}
