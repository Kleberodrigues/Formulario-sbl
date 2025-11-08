/**
 * Componente MapboxDepotSelector
 * Mapa interativo para seleção de depósito usando Mapbox GL JS
 */

import { MAP_CONFIG, DEPOTS } from '../config/constants.js'
import { t } from '../utils/translations.js'

// Importar Mapbox será feito dinamicamente ou via CDN
// import mapboxgl from 'mapbox-gl'

/**
 * Criar mapa de seleção de depósito
 * @param {object} options - Configurações
 * @param {string} options.containerId - ID do container do mapa
 * @param {string} options.lang - Idioma atual
 * @param {function} options.onDepotSelect - Callback quando depósito é selecionado
 * @param {object[]} options.depots - Lista de depósitos (opcional, usa DEPOTS por padrão)
 * @param {string} options.selectedDepotId - ID do depósito pré-selecionado
 * @returns {Promise<object>} Retorna objeto com map e métodos
 */
export async function createMapboxDepotSelector(options) {
  const {
    containerId,
    lang = 'pt-BR',
    onDepotSelect = null,
    depots = DEPOTS,
    selectedDepotId = null
  } = options

  // Verificar se Mapbox GL JS está carregado
  if (typeof mapboxgl === 'undefined') {
    throw new Error('Mapbox GL JS not loaded. Please include the library in your HTML.')
  }

  const container = document.getElementById(containerId)
  if (!container) {
    throw new Error(`Container with id "${containerId}" not found`)
  }

  // Verificar token
  if (!MAP_CONFIG.MAPBOX_TOKEN) {
    throw new Error('Mapbox access token not configured. Set VITE_MAPBOX_ACCESS_TOKEN in .env')
  }

  mapboxgl.accessToken = MAP_CONFIG.MAPBOX_TOKEN

  // Criar container do mapa
  const mapContainer = document.createElement('div')
  mapContainer.id = `${containerId}-map`
  mapContainer.className = 'mapbox-map-container'
  mapContainer.style.width = '100%'
  mapContainer.style.height = '500px'

  container.appendChild(mapContainer)

  // Inicializar mapa
  const map = new mapboxgl.Map({
    container: mapContainer.id,
    style: MAP_CONFIG.STYLE,
    center: MAP_CONFIG.DEFAULT_CENTER,
    zoom: MAP_CONFIG.DEFAULT_ZOOM
  })

  // Adicionar controles de navegação
  map.addControl(new mapboxgl.NavigationControl(), 'top-right')

  // Array para armazenar markers
  const markers = []

  // Variável para armazenar depósito selecionado
  let selectedDepot = null

  // Adicionar markers para cada depósito
  depots.forEach((depot) => {
    // Criar elemento customizado do marker
    const el = document.createElement('div')
    el.className = 'depot-marker'
    el.style.width = '40px'
    el.style.height = '40px'
    el.style.borderRadius = '50%'
    el.style.backgroundColor = MAP_CONFIG.MARKER_COLOR
    el.style.border = '3px solid white'
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'
    el.style.cursor = 'pointer'
    el.style.display = 'flex'
    el.style.alignItems = 'center'
    el.style.justifyContent = 'center'
    el.style.fontSize = '20px'
    el.innerHTML = '📍'

    // Se é o depósito selecionado
    if (depot.id === selectedDepotId) {
      el.classList.add('depot-marker-selected')
      el.style.backgroundColor = '#148882' // Cor mais escura
      selectedDepot = depot
    }

    // Criar popup
    const popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML(`
        <div class="depot-popup">
          <h4 class="depot-popup-title">${depot.name}</h4>
          <p class="depot-popup-address">${depot.address}</p>
          <button
            class="btn btn-primary btn-sm depot-select-btn"
            data-depot-id="${depot.id}"
          >
            ${t(lang, 'depot.selectDepot')}
          </button>
        </div>
      `)

    // Criar marker
    const marker = new mapboxgl.Marker(el)
      .setLngLat([depot.coordinates.lng, depot.coordinates.lat])
      .setPopup(popup)
      .addTo(map)

    markers.push({ marker, depot, el })

    // Event listener para o marker
    el.addEventListener('click', () => {
      // Abrir popup
      marker.togglePopup()
    })
  })

  // Event delegation para botões de seleção nos popups
  map.on('click', (e) => {
    // Verificar se clicou em botão de seleção
    const target = e.originalEvent.target
    if (target.classList.contains('depot-select-btn')) {
      const depotId = target.dataset.depotId
      const depot = depots.find(d => d.id === depotId)

      if (depot) {
        selectDepot(depot)
      }
    }
  })

  /**
   * Selecionar um depósito
   * @param {object} depot - Depósito selecionado
   */
  function selectDepot(depot) {
    // Atualizar selectedDepot
    selectedDepot = depot

    // Atualizar visual dos markers
    markers.forEach(({ marker, depot: d, el }) => {
      if (d.id === depot.id) {
        el.classList.add('depot-marker-selected')
        el.style.backgroundColor = '#148882'
      } else {
        el.classList.remove('depot-marker-selected')
        el.style.backgroundColor = MAP_CONFIG.MARKER_COLOR
      }
    })

    // Fechar todos os popups
    markers.forEach(({ marker }) => {
      if (marker.getPopup().isOpen()) {
        marker.togglePopup()
      }
    })

    // Callback
    if (onDepotSelect) {
      onDepotSelect(depot)
    }

    // Centralizar mapa no depósito
    map.flyTo({
      center: [depot.coordinates.lng, depot.coordinates.lat],
      zoom: 12,
      essential: true
    })
  }

  /**
   * Obter depósito atualmente selecionado
   * @returns {object|null}
   */
  function getSelectedDepot() {
    return selectedDepot
  }

  /**
   * Selecionar depósito programaticamente
   * @param {string} depotId - ID do depósito
   */
  function selectDepotById(depotId) {
    const depot = depots.find(d => d.id === depotId)
    if (depot) {
      selectDepot(depot)
    }
  }

  /**
   * Destruir mapa e limpar recursos
   */
  function destroy() {
    markers.forEach(({ marker }) => marker.remove())
    map.remove()
    mapContainer.remove()
  }

  // Aguardar mapa carregar
  await new Promise((resolve) => {
    map.on('load', resolve)
  })

  // Retornar objeto com métodos públicos
  return {
    map,
    getSelectedDepot,
    selectDepotById,
    destroy
  }
}

