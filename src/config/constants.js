/**
 * Constantes do Projeto SBL Onboarding Form
 * Configurações globais e valores padrão
 */

// Informações da empresa
export const COMPANY = {
  NAME: 'Silva Brothers Logistics LTD',
  SHORT_NAME: 'SBL',
  LOGO_URL: '/assets/logo2.png', // Logo principal (logo.jpg disponível como alternativa)
  WEBSITE: 'https://sbl.zeritycloud.com'
}

// Cores do tema
export const COLORS = {
  PRIMARY: '#17A798',      // Teal/Turquesa principal
  PRIMARY_HOVER: '#148882', // Teal mais escuro
  SECONDARY: '#FFFFFF',     // Branco
  TEXT: '#333333',          // Cinza escuro
  INPUT_BG: '#F5F5F5',      // Cinza claro para inputs
  ERROR: '#E74C3C',         // Vermelho para erros
  SUCCESS: '#27AE60',       // Verde para sucesso
  WARNING: '#F39C12'        // Amarelo para avisos
}

// Steps do formulário (12 steps no total)
export const STEPS = {
  WELCOME: 1,           // Boas-vindas + Seleção de idioma
  DEPOT: 2,             // Seleção de depósito (Mapbox)
  CONTACT: 3,           // Dados de contato (Nome, Email, Telefone)
  CHAT: 4,              // Mensagem de chat
  PERSONAL_INFO: 5,     // Informações pessoais (Data nascimento, mãe, parente)
  ADDRESS_HISTORY: 6,   // Histórico de endereços (7 anos)
  ADDITIONAL_INFO: 7,   // Informações adicionais (NI, UTR, VAT)
  PROFILE_PHOTO: 8,     // Foto de perfil (selfie)
  DRIVING_LICENCE: 9,   // Carteira de motorista (frente/verso)
  BANK_DETAILS: 10,     // Dados bancários
  DOCUMENT_GUIDE: 11,   // Guia de documentos (GDPR)
  DOCUMENTS_UPLOAD: 12  // Upload de documentos (5 tipos)
}

// Nomes dos steps para exibição
export const STEP_NAMES = {
  1: 'welcome',
  2: 'depot',
  3: 'contact',
  4: 'chat',
  5: 'personal_info',
  6: 'address_history',
  7: 'additional_info',
  8: 'profile_photo',
  9: 'driving_licence',
  10: 'bank_details',
  11: 'document_guide',
  12: 'documents_upload'
}

// Total de steps (sem contar o step de boas-vindas)
export const TOTAL_STEPS = 11

// Idiomas suportados
export const LANGUAGES = {
  PT_BR: 'pt-BR',
  EN: 'en',
  BG: 'bg',
  RO: 'ro'
}

// Lista de idiomas para seletor
export const LANGUAGE_OPTIONS = [
  { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'bg', label: 'Български', flag: '🇧🇬' },
  { code: 'ro', label: 'Română', flag: '🇷🇴' }
]

// Idioma padrão
export const DEFAULT_LANGUAGE = LANGUAGES.PT_BR

// Depósitos disponíveis
export const DEPOTS = [
  {
    id: 'depot-1',
    name: 'London Central',
    address: '123 Main Street, London, UK',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    type: 'main',
    phone: '+44 20 1234 5678',
    hours: 'Mon-Fri: 8:00-18:00'
  },
  {
    id: 'depot-2',
    name: 'Manchester North',
    address: '456 North Road, Manchester, UK',
    coordinates: { lat: 53.4808, lng: -2.2426 },
    type: 'regional',
    phone: '+44 161 123 4567',
    hours: 'Mon-Fri: 9:00-17:00'
  },
  {
    id: 'depot-3',
    name: 'Birmingham South',
    address: '789 South Avenue, Birmingham, UK',
    coordinates: { lat: 52.4862, lng: -1.8904 },
    type: 'regional',
    phone: '+44 121 234 5678',
    hours: 'Mon-Fri: 9:00-17:00'
  }
]

// Configuração de validação
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 20,
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 100,
  MESSAGE_MAX_LENGTH: 500,

  // UK-specific validations
  NI_NUMBER_REGEX: /^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/i,
  UTR_NUMBER_REGEX: /^[0-9]{10}$/,
  VAT_NUMBER_REGEX: /^(GB)?([0-9]{9}([0-9]{3})?|[A-Z]{2}[0-9]{3})$/i,
  SORT_CODE_REGEX: /^[0-9]{2}-?[0-9]{2}-?[0-9]{2}$/,
  ACCOUNT_NUMBER_REGEX: /^[0-9]{8}$/,
  UK_POSTCODE_REGEX: /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i,

  // File upload limits
  MAX_FILE_SIZE_MB: 10,
  MAX_PHOTO_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
}

// Tipos de documentos para upload (Step 12)
export const DOCUMENT_TYPES = {
  RIGHT_TO_WORK: 'right_to_work',
  PROOF_OF_ADDRESS: 'proof_of_address',
  NATIONAL_INSURANCE: 'national_insurance',
  BANK_STATEMENT: 'bank_statement',
  VAT_CERTIFICATE: 'vat_certificate'
}

