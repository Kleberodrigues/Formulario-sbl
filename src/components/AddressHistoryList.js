/**
 * Componente AddressHistoryList
 * Lista de endereços dos últimos 7 anos com CRUD
 */

import { t } from '../utils/translations.js'
import { validateUKPostcode } from '../utils/validators.js'

/**
 * Criar lista de histórico de endereços
 * @param {object} options - Configurações
 * @param {string} options.lang - Idioma atual
 * @param {object[]} options.addresses - Array de endereços
 * @param {function} options.onAdd - Callback ao adicionar endereço
 * @param {function} options.onEdit - Callback ao editar (index, address)
 * @param {function} options.onDelete - Callback ao deletar (index)
 * @returns {HTMLElement}
 */
export function createAddressHistoryList(options) {
  const {
    lang = 'pt-BR',
    addresses = [],
    onAdd = null,
    onEdit = null,
    onDelete = null
  } = options

  const container = document.createElement('div')
  container.className = 'address-history-container'

  // Header com botão adicionar
  const header = document.createElement('div')
  header.className = 'address-history-header'
  header.innerHTML = `
    <h3 class="address-history-title">${t(lang, 'addressHistory.title')}</h3>
    <button type="button" class="btn btn-primary btn-sm" data-action="add">
      + ${t(lang, 'addressHistory.addAddress')}
    </button>
  `

  // Lista de endereços
  const list = document.createElement('div')
  list.className = 'address-history-list'

  if (addresses.length === 0) {
    list.innerHTML = `
      <div class="address-history-empty">
        <p>${t(lang, 'addressHistory.noAddresses')}</p>
      </div>
    `
  } else {
    addresses.forEach((address, index) => {
      const item = createAddressItem(address, index, lang, onEdit, onDelete)
      list.appendChild(item)
    })
  }

  // Form para adicionar/editar (hidden por padrão)
  const form = createAddressForm(lang, null, null)
  form.style.display = 'none'

  // Event listener para botão adicionar
  const addBtn = header.querySelector('[data-action="add"]')
  addBtn.addEventListener('click', () => {
    if (form.style.display === 'none') {
      form.style.display = 'block'
      addBtn.style.display = 'none'

      // Resetar form
      form.querySelector('form').reset()
      form.dataset.editIndex = ''

      // Callback
      if (onAdd) {
        setupFormSubmit(form, lang, (addressData) => {
          onAdd(addressData)
          form.style.display = 'none'
          addBtn.style.display = 'inline-block'
        })
      }
    }
  })

  // Cancelar form
  const cancelBtn = form.querySelector('[data-action="cancel"]')
  cancelBtn.addEventListener('click', () => {
    form.style.display = 'none'
    addBtn.style.display = 'inline-block'
  })

  // Montar componente
  container.appendChild(header)
  container.appendChild(form)
  container.appendChild(list)

  return container
}

/**
 * Criar item da lista de endereço
 * @param {object} address - Dados do endereço
 * @param {number} index - Índice do endereço
 * @param {string} lang - Idioma
 * @param {function} onEdit - Callback editar
 * @param {function} onDelete - Callback deletar
 * @returns {HTMLElement}
 */
function createAddressItem(address, index, lang, onEdit, onDelete) {
  const item = document.createElement('div')
  item.className = 'address-history-item'
  item.dataset.index = index

  const isCurrent = address.isCurrent || address.toDate === null

  item.innerHTML = `
    <div class="address-item-content">
      <div class="address-item-header">
        <span class="address-item-label">${address.addressLine1}</span>
        ${isCurrent ? `<span class="address-item-badge">${t(lang, 'addressHistory.current')}</span>` : ''}
      </div>
      <div class="address-item-details">
        ${address.addressLine2 ? `<div>${address.addressLine2}</div>` : ''}
        <div>${address.city} - ${address.postcode}</div>
        <div class="address-item-dates">
          ${address.fromDate} → ${address.toDate || t(lang, 'addressHistory.current')}
        </div>
      </div>
    </div>
    <div class="address-item-actions">
      <button type="button" class="btn btn-icon" data-action="edit" title="${t(lang, 'addressHistory.editAddress')}">
        ✏️
      </button>
      <button type="button" class="btn btn-icon btn-danger" data-action="delete" title="${t(lang, 'addressHistory.deleteAddress')}">
        🗑️
      </button>
    </div>
  `

  // Event listeners
  if (onEdit) {
    const editBtn = item.querySelector('[data-action="edit"]')
    editBtn.addEventListener('click', () => onEdit(index, address))
  }

  if (onDelete) {
    const deleteBtn = item.querySelector('[data-action="delete"]')
    deleteBtn.addEventListener('click', () => {
      if (confirm(t(lang, 'addressHistory.deleteAddress') + '?')) {
        onDelete(index)
      }
    })
  }

  return item
}

/**
 * Criar formulário de endereço
 * @param {string} lang - Idioma
 * @param {object} address - Endereço para editar (null para novo)
 * @param {number} editIndex - Índice do endereço sendo editado
 * @returns {HTMLElement}
 */