/**
 * Criar lista de depósitos (alternativa sem mapa)
 * @param {object} options - Configurações
 * @param {string} options.lang - Idioma
 * @param {function} options.onDepotSelect - Callback de seleção
 * @param {object[]} options.depots - Lista de depósitos
 * @param {string} options.selectedDepotId - ID pré-selecionado
 * @returns {HTMLElement}
 */
export function createDepotList(options) {
  const {
    lang = 'pt-BR',
    onDepotSelect = null,
    depots = DEPOTS,
    selectedDepotId = null
  } = options

  const container = document.createElement('div')
  container.className = 'depot-list'

  depots.forEach((depot) => {
    const item = document.createElement('div')
    item.className = 'depot-list-item'
    item.dataset.depotId = depot.id

    if (depot.id === selectedDepotId) {
      item.classList.add('depot-list-item-selected')
    }

    item.innerHTML = `
      <div class="depot-list-item-icon">📍</div>
      <div class="depot-list-item-content">
        <h4 class="depot-list-item-title">${depot.name}</h4>
        <p class="depot-list-item-address">${depot.address}</p>
      </div>
      <div class="depot-list-item-action">
        <button
          type="button"
          class="btn btn-primary btn-sm"
          data-depot-id="${depot.id}"
        >
          ${t(lang, 'depot.selectDepot')}
        </button>
      </div>
    `

    // Event listener
    const selectBtn = item.querySelector('button')
    selectBtn.addEventListener('click', () => {
      // Remover seleção anterior
      container.querySelectorAll('.depot-list-item').forEach(el => {
        el.classList.remove('depot-list-item-selected')
      })

      // Adicionar seleção
      item.classList.add('depot-list-item-selected')

      // Callback
      if (onDepotSelect) {
        onDepotSelect(depot)
      }
    })

    container.appendChild(item)
  })

  return container
}

/**
 * Verificar se Mapbox GL JS está disponível
 * @returns {boolean}
 */
export function isMapboxAvailable() {
  return typeof mapboxgl !== 'undefined' && !!MAP_CONFIG.MAPBOX_TOKEN
}

export default {
  createMapboxDepotSelector,
  createDepotList,
  isMapboxAvailable
}
