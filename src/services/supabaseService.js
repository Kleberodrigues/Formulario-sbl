/**
 * Supabase Service - Estrutura Normalizada
 * Operações CRUD para candidatos e documentos
 */

import {
  getSupabase,
  SUPABASE_SCHEMA,
  FORM_STEPS,
  FORM_STATUS
} from '../config/supabase.js'

// ============================================
// STORAGE FUNCTIONS
// ============================================

/**
 * Upload de arquivo para Supabase Storage
 * @param {File} file - Arquivo a ser enviado
 * @param {string} path - Caminho no storage
 * @param {string} bucket - Nome do bucket (padrão: 'form-documents')
 * @returns {Promise<object>} - { success, url, error }
 */
export async function uploadFile(file, path, bucket = 'form-documents') {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      console.warn('⚠️ Supabase não configurado - simulando upload')

      // Retornar URL simulada (em produção, usar Supabase Storage)
      const mockUrl = URL.createObjectURL(file)
      return {
        success: true,
        url: mockUrl,
        path: path
      }
    }

    // Faz upload do arquivo
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true // Sobrescreve se já existir
      })

    if (error) throw error

    // Obtém URL pública do arquivo
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    console.log(`✅ Arquivo enviado: ${path}`)

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path
    }
  } catch (error) {
    console.error('❌ Erro ao fazer upload:', error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Obtém URL pública de arquivo no Supabase Storage
 * @param {string} path - Caminho do arquivo
 * @param {string} bucket - Nome do bucket (padrão: 'form-documents')
 * @returns {string} - URL pública
 */
export function getFileUrl(path, bucket = 'form-documents') {
  try {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase não configurado')

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  } catch (error) {
    console.error('❌ Erro ao obter URL:', error.message)
    return null
  }
}

/**
 * Remove arquivo do Supabase Storage
 * @param {string} path - Caminho do arquivo
 * @param {string} bucket - Nome do bucket (padrão: 'form-documents')
 * @returns {Promise<boolean>}
 */
export async function deleteFile(path, bucket = 'form-documents') {
  try {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase não configurado')

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error

    console.log(`✅ Arquivo removido: ${path}`)
    return true
  } catch (error) {
    console.error('❌ Erro ao remover arquivo:', error.message)
    return false
  }
}

/**
 * Lista arquivos de um diretório no Storage
 * @param {string} path - Caminho do diretório
 * @param {string} bucket - Nome do bucket (padrão: 'form-documents')
 * @returns {Promise<Array>}
 */
export async function listFiles(path = '', bucket = 'form-documents') {
  try {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase não configurado')

    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path)

    if (error) throw error

    return data
  } catch (error) {
    console.error('❌ Erro ao listar arquivos:', error.message)
    return []
  }
}

// ============================================
// CANDIDATE FUNCTIONS (ESTRUTURA NORMALIZADA)
// ============================================

/**
 * Criar ou atualizar candidato na estrutura normalizada
 * @param {object} candidateData - Dados do candidato
 * @returns {Promise<object>} - Candidato criado/atualizado
 */
export async function upsertCandidate(candidateData) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      console.warn('⚠️ Supabase não configurado - salvando apenas em localStorage')

      // Fallback para localStorage
      const mockCandidate = {
        id: `mock-${Date.now()}`,
        full_name: candidateData.fullName,
        email: candidateData.email,
        phone_number: candidateData.phone,
        preferred_language: candidateData.language || 'en',
        depot_location: candidateData.selectedDepot,
        depot_code: candidateData.depotCode,
        status: candidateData.status || 'pending',
        created_at: new Date().toISOString()
      }

      localStorage.setItem('sbl_candidate_data', JSON.stringify(mockCandidate))
      return mockCandidate
    }

    const candidate = {
      full_name: candidateData.fullName,
      email: candidateData.email,
      phone_number: candidateData.phone,
      preferred_language: candidateData.language || 'en',
      depot_location: candidateData.selectedDepot,
      depot_code: candidateData.depotCode,
      status: candidateData.status || 'pending'
    }

    const { data, error } = await supabase
      .from('candidates')
      .upsert(candidate, { onConflict: 'email' })
      .select()
      .single()

    if (error) throw error

    console.log('✅ Candidato salvo:', data.id)
    return data
  } catch (error) {
    console.error('❌ Erro ao salvar candidato:', error.message)
    throw error
  }
}