function createAddressForm(lang, address = null, editIndex = null) {
  const container = document.createElement('div')
  container.className = 'address-form-container'

  if (editIndex !== null) {
    container.dataset.editIndex = editIndex
  }

  container.innerHTML = `
    <form class="address-form">
      <div class="form-row">
        <div class="form-group">
          <label for="addressLine1">${t(lang, 'addressHistory.addressLine1')} *</label>
          <input
            type="text"
            id="addressLine1"
            name="addressLine1"
            class="form-input"
            value="${address?.addressLine1 || ''}"
            required
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="addressLine2">${t(lang, 'addressHistory.addressLine2')}</label>
          <input
            type="text"
            id="addressLine2"
            name="addressLine2"
            class="form-input"
            value="${address?.addressLine2 || ''}"
          />
        </div>
      </div>

      <div class="form-row form-row-2">
        <div class="form-group">
          <label for="city">${t(lang, 'addressHistory.city')} *</label>
          <input
            type="text"
            id="city"
            name="city"
            class="form-input"
            value="${address?.city || ''}"
            required
          />
        </div>

        <div class="form-group">
          <label for="postcode">${t(lang, 'addressHistory.postcode')} *</label>
          <input
            type="text"
            id="postcode"
            name="postcode"
            class="form-input"
            placeholder="SW1A 1AA"
            value="${address?.postcode || ''}"
            required
          />
        </div>
      </div>

      <div class="form-row form-row-2">
        <div class="form-group">
          <label for="fromDate">${t(lang, 'addressHistory.fromDate')} *</label>
          <input
            type="date"
            id="fromDate"
            name="fromDate"
            class="form-input"
            value="${address?.fromDate || ''}"
            required
          />
        </div>

        <div class="form-group">
          <label for="toDate">${t(lang, 'addressHistory.toDate')}</label>
          <input
            type="date"
            id="toDate"
            name="toDate"
            class="form-input"
            value="${address?.toDate || ''}"
          />
        </div>
      </div>

      <div class="form-row">
        <label class="checkbox-label">
          <input
            type="checkbox"
            name="isCurrent"
            id="isCurrent"
            ${address?.isCurrent || !address?.toDate ? 'checked' : ''}
          />
          ${t(lang, 'addressHistory.current')}
        </label>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">
          ${t(lang, 'addressHistory.saveButton')}
        </button>
        <button type="button" class="btn btn-secondary" data-action="cancel">
          ${t(lang, 'addressHistory.cancelButton')}
        </button>
      </div>
    </form>
  `

  // Checkbox "Endereço Atual" desabilita "To Date"
  const currentCheckbox = container.querySelector('#isCurrent')
  const toDateInput = container.querySelector('#toDate')

  currentCheckbox.addEventListener('change', () => {
    toDateInput.disabled = currentCheckbox.checked
    if (currentCheckbox.checked) {
      toDateInput.value = ''
    }
  })

  // Estado inicial
  if (currentCheckbox.checked) {
    toDateInput.disabled = true
  }

  return container
}

/**
 * Setup do submit do formulário com validações
 * @param {HTMLElement} formContainer - Container do form
 * @param {string} lang - Idioma
 * @param {function} onSubmit - Callback com dados validados
 */
function setupFormSubmit(formContainer, lang, onSubmit) {
  const form = formContainer.querySelector('form')

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    // Coletar dados
    const formData = new FormData(form)
    const addressData = {
      addressLine1: formData.get('addressLine1').trim(),
      addressLine2: formData.get('addressLine2').trim(),
      city: formData.get('city').trim(),
      postcode: formData.get('postcode').trim(),
      fromDate: formData.get('fromDate'),
      toDate: formData.get('toDate') || null,
      isCurrent: formData.get('isCurrent') === 'on'
    }

    // Validar postcode
    const postcodeValidation = validateUKPostcode(addressData.postcode, lang)
    if (!postcodeValidation.valid) {
      alert(postcodeValidation.error)
      return
    }

    // Validar datas
    if (addressData.toDate && addressData.toDate < addressData.fromDate) {
      alert(t(lang, 'validation.invalidDate'))
      return
    }

    // Se é endereço atual, limpar toDate
    if (addressData.isCurrent) {
      addressData.toDate = null
    }

    // Callback
    if (onSubmit) {
      onSubmit(addressData)
    }
  })
}

/**
 * Adicionar endereço à lista
 * @param {string} containerId - ID do container
 * @param {object} address - Dados do endereço
 * @param {string} lang - Idioma
 * @param {function} onEdit - Callback editar
 * @param {function} onDelete - Callback deletar
 */
export function addAddressToList(containerId, address, lang, onEdit, onDelete) {
  const container = document.getElementById(containerId)
  if (!container) return

  const list = container.querySelector('.address-history-list')
  const emptyMsg = list.querySelector('.address-history-empty')

  if (emptyMsg) {
    emptyMsg.remove()
  }

  const index = list.children.length
  const item = createAddressItem(address, index, lang, onEdit, onDelete)

  list.appendChild(item)
}

/**
 * Remover endereço da lista
 * @param {string} containerId - ID do container
 * @param {number} index - Índice do endereço
 * @param {string} lang - Idioma
 */
export function removeAddressFromList(containerId, index, lang) {
  const container = document.getElementById(containerId)
  if (!container) return

  const list = container.querySelector('.address-history-list')
  const item = list.querySelector(`[data-index="${index}"]`)

  if (item) {
    item.remove()
  }

  // Se lista vazia, mostrar mensagem
  if (list.children.length === 0) {
    list.innerHTML = `
      <div class="address-history-empty">
        <p>${t(lang, 'addressHistory.noAddresses')}</p>
      </div>
    `
  }
}

export default {
  createAddressHistoryList,
  addAddressToList,
  removeAddressFromList
}
