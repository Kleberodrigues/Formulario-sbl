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

// Steps do formulário (11 steps no total - removido Chat)
export const STEPS = {
  WELCOME: 1,           // Boas-vindas + Seleção de idioma
  DEPOT: 2,             // Seleção de depósito (MapLibre)
  CONTACT: 3,           // Dados de contato (Nome, Email, Telefone)
  PERSONAL_INFO: 4,     // Informações pessoais (Data nascimento, mãe, parente)
  ADDRESS_HISTORY: 5,   // Histórico de endereços (7 anos)
  ADDITIONAL_INFO: 6,   // Informações adicionais (NI, UTR, VAT)
  PROFILE_PHOTO: 7,     // Foto de perfil (selfie)
  DRIVING_LICENCE: 8,   // Carteira de motorista (frente/verso)
  BANK_DETAILS: 9,      // Dados bancários
  DOCUMENT_GUIDE: 10,   // Guia de documentos (GDPR)
  DOCUMENTS_UPLOAD: 11  // Upload de documentos (5 tipos)
}

// Nomes dos steps para exibição
export const STEP_NAMES = {
  1: 'welcome',
  2: 'depot',
  3: 'contact',
  4: 'personal_info',
  5: 'address_history',
  6: 'additional_info',
  7: 'profile_photo',
  8: 'driving_licence',
  9: 'bank_details',
  10: 'document_guide',
  11: 'documents_upload'
}

// Total de steps (11 steps incluindo Welcome)
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
export const DEFAULT_LANGUAGE = LANGUAGES.EN

