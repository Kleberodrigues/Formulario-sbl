/**
 * DepotPage - Step 2
 * Página de seleção de depósito com Mapbox
 */

import { t } from '../utils/translations.js'
import { createMapboxDepotSelector, createDepotList, isMapboxAvailable } from '../components/MapboxDepotSelector.js'
import { createDepotDropdown, updateDepotDropdown } from '../components/DepotDropdown.js'
import { DEPOTS } from '../config/constants.js'

/**
 * Renderizar página de seleção de depósito
 * @param {HTMLElement} container - Container onde será renderizado
 * @param {object} options - Opções { lang, onNext, onBack, formData }
 */
export function renderDepotPage(container, options = {}) {
  const {
    lang = 'pt-BR',
    onNext = null,
    onBack = null,
    formData = {}
  } = options

  // Converter string para objeto depot se necessário
  let selectedDepot = null
  if (formData.selectedDepot) {
    if (typeof formData.selectedDepot === 'string') {
      // Se for string, procurar pelo nome
      selectedDepot = DEPOTS.find(d => d.name === formData.selectedDepot)
    } else if (formData.selectedDepot.id) {
      // Se for objeto com ID, procurar pelo ID
      selectedDepot = DEPOTS.find(d => d.id === formData.selectedDepot.id)
    } else {
      selectedDepot = formData.selectedDepot
    }
  }

  let mapInstance = null

  container.innerHTML = `
    <div class="form-page depot-page">
      <div class="form-content">
        <!-- Map Container (PRIMEIRO - como na referência) -->
        <div id="mapContainer" class="map-container"></div>

        <!-- Dropdown Container (ABAIXO do mapa) -->
        <div id="depotDropdownContainer"></div>

        <!-- Depot Info Card (Hidden until selection) -->
        <div id="depotInfo" class="depot-info-card" style="display: none;">
          <div class="depot-info-header">
            <h3 id="depotName" class="depot-name" style="margin: 0 0 10px 0; color: #17A798;"></h3>
            <span id="depotBadge" class="depot-badge" style="display: inline-block; padding: 4px 12px; background: #17A798; color: white; border-radius: 4px; font-size: 12px;"></span>
          </div>
          <p id="depotAddress" class="depot-address" style="margin: 10px 0; color: #666;"></p>
          <p id="depotCode" class="depot-code" style="margin: 5px 0; color: #333; font-weight: 600;"></p>
        </div>
      </div>

      <!-- Botões de navegação -->
      <div class="form-actions" style="justify-content: space-between; gap: 16px;">
        <button type="button" class="btn btn-secondary" id="backBtn" style="min-width: 200px;">
          ${t(lang, 'depot.backButton')}
        </button>
        <button type="button" class="btn btn-primary" id="proceedBtn" disabled style="min-width: 500px;">
          ${t(lang, 'depot.continueButton')}
        </button>
      </div>
    </div>
  `

  const mapContainer = container.querySelector('#mapContainer')
  const depotDropdownContainer = container.querySelector('#depotDropdownContainer')
  const depotInfoCard = container.querySelector('#depotInfo')
  const depotName = container.querySelector('#depotName')
  const depotBadge = container.querySelector('#depotBadge')
  const depotAddress = container.querySelector('#depotAddress')
  const depotCode = container.querySelector('#depotCode')
  const backBtn = container.querySelector('#backBtn')
  const proceedBtn = container.querySelector('#proceedBtn')

  /**
   * Atualizar informações do depósito selecionado
   */
  const updateDepotInfo = (depot) => {
    if (!depot) {
      depotInfoCard.style.display = 'none'
      proceedBtn.disabled = true
      return
    }

    selectedDepot = depot

    // Atualizar card de informações
    depotName.textContent = depot.name
    depotBadge.textContent = depot.category || depot.code || 'Depot'
    depotAddress.textContent = depot.address
    depotCode.textContent = depot.code ? `Code: ${depot.code}` : ''

    // Mostrar card e habilitar botão
    depotInfoCard.style.display = 'block'
    proceedBtn.disabled = false

    // Sincronizar dropdown
    updateDepotDropdown(depot.id)
  }

  /**
   * Função para destacar depot no mapa sem fazer zoom
   * (mantém visualização geral de todos os depósitos)
   */
  const selectDepotOnMap = (depotId) => {
    if (!mapInstance) return

    const depot = DEPOTS.find(d => d.id === depotId)
    if (!depot) return

    // Nota: NÃO fazemos flyTo/zoom para manter a visualização geral do mapa
    // O mapa continua mostrando todos os depósitos, como na interface de referência
  }

  // Criar dropdown de depósitos
  const depotDropdown = createDepotDropdown({
    lang,
    selectedDepotId: selectedDepot?.id,
    onDepotSelect: (depot) => {
      console.log('Depot selecionado via dropdown:', depot)
      updateDepotInfo(depot)
      selectDepotOnMap(depot.id)
    }
  })

  depotDropdownContainer.appendChild(depotDropdown)

  /**
   * Inicializar mapa ou lista
   */
  const initializeDepotSelector = async () => {
    try {
      if (isMapboxAvailable()) {
        // Usar mapa interativo
        const mapData = await createMapboxDepotSelector({
          containerId: 'mapContainer',
          lang,
          onDepotSelect: (depot) => {
            console.log('Depósito selecionado:', depot)
            updateDepotInfo(depot)
          },
          depots: DEPOTS,
          selectedDepotId: formData.selectedDepot?.id
        })

        mapInstance = mapData.map

        // Se já tinha um depósito selecionado, mostrar info
        if (formData.selectedDepot) {
          const depot = DEPOTS.find(d => d.id === formData.selectedDepot.id)
          if (depot) {
            updateDepotInfo(depot)
          }
        }
      } else {
        // Fallback para lista
        console.warn('Mapbox não disponível, usando lista de depósitos')

        const list = createDepotList({
          lang,
          onDepotSelect: (depot) => {
            console.log('Depósito selecionado:', depot)
            updateDepotInfo(depot)
          },
          depots: DEPOTS,
          selectedDepotId: formData.selectedDepot?.id
        })

        mapContainer.innerHTML = ''
        mapContainer.appendChild(list)
        mapContainer.style.height = 'auto'

        // Se já tinha um depósito selecionado, mostrar info
        if (formData.selectedDepot) {
          const depot = DEPOTS.find(d => d.id === formData.selectedDepot.id)
          if (depot) {
            updateDepotInfo(depot)
          }
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar seletor de depósito:', error)

      // Fallback para lista em caso de erro
      const list = createDepotList({
        lang,
        onDepotSelect: (depot) => {
          console.log('Depósito selecionado:', depot)
          updateDepotInfo(depot)
        },
        depots: DEPOTS,
        selectedDepotId: formData.selectedDepot?.id
      })

      mapContainer.innerHTML = ''
      mapContainer.appendChild(list)
      mapContainer.style.height = 'auto'
    }
  }

  // Inicializar seletor
  initializeDepotSelector()

  // Event listener para botão Back
  backBtn.addEventListener('click', () => {
    // Limpar mapa antes de voltar
    if (mapInstance && mapInstance.remove) {
      mapInstance.remove()
    }

    if (onBack) {
      onBack()
    }
  })

  // Event listener para botão Proceed
  proceedBtn.addEventListener('click', async () => {
    if (!selectedDepot) {
      alert(t(lang, 'validation.required'))
      return
    }

    proceedBtn.disabled = true
    proceedBtn.textContent = t(lang, 'system.saving')

    try {
      // Salvar no localStorage (Step 2 vem antes do email ser coletado no Step 3)
      const savedData = JSON.parse(localStorage.getItem('sbl_form_data') || '{}')
      const updatedData = {
        ...savedData,
        selectedDepot: selectedDepot.name,
        depotCode: selectedDepot.code || selectedDepot.id,
        depotAddress: selectedDepot.address,
        depotCategory: selectedDepot.category,
        currentStep: 2,
        completedSteps: [...new Set([...(savedData.completedSteps || []), 2])]
      }

      localStorage.setItem('sbl_form_data', JSON.stringify(updatedData))
      console.log('💾 Depósito salvo localmente:', selectedDepot.name)

      // Limpar mapa antes de avançar
      if (mapInstance && mapInstance.remove) {
        mapInstance.remove()
      }

      if (onNext) {
        onNext({
          selectedDepot: selectedDepot.name,
          depotCode: selectedDepot.code || selectedDepot.id,
          depotAddress: selectedDepot.address,
          depotCategory: selectedDepot.category
        })
      }
    } catch (error) {
      console.error('Erro ao salvar depósito:', error)
      alert(t(lang, 'system.error'))
      proceedBtn.disabled = false
      proceedBtn.textContent = 'Proceed'
    }
  })
}

export default {
  renderDepotPage
}
