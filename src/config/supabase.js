/**
 * Configuração Supabase
 * Integração com Supabase para SBL Onboarding Form
 */

import { createClient } from '@supabase/supabase-js'

// Credenciais (use variáveis de ambiente em produção)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://seu-project.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sua-chave-anonima'

/**
 * Cliente Supabase
 * Será inicializado quando a chave for fornecida
 */
let supabase = null

/**
 * Inicializar cliente Supabase
 */
export function initSupabase() {
  if (typeof window === 'undefined') {
    console.warn('Supabase apenas disponível no client')
    return null
  }

  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }

  return supabase
}

/**
 * Obter instância do Supabase
 */
export function getSupabase() {
  if (!supabase) {
    console.warn('Supabase não inicializado. Chamando initSupabase()...')
    return initSupabase()
  }
  return supabase
}

/**
 * Obter URL base do Supabase
 */
export function getSupabaseUrl() {
  return SUPABASE_URL
}

/**
 * Verificar se Supabase está configurado
 */
export function isSupabaseConfigured() {
  return SUPABASE_URL && SUPABASE_ANON_KEY && 
         SUPABASE_URL !== 'https://seu-project.supabase.co' &&
         SUPABASE_ANON_KEY !== 'sua-chave-anonima'
}

/**
 * Schema das tabelas esperadas
 */
export const SUPABASE_SCHEMA = {
  FORM_SUBMISSIONS: 'form_submissions',
  FORM_ABANDONMENTS: 'form_abandonments'
}

/**
 * Colunas da tabela form_submissions
 */
export const FORM_SUBMISSION_COLUMNS = {
  ID: 'id',
  EMAIL: 'email',
  PHONE: 'phone',
  LANGUAGE: 'language',
  FULL_NAME: 'full_name',
  SELECTED_DEPOT: 'selected_depot',
  CURRENT_STEP: 'current_step',
  COMPLETED_STEPS: 'completed_steps',
  MESSAGES: 'messages',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
  COMPLETED_AT: 'completed_at',
  ABANDONED_AT: 'abandoned_at',
  IS_COMPLETED: 'is_completed',
  IS_ABANDONED: 'is_abandoned',
  LAST_ACTIVITY: 'last_activity',
  USER_AGENT: 'user_agent',
  IP_ADDRESS: 'ip_address',
  UTM_SOURCE: 'utm_source',
  UTM_MEDIUM: 'utm_medium',
  UTM_CAMPAIGN: 'utm_campaign'
}

/**
 * Steps do formulário (atualizados após remover Chat)
 */
export const FORM_STEPS = {
  WELCOME: 1,
  DEPOT: 2,
  CONTACT: 3,
  PERSONAL_INFO: 4,
  ADDRESS_HISTORY: 5,
  ADDITIONAL_INFO: 6,
  PROFILE_PHOTO: 7,
  DRIVING_LICENCE: 8,
  BANK_DETAILS: 9,
  DOCUMENT_GUIDE: 10,
  DOCUMENTS_UPLOAD: 11,
  COMPLETION: 12
}

/**
 * Status do formulário
 */
export const FORM_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned'
}

/**
 * Tipo de follow-up
 */
export const FOLLOWUP_TYPE = {
  EMAIL: 'email',
  WHATSAPP: 'whatsapp'
}

export default {
  initSupabase,
  getSupabase,
  getSupabaseUrl,
  isSupabaseConfigured,
  SUPABASE_SCHEMA,
  FORM_SUBMISSION_COLUMNS,
  FORM_STEPS,
  FORM_STATUS,
  FOLLOWUP_TYPE
}
