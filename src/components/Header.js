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
    <div class="header-gradient">
      <p class="header-label">You are joining:</p>
      <h1 class="header-title">${COMPANY.NAME}</h1>
    </div>
    <div class="header-logo-circle">
      <img
        src="${COMPANY.LOGO_URL}"
        alt="${COMPANY.NAME}"
        class="logo-circle-image"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
      />
      <div class="logo-circle-fallback" style="display: none;">
        <span class="logo-circle-text">${COMPANY.SHORT_NAME}</span>
      </div>
    </div>
  `

  return header
}

export default {
  renderHeader,
  createHeader
}
