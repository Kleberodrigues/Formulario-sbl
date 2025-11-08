/**
 * DepotPage - Step 2
 * Página de seleção de depósito com Mapbox
 */

import { t } from '../utils/translations.js'
import { createMapboxDepotSelector, createDepotList, isMapboxAvailable } from '../components/MapboxDepotSelector.js'
import { saveFormStep } from '../services/supabaseService.js'
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

  let selectedDepot = formData.selectedDepot || null
  let mapInstance = null

  container.innerHTML = `
    <div class="form-page depot-page">
      <div class="form-header">
        <h2 class="form-title">${t(lang, 'depot.title')}</h2>
        <p class="form-subtitle">${t(lang, 'depot.subtitle')}</p>
      </div>

      <div class="form-content">
        <!-- Map Container -->
        <div id="mapContainer" class="map-container" style="height: 400px; border-radius: 8px; overflow: hidden;"></div>

        <!-- Depot Info Card (Hidden until selection) -->
        <div id="depotInfo" class="depot-info-card" style="display: none;">
          <div class="depot-info-header">
            <h3 id="depotName" class="depot-name"></h3>
            <span id="depotBadge" class="depot-badge"></span>
          </div>
          <p id="depotAddress" class="depot-address"></p>
          <div class="depot-details">
            <div class="depot-detail">
              <span class="detail-icon">📞</span>
              <span id="depotPhone" class="detail-text"></span>
            </div>
            <div class="depot-detail">
              <span class="detail-icon">🕒</span>
              <span id="depotHours" class="detail-text"></span>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" id="backBtn">
            ${t(lang, 'depot.backButton')}
          </button>
          <button type="button" class="btn btn-primary" id="continueBtn" disabled>
            ${t(lang, 'depot.continueButton')}
          </button>
        </div>
      </div>
    </div>
  `

  const mapContainer = container.querySelector('#mapContainer')
  const depotInfoCard = container.querySelector('#depotInfo')
  const depotName = container.querySelector('#depotName')
  const depotBadge = container.querySelector('#depotBadge')
  const depotAddress = container.querySelector('#depotAddress')
  const depotPhone = container.querySelector('#depotPhone')
  const depotHours = container.querySelector('#depotHours')
  const backBtn = container.querySelector('#backBtn')
  const continueBtn = container.querySelector('#continueBtn')

  /**
   * Atualizar informações do depósito selecionado
   */
  const updateDepotInfo = (depot) => {
    if (!depot) {
      depotInfoCard.style.display = 'none'
      continueBtn.disabled = true
      return
    }

    selectedDepot = depot

    // Atualizar card de informações
    depotName.textContent = t(lang, depot.nameKey) || depot.name
    depotBadge.textContent = depot.type === 'main' ? t(lang, 'depot.mainDepot') : t(lang, 'depot.regionalDepot')
    depotBadge.className = `depot-badge depot-badge-${depot.type}`
    depotAddress.textContent = depot.address
    depotPhone.textContent = depot.phone
    depotHours.textContent = depot.hours

    // Mostrar card e habilitar botão
    depotInfoCard.style.display = 'block'
    continueBtn.disabled = false
  }

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

  // Event listeners
  backBtn.addEventListener('click', () => {
    // Limpar mapa se houver
    if (mapInstance && mapInstance.remove) {
      mapInstance.remove()
    }

    if (onBack) onBack()
  })

  continueBtn.addEventListener('click', async () => {
    if (!selectedDepot) {
      alert(t(lang, 'validation.required'))
      return
    }

    continueBtn.disabled = true
    continueBtn.textContent = t(lang, 'system.saving')

    try {
      // Salvar no Supabase
      await saveFormStep(formData.email, 2, {
        selected_depot: selectedDepot.id,
        depot_name: selectedDepot.name,
        depot_address: selectedDepot.address,
        depot_type: selectedDepot.type
      })

      // Limpar mapa antes de avançar
      if (mapInstance && mapInstance.remove) {
        mapInstance.remove()
      }

      if (onNext) {
        onNext({
          selectedDepot: selectedDepot.id,
          depotAddress: selectedDepot.address,
          depotName: selectedDepot.name,
          depotType: selectedDepot.type
        })
      }
    } catch (error) {
      console.error('Erro ao salvar depósito:', error)
      alert(t(lang, 'system.error'))
      continueBtn.disabled = false
      continueBtn.textContent = t(lang, 'depot.continueButton')
    }
  })
}

export default {
  renderDepotPage
}
