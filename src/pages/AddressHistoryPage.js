/**
 * AddressHistoryPage - Step 6
 * Página de histórico de endereços (7 anos)
 */

import { t } from '../utils/translations.js'
import { createAddressHistoryList } from '../components/AddressHistoryList.js'
import { saveFormStep } from '../services/supabaseService.js'

/**
 * Renderizar página de histórico de endereços
 * @param {HTMLElement} container - Container onde será renderizado
 * @param {object} options - Opções { lang, onNext, onBack, formData }
 */
export function renderAddressHistoryPage(container, options = {}) {
  const {
    lang = 'pt-BR',
    onNext = null,
    onBack = null,
    formData = {}
  } = options

  // Estado local de endereços
  let addresses = formData.addressHistory || []

  container.innerHTML = `
    <div class="form-page address-history-page">
      <div class="form-header">
        <h2 class="form-title">${t(lang, 'addressHistory.title')}</h2>
        <p class="form-subtitle">${t(lang, 'addressHistory.subtitle')}</p>
      </div>

      <div class="form-content">
        <div id="addressHistoryContainer"></div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" id="backBtn">
          ${t(lang, 'addressHistory.backButton')}
        </button>
        <button type="button" class="btn btn-primary" id="continueBtn">
          ${t(lang, 'addressHistory.continueButton')}
        </button>
      </div>
    </div>
  `

  const addressContainer = container.querySelector('#addressHistoryContainer')
  const backBtn = container.querySelector('#backBtn')
  const continueBtn = container.querySelector('#continueBtn')

  // Função para re-renderizar lista
  const renderList = () => {
    addressContainer.innerHTML = ''

    const list = createAddressHistoryList({
      lang,
      addresses,
      onAdd: (newAddress) => {
        addresses.push(newAddress)
        renderList()
      },
      onEdit: (index, address) => {
        // Implementar edição
        console.log('Edit address', index, address)
        // TODO: Abrir form com dados preenchidos
      },
      onDelete: (index) => {
        addresses.splice(index, 1)
        renderList()
      }
    })

    addressContainer.appendChild(list)
  }

  // Renderizar lista inicial
  renderList()

  // Voltar
  backBtn.addEventListener('click', () => {
    if (onBack) onBack()
  })

  // Continuar
  continueBtn.addEventListener('click', async () => {
    // Validar que tem pelo menos 1 endereço
    if (addresses.length === 0) {
      alert(t(lang, 'validation.required'))
      return
    }

    // Validar cobertura de 7 anos (opcional - pode ser implementado)
    // TODO: Verificar se endereços cobrem últimos 7 anos

    // Salvar
    continueBtn.disabled = true
    continueBtn.textContent = t(lang, 'system.saving')

    try {
      await saveFormStep(formData.email, 5, {
        address_history: addresses
      })

      if (onNext) {
        onNext({ addressHistory: addresses })
      }
    } catch (error) {
      console.error('Error saving address history:', error)
      alert(t(lang, 'system.error'))
      continueBtn.disabled = false
      continueBtn.textContent = t(lang, 'addressHistory.continueButton')
    }
  })
}

export default {
  renderAddressHistoryPage
}