// Depósitos disponíveis (organizados por categoria)
export const DEPOTS = [
  // Arrow_XL
  {
    id: 'arrow-xl-bristol',
    name: 'Arrow XL - Bristol',
    code: 'Arrow_XL',
    address: 'Bristol, UK',
    coordinates: { lat: 51.4545, lng: -2.5879 },
    category: 'Arrow_XL'
  },
  {
    id: 'arrow-xl-exeter',
    name: 'Arrow XL - Exeter',
    code: 'Arrow_XL',
    address: 'Exeter, UK',
    coordinates: { lat: 50.7184, lng: -3.5339 },
    category: 'Arrow_XL'
  },
  {
    id: 'arrow-xl-newcastle',
    name: 'Arrow XL - Newcastle',
    code: 'Arrow_XL',
    address: 'Newcastle, UK',
    coordinates: { lat: 54.9783, lng: -1.6178 },
    category: 'Arrow_XL'
  },
  {
    id: 'arrow-xl-southampton',
    name: 'Arrow XL - Southampton',
    code: 'Arrow_XL',
    address: 'Southampton, UK',
    coordinates: { lat: 50.9097, lng: -1.4044 },
    category: 'Arrow_XL'
  },
  {
    id: 'arrow-xl-swindon',
    name: 'Arrow XL - Swindon',
    code: 'Arrow_XL',
    address: 'Swindon, UK',
    coordinates: { lat: 51.5558, lng: -1.7797 },
    category: 'Arrow_XL'
  },

  // Amazon
  {
    id: 'dxe1',
    name: 'DXE1 (London - E3 3JG)',
    code: 'DXE1',
    address: 'London E3 3JG, UK',
    coordinates: { lat: 51.5290, lng: -0.0263 },
    category: 'Amazon'
  },
  {
    id: 'drh1',
    name: 'DRH1 (London - RH12 3GG)',
    code: 'DRH1',
    address: 'Horsham RH12 3GG, UK',
    coordinates: { lat: 51.0630, lng: -0.3258 },
    category: 'Amazon'
  },
  {
    id: 'dbh3',
    name: 'DBH3 (Bournemouth - BH15 2AA)',
    code: 'DBH3',
    address: 'Bournemouth BH15 2AA, UK',
    coordinates: { lat: 50.7489, lng: -1.9386 },
    category: 'Amazon'
  },
  {
    id: 'dbn5',
    name: 'DBN5 (Bognor Regis - PO22 9FJ)',
    code: 'DBN5',
    address: 'Bognor Regis PO22 9FJ, UK',
    coordinates: { lat: 50.7826, lng: -0.6760 },
    category: 'Amazon'
  },
  {
    id: 'dcr2',
    name: 'DCR2 (Croydon - CR2 4UQ)',
    code: 'DCR2',
    address: 'Croydon CR2 4UQ, UK',
    coordinates: { lat: 51.3518, lng: -0.0799 },
    category: 'Amazon'
  },
  {
    id: 'dha2',
    name: 'DHA2 (London - NW10 0UX)',
    code: 'DHA2',
    address: 'London NW10 0UX, UK',
    coordinates: { lat: 51.5370, lng: -0.2708 },
    category: 'Amazon'
  },
  {
    id: 'dpo1',
    name: 'DPO1 (Portsmouth - PO9 2NG)',
    code: 'DPO1',
    address: 'Portsmouth PO9 2NG, UK',
    coordinates: { lat: 50.8520, lng: -1.0982 },
    category: 'Amazon'
  },
  {
    id: 'dsn1',
    name: 'DSN1 (Swindon - SN3 4WA)',
    code: 'DSN1',
    address: 'Swindon SN3 4WA, UK',
    coordinates: { lat: 51.5682, lng: -1.7897 },
    category: 'Amazon'
  },
  {
    id: 'dig1',
    name: 'DIG1 (Enfield - EN3 7PZ)',
    code: 'DIG1',
    address: 'Enfield EN3 7PZ, UK',
    coordinates: { lat: 51.6622, lng: -0.0319 },
    category: 'Amazon'
  },
  {
    id: 'dbr2',
    name: 'DBR2 (Orpington - BR5 3RT)',
    code: 'DBR2',
    address: 'Orpington BR5 3RT, UK',
    coordinates: { lat: 51.3779, lng: 0.0988 },
    category: 'Amazon'
  },
  {
    id: 'dso2',
    name: 'DSO2 (Southampton - SO40 9LR)',
    code: 'DSO2',
    address: 'Southampton SO40 9LR, UK',
    coordinates: { lat: 50.8429, lng: -1.5339 },
    category: 'Amazon'
  },
  {
    id: 'dxw3',
    name: 'DXW3 (Weybridge - KT14 0YU)',
    code: 'DXW3',
    address: 'Weybridge KT14 0YU, UK',
    coordinates: { lat: 51.3614, lng: -0.4598 },
    category: 'Amazon'
  },

  // Amazon_DE
  {
    id: 'dnw3',
    name: 'DNW3',
    code: 'DNW3',
    address: 'UK',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    category: 'Amazon_DE'
  },

  // DX
  {
    id: 'dx-acton',
    name: 'DX Acton',
    code: 'DX',
    address: 'Acton, London, UK',
    coordinates: { lat: 51.5074, lng: -0.2683 },
    category: 'DX'
  },
  {
    id: 'dx-crawley',
    name: 'DX Crawley',
    code: 'DX',
    address: 'Crawley, UK',
    coordinates: { lat: 51.1133, lng: -0.1863 },
    category: 'DX'
  },
  {
    id: 'dx-dartford',
    name: 'DX Dartford',
    code: 'DX',
    address: 'Dartford, UK',
    coordinates: { lat: 51.4461, lng: 0.2190 },
    category: 'DX'
  },
  {
    id: 'dx-s-london',
    name: 'DX S London',
    code: 'DX',
    address: 'South London, UK',
    coordinates: { lat: 51.4236, lng: -0.1277 },
    category: 'DX'
  },
  {
    id: 'dx-middlesbrough',
    name: 'DX Middlesbrough',
    code: 'DX',
    address: 'Middlesbrough, UK',
    coordinates: { lat: 54.5742, lng: -1.2350 },
    category: 'DX'
  },

  // FedEx
  {
    id: 'fedex-crawley',
    name: 'FedEx Crawley',
    code: 'FedEx',
    address: 'Crawley, UK',
    coordinates: { lat: 51.1133, lng: -0.1863 },
    category: 'FedEx'
  },
  {
    id: 'fedex-hornsey',
    name: 'Fedex Hornsey',
    code: 'FedEx',
    address: 'Hornsey, London, UK',
    coordinates: { lat: 51.5877, lng: -0.1166 },
    category: 'FedEx'
  },
  {
    id: 'fedex-park-royal',
    name: 'Fedex Park Royal',
    code: 'FedEx',
    address: 'Park Royal, London, UK',
    coordinates: { lat: 51.5284, lng: -0.2817 },
    category: 'FedEx'
  },
  {
    id: 'fedex-swindon',
    name: 'FedEx Swindon',
    code: 'FedEx',
    address: 'Swindon, UK',
    coordinates: { lat: 51.5558, lng: -1.7797 },
    category: 'FedEx'
  },
  {
    id: 'fedex-yates',
    name: 'FedEx Yates',
    code: 'FedEx',
    address: 'UK',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    category: 'FedEx'
  },

  // Amazon_XL
  {
    id: 'hig3',
    name: 'HIG3',
    code: 'HIG3',
    address: 'UK',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    category: 'Amazon_XL'
  },
  {
    id: 'hne3',
    name: 'HNE3',
    code: 'HNE3',
    address: 'UK',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    category: 'Amazon_XL'
  },
  {
    id: 'hnq1',
    name: 'HNQ1',
    code: 'HNQ1',
    address: 'UK',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    category: 'Amazon_XL'
  },
  {
    id: 'hso2',
    name: 'HSO2',
    code: 'HSO2',
    address: 'UK',
    coordinates: { lat: 50.9097, lng: -1.4044 },
    category: 'Amazon_XL'
  },
  {
    id: 'hxw3',
    name: 'HXW3',
    code: 'HXW3',
    address: 'UK',
    coordinates: { lat: 51.3614, lng: -0.4598 },
    category: 'Amazon_XL'
  },

  // SORTATION-CANDIDATES
  {
    id: 'sortation-candidates',
    name: 'SORTATION-CANDIDATES',
    code: 'SORTATION',
    address: 'UK',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    category: 'SORTATION-CANDIDATES'
  },

  // Hived
  {
    id: 'hived-hayes',
    name: 'Hived Hayes',
    code: 'Hived',
    address: 'Hayes, London, UK',
    coordinates: { lat: 51.5124, lng: -0.4198 },
    category: 'Hived'
  },

  // UPS
  {
    id: 'ups-bristol',
    name: 'UPS Bristol',
    code: 'UPS',
    address: 'Bristol, UK',
    coordinates: { lat: 51.4545, lng: -2.5879 },
    category: 'UPS'
  },
  {
    id: 'ups-croydon',
    name: 'UPS Croydon',
    code: 'UPS',
    address: 'Croydon, UK',
    coordinates: { lat: 51.3762, lng: -0.0982 },
    category: 'UPS'
  },
  {
    id: 'ups-feltham',
    name: 'UPS Feltham',
    code: 'UPS',
    address: 'Feltham, London, UK',
    coordinates: { lat: 51.4491, lng: -0.4090 },
    category: 'UPS'
  },
  {
    id: 'ups-oxford',
    name: 'UPS Oxford',
    code: 'UPS',
    address: 'Oxford, UK',
    coordinates: { lat: 51.7520, lng: -1.2577 },
    category: 'UPS'
  },
  {
    id: 'ups-exeter',
    name: 'UPS Exeter',
    code: 'UPS',
    address: 'Exeter, UK',
    coordinates: { lat: 50.7184, lng: -3.5339 },
    category: 'UPS'
  },
  {
    id: 'ups-glastonbury',
    name: 'UPS Glastonbury',
    code: 'UPS',
    address: 'Glastonbury, UK',
    coordinates: { lat: 51.1489, lng: -2.7147 },
    category: 'UPS'
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
