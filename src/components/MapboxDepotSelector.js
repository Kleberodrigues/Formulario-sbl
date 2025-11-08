/**
 * Componente MapLibreDepotSelector
 * Mapa interativo para seleção de depósito usando MapLibre GL JS
 * MapLibre é um fork open-source do Mapbox GL JS - 100% gratuito
 */

import { MAP_CONFIG, DEPOTS } from '../config/constants.js'
import { t } from '../utils/translations.js'

// Importar MapLibre será feito dinamicamente ou via CDN
// import maplibregl from 'maplibre-gl'

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

  // Verificar se MapLibre GL JS está carregado
  if (typeof maplibregl === 'undefined') {
    throw new Error('MapLibre GL JS not loaded. Please include the library in your HTML.')
  }

  const container = document.getElementById(containerId)
  if (!container) {
    throw new Error(`Container with id "${containerId}" not found`)
  }

  // MapLibre não precisa de token! 🎉

  // Criar container do mapa
  const mapContainer = document.createElement('div')
  mapContainer.id = `${containerId}-map`
  mapContainer.className = 'mapbox-map-container'
  mapContainer.style.width = '100%'
  mapContainer.style.height = '500px'

  container.appendChild(mapContainer)

  // Inicializar mapa
  const map = new maplibregl.Map({
    container: mapContainer.id,
    style: MAP_CONFIG.STYLE,
    center: MAP_CONFIG.DEFAULT_CENTER,
    zoom: MAP_CONFIG.DEFAULT_ZOOM
  })

  // Adicionar controles de navegação
  map.addControl(new maplibregl.NavigationControl(), 'top-right')

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

    // Criar popup com ID único
    const popupId = `popup-${depot.id}`
    const popup = new maplibregl.Popup({ offset: 25, closeButton: false })
      .setHTML(`
        <div class="depot-popup" style="min-width: 200px;">
          <h4 class="depot-popup-title" style="margin: 0 0 8px 0; color: #17A798; font-size: 16px;">${depot.name}</h4>
          <p class="depot-popup-address" style="margin: 0 0 8px 0; color: #666; font-size: 12px;">${depot.address}</p>
          ${depot.code ? `<p style="margin: 0 0 12px 0; color: #333; font-size: 11px; font-weight: 600;">Code: ${depot.code}</p>` : ''}
          <button
            class="depot-select-btn"
            data-depot-id="${depot.id}"
            style="width: 100%; padding: 8px 16px; background: #17A798; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600;"
            onmouseover="this.style.background='#148882'"
            onmouseout="this.style.background='#17A798'"
          >
            Selecionar
          </button>
        </div>
      `)

    // Criar marker
    const marker = new maplibregl.Marker(el)
      .setLngLat([depot.coordinates.lng, depot.coordinates.lat])
      .setPopup(popup)
      .addTo(map)

    markers.push({ marker, depot, el, popup })

    // Event listener para o marker - abre popup
    el.addEventListener('click', (e) => {
      e.stopPropagation()
      // Fechar outros popups
      markers.forEach(m => {
        if (m.marker !== marker && m.marker.getPopup().isOpen()) {
          m.marker.togglePopup()
        }
      })
      // Abrir/fechar este popup
      marker.togglePopup()
    })

    // Quando o popup abrir, adicionar event listener ao botão
    popup.on('open', () => {
      // Pequeno delay para garantir que o DOM foi atualizado
      setTimeout(() => {
        const btn = document.querySelector(`[data-depot-id="${depot.id}"]`)
        if (btn) {
          // Remover listener antigo se existir
          const newBtn = btn.cloneNode(true)
          btn.parentNode.replaceChild(newBtn, btn)

          // Adicionar novo listener
          newBtn.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('Depósito clicado:', depot.name)
            selectDepot(depot)
            marker.togglePopup()
          })
        }
      }, 50)
    })
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
 * Verificar se MapLibre GL JS está disponível
 * @returns {boolean}
 */
export function isMapLibreAvailable() {
  return typeof maplibregl !== 'undefined'
}

// Alias para compatibilidade
export const isMapboxAvailable = isMapLibreAvailable

export default {
  createMapboxDepotSelector,
  createDepotList,
  isMapLibreAvailable,
  isMapboxAvailable // mantido para compatibilidade
}
