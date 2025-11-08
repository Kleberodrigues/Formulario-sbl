/**
 * Funções Auxiliares - SBL Onboarding Form
 * Utilitários gerais para manipulação de dados
 */

// ====================================
// Formatação de Dados
// ====================================

/**
 * Formata telefone para formato internacional
 * @param {string} phone - Telefone sem formatação
 * @returns {string} - Telefone formatado
 * @example formatPhone('44123456789') → '+44 123 456 789'
 */
export function formatPhone(phone) {
  if (!phone) return '';

  // Remove tudo que não é número
  const cleaned = phone.replace(/\D/g, '');

  // UK format
  if (cleaned.startsWith('44')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }

  // Generic international format
  return `+${cleaned}`;
}

/**
 * Formata Sort Code para formato UK (XX-XX-XX)
 * @param {string} sortCode - Sort code sem formatação
 * @returns {string} - Sort code formatado
 * @example formatSortCode('123456') → '12-34-56'
 */
export function formatSortCode(sortCode) {
  if (!sortCode) return '';

  const cleaned = sortCode.replace(/\D/g, '');

  if (cleaned.length !== 6) return sortCode;

  return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 6)}`;
}

/**
 * Formata National Insurance Number (UK)
 * @param {string} ni - NI Number sem formatação
 * @returns {string} - NI Number formatado
 * @example formatNINumber('QQ123456C') → 'QQ 12 34 56 C'
 */
export function formatNINumber(ni) {
  if (!ni) return '';

  const cleaned = ni.replace(/\s/g, '').toUpperCase();

  if (cleaned.length !== 9) return ni;

  return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
}

/**
 * Formata data para formato brasileiro (DD/MM/YYYY)
 * @param {string|Date} date - Data
 * @returns {string} - Data formatada
 */
export function formatDateBR(date) {
  if (!date) return '';

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Formata data para formato UK (DD/MM/YYYY)
 * @param {string|Date} date - Data
 * @returns {string} - Data formatada
 */
export function formatDateUK(date) {
  if (!date) return '';

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Formata data para ISO (YYYY-MM-DD)
 * @param {string|Date} date - Data
 * @returns {string} - Data ISO
 */
export function formatDateISO(date) {
  if (!date) return '';

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${year}-${month}-${day}`;
}

// ====================================
// Manipulação de Strings
// ====================================

/**
 * Capitaliza primeira letra de cada palavra
 * @param {string} str - String
 * @returns {string} - String capitalizada
 * @example capitalize('joão silva') → 'João Silva'
 */
export function capitalize(str) {
  if (!str) return '';

  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Remove acentos de uma string
 * @param {string} str - String com acentos
 * @returns {string} - String sem acentos
 */
export function removeAccents(str) {
  if (!str) return '';

  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Trunca texto com reticências
 * @param {string} text - Texto
 * @param {number} maxLength - Comprimento máximo
 * @returns {string} - Texto truncado
 */
export function truncate(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;

  return text.slice(0, maxLength) + '...';
}

// ====================================
// Manipulação de Arrays e Objetos
// ====================================

/**
 * Remove duplicatas de array
 * @param {Array} arr - Array
 * @returns {Array} - Array sem duplicatas
 */
export function unique(arr) {
  return [...new Set(arr)];
}

/**
 * Agrupa array por propriedade
 * @param {Array} arr - Array de objetos
 * @param {string} key - Chave para agrupar
 * @returns {Object} - Objeto agrupado
 */
export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {});
}

/**
 * Ordena array de objetos por propriedade
 * @param {Array} arr - Array de objetos
 * @param {string} key - Chave para ordenar
 * @param {string} order - 'asc' ou 'desc'
 * @returns {Array} - Array ordenado
 */
export function sortBy(arr, key, order = 'asc') {
  return arr.sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Remove campos vazios de objeto
 * @param {Object} obj - Objeto
 * @returns {Object} - Objeto sem campos vazios
 */
export function removeEmpty(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) =>
      v !== null && v !== undefined && v !== ''
    )
  );
}

// ====================================
// Manipulação de Datas
// ====================================

/**
 * Calcula idade a partir da data de nascimento
 * @param {string|Date} birthDate - Data de nascimento
 * @returns {number} - Idade em anos
 */
export function calculateAge(birthDate) {
  if (!birthDate) return 0;

  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Calcula diferença em dias entre duas datas
 * @param {string|Date} date1 - Data 1
 * @param {string|Date} date2 - Data 2
 * @returns {number} - Diferença em dias
 */
export function daysDifference(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d1 - d2);

  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Verifica se data é futura
 * @param {string|Date} date - Data
 * @returns {boolean} - True se for futura
 */
export function isFutureDate(date) {
  return new Date(date) > new Date();
}

/**
 * Adiciona dias a uma data
 * @param {string|Date} date - Data
 * @param {number} days - Dias a adicionar
 * @returns {Date} - Nova data
 */
export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// ====================================
// Manipulação de Arquivos
// ====================================

/**
 * Formata tamanho de arquivo para leitura humana
 * @param {number} bytes - Tamanho em bytes
 * @returns {string} - Tamanho formatado
 * @example formatFileSize(1024) → '1 KB'
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Obtém extensão de arquivo
 * @param {string} filename - Nome do arquivo
 * @returns {string} - Extensão
 */
export function getFileExtension(filename) {
  if (!filename) return '';

  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
}

/**
 * Verifica se arquivo é imagem
 * @param {string} filename - Nome do arquivo
 * @returns {boolean} - True se for imagem
 */
export function isImage(filename) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  return imageExtensions.includes(getFileExtension(filename));
}

