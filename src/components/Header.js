/**
 * Componente Header
 * Cabeçalho com logo da empresa Silva Brothers Logistics
 */

import { COMPANY } from '../config/constants.js'

/**
 * Renderizar header com logo
 * @param {HTMLElement} container - Container onde será renderizado
 */
export function renderHeader(container) {
  const header = document.createElement('header')
  header.className = 'sbl-header'

  header.innerHTML = `
    <div class="header-container">
      <div class="logo-wrapper">
        <img
          src="${COMPANY.LOGO_URL}"
          alt="${COMPANY.NAME}"
          class="company-logo"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
        />
        <div class="logo-fallback" style="display: none;">
          <h1 class="company-name">${COMPANY.SHORT_NAME}</h1>
        </div>
      </div>
    </div>
  `

  container.appendChild(header)
}

/**
 * Criar elemento de header (sem inserir no DOM)
 * @returns {HTMLElement}
 */
export function createHeader() {
  const header = document.createElement('header')
  header.className = 'sbl-header'

  header.innerHTML = `
    <div class="header-container">
      <div class="logo-wrapper">
        <img
          src="${COMPANY.LOGO_URL}"
          alt="${COMPANY.NAME}"
          class="company-logo"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
        />
        <div class="logo-fallback" style="display: none;">
          <h1 class="company-name">${COMPANY.SHORT_NAME}</h1>
        </div>
      </div>
    </div>
  `

  return header
}

export default {
  renderHeader,
  createHeader
}
