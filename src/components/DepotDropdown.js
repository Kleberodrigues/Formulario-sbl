/**
 * DepotDropdown Component
 * Dropdown selector para escolher depósito, similar ao language selector
 */

import { t } from '../utils/translations.js'
import { DEPOTS } from '../config/constants.js'

/**
 * Agrupar depósitos por categoria
 * @param {Array} depots - Array de depósitos
 * @returns {Object} - Depósitos agrupados por categoria
 */
function groupDepotsByCategory(depots) {
  const grouped = {}

  depots.forEach(depot => {
    const category = depot.category || 'Other'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(depot)
  })

  // Ordenar depósitos dentro de cada categoria por nome
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => a.name.localeCompare(b.name))
  })

  return grouped
}

/**
 * Criar dropdown de seleção de depósito
 * @param {object} options - Opções do componente
 * @param {string} options.lang - Idioma atual
 * @param {function} options.onDepotSelect - Callback quando depot é selecionado
 * @param {string} options.selectedDepotId - ID do depot atualmente selecionado
 * @returns {HTMLElement} - Container do dropdown
 */
export function createDepotDropdown(options = {}) {
  const {
    lang = 'pt-BR',
    onDepotSelect = null,
    selectedDepotId = null
  } = options

  // Container principal
  const container = document.createElement('div')
  container.className = 'depot-dropdown-container'

  // Label
  const label = document.createElement('label')
  label.className = 'depot-dropdown-label'
  label.setAttribute('for', 'depot-select')
  label.textContent = t(lang, 'depot.dropdownLabel')
  container.appendChild(label)

  // Select element
  const select = document.createElement('select')
  select.className = 'depot-dropdown-select'
  select.id = 'depot-select'

  // Opção placeholder
  const placeholderOption = document.createElement('option')
  placeholderOption.value = ''
  placeholderOption.textContent = t(lang, 'depot.dropdownPlaceholder')
  placeholderOption.disabled = true
  placeholderOption.selected = !selectedDepotId
  select.appendChild(placeholderOption)

  // Agrupar depósitos por categoria
  const groupedDepots = groupDepotsByCategory(DEPOTS)

  // Ordenar categorias alfabeticamente
  const sortedCategories = Object.keys(groupedDepots).sort()

  // Criar optgroups
  sortedCategories.forEach(category => {
    const optgroup = document.createElement('optgroup')
    optgroup.label = category

    groupedDepots[category].forEach(depot => {
      const option = document.createElement('option')
      option.value = depot.id
      option.textContent = depot.name

      // Marcar como selecionado se for o depot atual
      if (selectedDepotId && depot.id === selectedDepotId) {
        option.selected = true
      }

      optgroup.appendChild(option)
    })

    select.appendChild(optgroup)
  })

  // Event listener para mudança de seleção
  select.addEventListener('change', (e) => {
    const selectedId = e.target.value

    if (selectedId && onDepotSelect) {
      // Encontrar o depot completo pelo ID
      const selectedDepot = DEPOTS.find(d => d.id === selectedId)

      if (selectedDepot) {
        onDepotSelect(selectedDepot)
      }
    }
  })

  container.appendChild(select)

  return container
}

/**
 * Atualizar dropdown com novo depot selecionado
 * @param {string} depotId - ID do depot a selecionar
 */
export function updateDepotDropdown(depotId) {
  const select = document.getElementById('depot-select')

  if (select) {
    select.value = depotId || ''
  }
}

export default {
  createDepotDropdown,
  updateDepotDropdown
}