/**
 * Verifica se arquivo é PDF
 * @param {string} filename - Nome do arquivo
 * @returns {boolean} - True se for PDF
 */
export function isPDF(filename) {
  return getFileExtension(filename) === 'pdf';
}

/**
 * Gera nome de arquivo único com timestamp
 * @param {string} filename - Nome original
 * @returns {string} - Nome único
 */
export function generateUniqueFilename(filename) {
  const timestamp = Date.now();
  const extension = getFileExtension(filename);
  const nameWithoutExt = filename.replace(`.${extension}`, '');

  return `${nameWithoutExt}-${timestamp}.${extension}`;
}

// ====================================
// Utilitários de URL
// ====================================

/**
 * Extrai parâmetros de query string
 * @param {string} url - URL
 * @returns {Object} - Objeto com parâmetros
 */
export function getQueryParams(url = window.location.search) {
  return Object.fromEntries(new URLSearchParams(url));
}

/**
 * Adiciona parâmetros a URL
 * @param {string} url - URL base
 * @param {Object} params - Parâmetros
 * @returns {string} - URL com parâmetros
 */
export function addQueryParams(url, params) {
  const urlObj = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value);
  });
  return urlObj.toString();
}

// ====================================
// Debounce e Throttle
// ====================================

/**
 * Debounce - Executa função após delay
 * @param {Function} func - Função
 * @param {number} wait - Delay em ms
 * @returns {Function} - Função debounced
 */
export function debounce(func, wait = 300) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle - Limita execuções por período
 * @param {Function} func - Função
 * @param {number} limit - Limite em ms
 * @returns {Function} - Função throttled
 */
export function throttle(func, limit = 300) {
  let inThrottle;

  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ====================================
// Utilitários de Storage
// ====================================

/**
 * Salva dados no localStorage com JSON
 * @param {string} key - Chave
 * @param {*} value - Valor
 */
export function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Recupera dados do localStorage
 * @param {string} key - Chave
 * @param {*} defaultValue - Valor padrão
 * @returns {*} - Valor armazenado ou padrão
 */
export function getStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
}

/**
 * Remove item do localStorage
 * @param {string} key - Chave
 */
export function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

/**
 * Limpa todo o localStorage
 */
export function clearStorage() {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

// ====================================
// Utilitários de Navegação
// ====================================

/**
 * Redireciona para URL
 * @param {string} url - URL
 */
export function redirect(url) {
  window.location.href = url;
}

/**
 * Recarrega página
 */
export function reload() {
  window.location.reload();
}

/**
 * Abre URL em nova aba
 * @param {string} url - URL
 */
export function openInNewTab(url) {
  window.open(url, '_blank');
}

// ====================================
// Utilitários de Criptografia Simples
// ====================================

/**
 * Ofusca string (NÃO É CRIPTOGRAFIA SEGURA)
 * Use apenas para ofuscação visual, não para segurança
 * @param {string} str - String
 * @returns {string} - String ofuscada
 */
export function obfuscate(str) {
  if (!str) return '';
  return btoa(str);
}

/**
 * Desofusca string
 * @param {string} str - String ofuscada
 * @returns {string} - String original
 */
export function deobfuscate(str) {
  if (!str) return '';
  try {
    return atob(str);
  } catch {
    return '';
  }
}

// ====================================
// Utilitários de Logs
// ====================================

/**
 * Log colorido para desenvolvimento
 * @param {string} message - Mensagem
 * @param {string} type - Tipo (info|success|warning|error)
 */
export function devLog(message, type = 'info') {
  if (import.meta.env.PROD) return; // Não loga em produção

  const colors = {
    info: 'color: #17A798',
    success: 'color: #27AE60',
    warning: 'color: #F39C12',
    error: 'color: #E74C3C'
  };

  console.log(`%c[SBL] ${message}`, colors[type] || colors.info);
}

// ====================================
// Exportar todas as funções
// ====================================

export default {
  // Formatação
  formatPhone,
  formatSortCode,
  formatNINumber,
  formatDateBR,
  formatDateUK,
  formatDateISO,

  // Strings
  capitalize,
  removeAccents,
  truncate,

  // Arrays e Objetos
  unique,
  groupBy,
  sortBy,
  removeEmpty,

  // Datas
  calculateAge,
  daysDifference,
  isFutureDate,
  addDays,

  // Arquivos
  formatFileSize,
  getFileExtension,
  isImage,
  isPDF,
  generateUniqueFilename,

  // URL
  getQueryParams,
  addQueryParams,

  // Debounce/Throttle
  debounce,
  throttle,

  // Storage
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,

  // Navegação
  redirect,
  reload,
  openInNewTab,

  // Ofuscação
  obfuscate,
  deobfuscate,

  // Logs
  devLog
};