// Labels dos documentos
export const DOCUMENT_LABELS = {
  [DOCUMENT_TYPES.RIGHT_TO_WORK]: 'Right to Work in UK',
  [DOCUMENT_TYPES.PROOF_OF_ADDRESS]: 'Proof of Address',
  [DOCUMENT_TYPES.NATIONAL_INSURANCE]: 'National Insurance Document',
  [DOCUMENT_TYPES.BANK_STATEMENT]: 'Bank Statement',
  [DOCUMENT_TYPES.VAT_CERTIFICATE]: 'VAT Certificate (optional)'
}

// Mensagens de erro padrão (em português - outros idiomas em translations.js)
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_EMAIL: 'Email inválido',
  INVALID_PHONE: 'Telefone inválido',
  NAME_TOO_SHORT: 'Nome muito curto',
  NAME_TOO_LONG: 'Nome muito longo',
  MESSAGE_TOO_LONG: 'Mensagem muito longa',
  NETWORK_ERROR: 'Erro de conexão. Tente novamente.',
  SAVE_ERROR: 'Erro ao salvar. Tente novamente.',

  // UK-specific validation errors
  INVALID_NI_NUMBER: 'Número de National Insurance inválido (formato: XX 999999 X)',
  INVALID_UTR: 'Número UTR inválido (10 dígitos)',
  INVALID_VAT: 'Número VAT inválido',
  INVALID_SORT_CODE: 'Sort Code inválido (formato: XX-XX-XX)',
  INVALID_ACCOUNT_NUMBER: 'Número de conta inválido (8 dígitos)',
  INVALID_POSTCODE: 'Postcode inválido',
  INVALID_DATE: 'Data inválida',
  AGE_REQUIREMENT: 'Você deve ter pelo menos 18 anos',

  // File upload errors
  FILE_TOO_LARGE: 'Arquivo muito grande (máximo: {size}MB)',
  INVALID_FILE_TYPE: 'Tipo de arquivo não permitido',
  UPLOAD_FAILED: 'Falha no upload. Tente novamente.'
}

// Configuração de auto-save
export const AUTO_SAVE = {
  ENABLED: true,
  DEBOUNCE_MS: 1000, // Espera 1 segundo após última alteração
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 2000
}

// Configuração de abandono
export const ABANDONMENT = {
  TRACK_ENABLED: true,
  INACTIVITY_TIMEOUT_MS: 300000, // 5 minutos
  BEFORE_UNLOAD_ENABLED: true
}

// URLs de API e webhooks
export const API_URLS = {
  N8N_WEBHOOK: import.meta.env.VITE_N8N_WEBHOOK_URL || '',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  IP_SERVICE: 'https://api.ipify.org?format=json'
}

// Configuração de breakpoints responsivos
export const BREAKPOINTS = {
  MOBILE: 320,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1440
}

// Animações
export const ANIMATIONS = {
  TRANSITION_DURATION: '0.3s',
  EASE: 'ease-in-out'
}

// Local Storage keys
export const STORAGE_KEYS = {
  FORM_DATA: 'sbl_form_data',
  CURRENT_STEP: 'sbl_current_step',
  LANGUAGE: 'sbl_language',
  USER_EMAIL: 'sbl_user_email'
}

// Configuração de mapa (MapLibre GL JS com OpenStreetMap)
// MapLibre é 100% gratuito e não requer API key! 🎉
export const MAP_CONFIG = {
  DEFAULT_CENTER: [-1.4, 51.1], // UK center [lng, lat]
  DEFAULT_ZOOM: 6,
  MARKER_COLOR: COLORS.PRIMARY,
  // Estilo OpenStreetMap gratuito
  // Usando estilo básico do OSM liberty
  STYLE: {
    version: 8,
    sources: {
      'osm': {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors'
      }
    },
    layers: [{
      id: 'osm',
      type: 'raster',
      source: 'osm',
      minzoom: 0,
      maxzoom: 19
    }]
  },
  // Mapbox token não é mais necessário (mantido para compatibilidade)
  MAPBOX_TOKEN: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || ''
}

// Configuração de Storage Supabase
export const STORAGE_CONFIG = {
  BUCKET_NAME: 'form-documents',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  PATHS: {
    PROFILE_PHOTOS: 'profile-photos',
    DRIVING_LICENCES: 'driving-licences',
    DOCUMENTS: 'documents'
  }
}

export default {
  COMPANY,
  COLORS,
  STEPS,
  STEP_NAMES,
  TOTAL_STEPS,
  LANGUAGES,
  LANGUAGE_OPTIONS,
  DEFAULT_LANGUAGE,
  DEPOTS,
  VALIDATION,
  DOCUMENT_TYPES,
  DOCUMENT_LABELS,
  ERROR_MESSAGES,
  AUTO_SAVE,
  ABANDONMENT,
  API_URLS,
  BREAKPOINTS,
  ANIMATIONS,
  STORAGE_KEYS,
  MAP_CONFIG,
  STORAGE_CONFIG
}