/**
 * Atualizar campos específicos de um candidato
 * (Substitui a antiga função saveFormStep)
 * @param {string} candidateId - UUID do candidato
 * @param {object} fields - Campos a serem atualizados
 * @returns {Promise<object>} - Candidato atualizado
 */
export async function updateCandidateFields(candidateId, fields) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      console.warn('⚠️ Supabase não configurado - salvando apenas em localStorage')

      // Fallback para localStorage
      const savedData = JSON.parse(localStorage.getItem('sbl_candidate_data') || '{}')
      const updatedData = { ...savedData, ...fields, updated_at: new Date().toISOString() }
      localStorage.setItem('sbl_candidate_data', JSON.stringify(updatedData))

      return updatedData
    }

    const { data, error } = await supabase
      .from('candidates')
      .update(fields)
      .eq('id', candidateId)
      .select()
      .single()

    if (error) throw error

    console.log(`✅ Candidato atualizado: ${candidateId}`)
    return data
  } catch (error) {
    console.error('❌ Erro ao atualizar candidato:', error.message)
    throw error
  }
}

/**
 * Buscar candidato por email
 * @param {string} email - Email do candidato
 * @returns {Promise<object|null>}
 */
export async function getCandidateByEmail(email) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      console.warn('⚠️ Supabase não configurado - buscando em localStorage')

      // Fallback para localStorage
      const savedData = JSON.parse(localStorage.getItem('sbl_candidate_data') || '{}')
      return savedData.email === email ? savedData : null
    }

    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return data
  } catch (error) {
    console.error('❌ Erro ao buscar candidato:', error.message)
    return null
  }
}

/**
 * Upload de documento vinculado ao candidato
 * @param {string} candidateId - UUID do candidato
 * @param {string} documentTypeCode - Código do tipo de documento
 * @param {File} file - Arquivo a ser enviado
 * @returns {Promise<object>} - Documento criado
 */
export async function uploadCandidateDocument(candidateId, documentTypeCode, file) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      console.warn('⚠️ Supabase não configurado - simulando upload de documento')

      // Fallback para localStorage
      const mockDoc = {
        id: `mock-doc-${Date.now()}`,
        candidate_id: candidateId,
        document_type_code: documentTypeCode,
        original_filename: file.name,
        file_size: file.size,
        mime_type: file.type,
        status: 'pending',
        uploaded_at: new Date().toISOString(),
        url: URL.createObjectURL(file)
      }

      return {
        success: true,
        document: mockDoc,
        url: mockDoc.url
      }
    }

    // 1. Buscar document_type_id pelo code
    const { data: docType, error: docTypeError } = await supabase
      .from('document_types')
      .select('id')
      .eq('code', documentTypeCode)
      .single()

    if (docTypeError) throw new Error(`Tipo de documento não encontrado: ${documentTypeCode}`)

    // 2. Gerar path único para o arquivo
    const timestamp = Date.now()
    const fileExt = file.name.split('.').pop()
    const fileName = `${documentTypeCode}_${candidateId}_${timestamp}.${fileExt}`
    const storagePath = fileName

    // 3. Fazer upload para Storage
    const uploadResult = await uploadFile(file, storagePath)
    if (!uploadResult.success) throw new Error(uploadResult.error)

    // 4. Criar registro em candidate_documents
    const { data: document, error: docError } = await supabase
      .from('candidate_documents')
      .upsert({
        candidate_id: candidateId,
        document_type_id: docType.id,
        storage_bucket: 'form-documents',
        storage_path: storagePath,
        original_filename: file.name,
        file_size: file.size,
        mime_type: file.type,
        status: 'pending',
        uploaded_at: new Date().toISOString()
      }, { onConflict: 'candidate_id,document_type_id' })
      .select()
      .single()

    if (docError) throw docError

    console.log(`✅ Documento ${documentTypeCode} enviado para candidato ${candidateId}`)
    return {
      success: true,
      document,
      url: uploadResult.url
    }
  } catch (error) {
    console.error('❌ Erro ao fazer upload de documento:', error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Buscar documentos de um candidato
 * @param {string} candidateId - UUID do candidato
 * @returns {Promise<Array>} - Lista de documentos
 */
export async function getCandidateDocuments(candidateId) {
  try {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase não configurado')

    const { data, error } = await supabase
      .rpc('get_candidate_documents', { p_candidate_id: candidateId })

    if (error) throw error

    console.log(`📄 ${data?.length || 0} documentos encontrados para candidato ${candidateId}`)
    return data || []
  } catch (error) {
    console.error('❌ Erro ao buscar documentos:', error.message)
    return []
  }
}

/**
 * Atualizar status de um documento
 * @param {string} documentId - UUID do documento
 * @param {string} status - Novo status (pending/approved/rejected)
 * @param {string} reviewNotes - Notas da revisão (opcional)
 * @returns {Promise<boolean>}
 */
export async function updateDocumentStatus(documentId, status, reviewNotes = null) {
  try {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase não configurado')

    const updateData = {
      status,
      reviewed_at: new Date().toISOString()
    }

    if (reviewNotes) {
      updateData.review_notes = reviewNotes
    }

    const { error } = await supabase
      .from('candidate_documents')
      .update(updateData)
      .eq('id', documentId)

    if (error) throw error

    console.log(`✅ Status do documento atualizado para: ${status}`)
    return true
  } catch (error) {
    console.error('❌ Erro ao atualizar status do documento:', error.message)
    return false
  }
}

/**
 * Obter status de conclusão dos documentos de um candidato
 * @param {string} candidateId - UUID do candidato
 * @returns {Promise<object>} - Estatísticas de conclusão
 */
export async function getCandidateCompletionStatus(candidateId) {
  try {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase não configurado')

    const { data, error } = await supabase
      .rpc('get_candidate_completion_status', { p_candidate_id: candidateId })

    if (error) throw error

    // A função retorna JSON diretamente (não array)
    console.log('📊 Status de conclusão:', data)
    return data || {
      total_required: 0,
      total_uploaded: 0,
      total_approved: 0,
      total_rejected: 0,
      total_pending: 0,
      is_complete: false,
      missing_documents: []
    }
  } catch (error) {
    console.error('❌ Erro ao obter status de conclusão:', error.message)
    throw error
  }
}

/**
 * Buscar view de candidatos com documentos (para admin)
 * @param {object} filters - Filtros opcionais (status, document_status, etc)
 * @returns {Promise<Array>}
 */
export async function getCandidateDocumentsView(filters = {}) {
  try {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase não configurado')

    let query = supabase
      .from('candidate_documents_view')
      .select('*')

    // Aplicar filtros
    if (filters.candidateStatus) {
      query = query.eq('candidate_status', filters.candidateStatus)
    }
    if (filters.documentStatus) {
      query = query.eq('document_status', filters.documentStatus)
    }
    if (filters.isRequired !== undefined) {
      query = query.eq('is_required', filters.isRequired)
    }

    const { data, error } = await query

    if (error) throw error

    console.log(`📊 ${data?.length || 0} registros na view de documentos`)
    return data || []
  } catch (error) {
    console.error('❌ Erro ao buscar view de documentos:', error.message)
    return []
  }
}

/**
 * Listar tipos de documentos disponíveis
 * @returns {Promise<Array>}
 */
export async function getDocumentTypes() {
  try {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase não configurado')

    const { data, error } = await supabase
      .from('document_types')
      .select('*')
      .order('display_order')

    if (error) throw error

    console.log(`📋 ${data?.length || 0} tipos de documentos disponíveis`)
    return data || []
  } catch (error) {
    console.error('❌ Erro ao listar tipos de documentos:', error.message)
    return []
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Obter IP do cliente
 */
async function getClientIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch {
    return 'unknown'
  }
}

/**
 * Obter parâmetro da URL
 */
function getURLParam(param) {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param)
}

// ============================================
// EXPORTS
// ============================================

export default {
  // Storage
  uploadFile,
  getFileUrl,
  deleteFile,
  listFiles,

  // Candidates (estrutura normalizada)
  upsertCandidate,
  updateCandidateFields,
  getCandidateByEmail,
  uploadCandidateDocument,
  getCandidateDocuments,
  updateDocumentStatus,
  getCandidateCompletionStatus,
  getCandidateDocumentsView,
  getDocumentTypes
}
