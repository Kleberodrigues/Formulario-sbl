/**
 * Supabase Service
 * Operações CRUD para o formulário SBL
 */

import {
  getSupabase,
  SUPABASE_SCHEMA,
  FORM_STEPS,
  FORM_STATUS
} from '../config/supabase.js'

/**
 * Criar ou atualizar submission do formulário
 * @param {string} email - Email do usuário
 * @param {object} formData - Dados do formulário
 * @returns {Promise<object>}
 */
export async function upsertFormSubmission(email, formData) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      console.warn('⚠️ Supabase não configurado - salvando apenas em localStorage')
      
      // Salvar no localStorage como fallback
      const savedData = {
        ...formData,
        email,
        last_activity: new Date().toISOString()
      }
      localStorage.setItem('sbl_form_data', JSON.stringify(savedData))
      
      return { email, ...formData } // Retornar dados para manter compatibilidade
    }

    const submission = {
      email,
      language: formData.language,
      full_name: formData.fullName,
      phone: formData.phone,
      selected_depot: formData.selectedDepot,
      current_step: formData.currentStep,
      completed_steps: formData.completedSteps || [],
      messages: formData.messages || [],
      is_completed: formData.isCompleted || false,
      is_abandoned: formData.isAbandoned || false,
      completed_at: formData.completedAt,
      last_activity: new Date().toISOString(),
      user_agent: navigator.userAgent,
      ip_address: await getClientIP(),
      utm_source: getURLParam('utm_source'),
      utm_medium: getURLParam('utm_medium'),
      utm_campaign: getURLParam('utm_campaign')
    }

    const { data, error } = await supabase
      .from(SUPABASE_SCHEMA.FORM_SUBMISSIONS)
      .upsert(submission, { onConflict: 'email' })
      .select()

    if (error) throw error

    console.log('✅ Submission salvo:', data?.[0]?.id)
    return data?.[0]
  } catch (error) {
    console.error('❌ Erro ao salvar submission:', error.message)
    throw error
  }
}

/**
 * Obter progresso do formulário pelo email
 * @param {string} email - Email do usuário
 * @returns {Promise<object>}
 */
export async function getFormProgress(email) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      console.warn('⚠️ Supabase não configurado - buscando em localStorage')
      
      // Buscar do localStorage como fallback
      const savedData = JSON.parse(localStorage.getItem('sbl_form_data') || '{}')
      return {
        email: savedData.email || email,
        currentStep: savedData.currentStep || FORM_STEPS.WELCOME,
        completedSteps: savedData.completedSteps || [],
        isNew: !savedData.email
      }
    }

    const { data, error } = await supabase
      .from(SUPABASE_SCHEMA.FORM_SUBMISSIONS)
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (!data) {
      return {
        email,
        currentStep: FORM_STEPS.WELCOME,
        completedSteps: [],
        isNew: true
      }
    }

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      phone: data.phone,
      language: data.language,
      selectedDepot: data.selected_depot,
      currentStep: data.current_step,
      completedSteps: data.completed_steps || [],
      messages: data.messages || [],
      isCompleted: data.is_completed,
      isAbandoned: data.is_abandoned,
      completedAt: data.completed_at,
      abandonedAt: data.abandoned_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      isNew: false
    }
  } catch (error) {
    console.error('❌ Erro ao obter progresso:', error.message)
    throw error
  }
}

/**
 * Salvar um step específico
 * @param {string} email - Email do usuário
 * @param {number} stepNumber - Número do step
 * @param {object} stepData - Dados do step
 * @returns {Promise<boolean>}
 */
export async function saveFormStep(email, stepNumber, stepData) {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      console.warn('⚠️ Supabase não configurado - salvando apenas em localStorage')
      
      // Salvar no localStorage como fallback
      const savedData = JSON.parse(localStorage.getItem('sbl_form_data') || '{}')
      savedData[`step_${stepNumber}_data`] = stepData
      savedData.currentStep = stepNumber + 1
      localStorage.setItem('sbl_form_data', JSON.stringify(savedData))
      
      return true // Retornar sucesso para permitir continuar
    }

    // Obter progresso atual
    const progress = await getFormProgress(email)

    // Atualizar steps completados
    const completedSteps = new Set(progress.completedSteps)
    completedSteps.add(stepNumber)

    // Preparar dados
    const updateData = {
      current_step: stepNumber + 1, // Próximo step
      completed_steps: Array.from(completedSteps),
      last_activity: new Date().toISOString()
    }

    // Adicionar dados específicos do step
    if (stepNumber === FORM_STEPS.WELCOME) {
      updateData.language = stepData.language
    } else if (stepNumber === FORM_STEPS.CONTACT) {
      updateData.full_name = stepData.fullName
      updateData.phone = stepData.phone
    } else if (stepNumber === FORM_STEPS.DEPOT) {
      updateData.selected_depot = stepData.selectedDepot
      updateData.depot_code = stepData.depot_code
    } else if (stepNumber === 4) { // PERSONAL_INFO
      updateData.birth_date = stepData.birthDate
      updateData.birth_city = stepData.birthCity
      updateData.mother_name = stepData.motherName
      updateData.mother_surname = stepData.motherSurname
      updateData.next_of_kin_name = stepData.nextOfKinName
      updateData.next_of_kin_relationship = stepData.nextOfKinRelationship
      updateData.next_of_kin_phone = stepData.nextOfKinPhone
    } else if (stepNumber === 5) { // ADDRESS_HISTORY
      updateData.address_history = stepData.address_history
    } else if (stepNumber === 6) { // ADDITIONAL_INFO
      updateData.national_insurance_number = stepData.nationalInsuranceNumber
      updateData.utr_number = stepData.utrNumber
      updateData.employment_status = stepData.employmentStatus
      updateData.vat_number = stepData.vatNumber
    } else if (stepNumber === 7) { // PROFILE_PHOTO
      updateData.profile_photo_url = stepData.profilePhotoUrl
      updateData.profile_photo_uploaded_at = new Date().toISOString()
    } else if (stepNumber === 8) { // DRIVING_LICENCE
      updateData.driving_licence_front_url = stepData.drivingLicenceFrontUrl
      updateData.driving_licence_back_url = stepData.drivingLicenceBackUrl
      updateData.driving_licence_uploaded_at = new Date().toISOString()
    } else if (stepNumber === 9) { // BANK_DETAILS
      updateData.bank_account_number = stepData.bankAccountNumber
      updateData.bank_sort_code = stepData.bankSortCode
      updateData.payment_declaration_accepted = stepData.paymentDeclarationAccepted
      updateData.payment_declaration_accepted_at = new Date().toISOString()
    } else if (stepNumber === 11) { // DOCUMENTS_UPLOAD
      updateData.documents = stepData.documents
      updateData.is_completed = true
      updateData.completed_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from(SUPABASE_SCHEMA.FORM_SUBMISSIONS)
      .update(updateData)
      .eq('email', email)

    if (error) throw error

    console.log(`✅ Step ${stepNumber} salvo para ${email}`)
    return true
  } catch (error) {
    console.error(`❌ Erro ao salvar step ${stepNumber}:`, error.message)
    throw error
  }
}

/**
 * Marcar formulário como abandonado
 * @param {string} email - Email do usuário
 * @param {number} abandonedAtStep - Step onde foi abandonado
 * @returns {Promise<boolean>}
 */
export async function markFormAsAbandoned(email, abandonedAtStep) {
  try {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase não configurado')

    // Obter dados do usuário
    const progress = await getFormProgress(email)

    // Atualizar form_submissions
    const { error: updateError } = await supabase
      .from(SUPABASE_SCHEMA.FORM_SUBMISSIONS)
      .update({
        is_abandoned: true,
        abandoned_at: new Date().toISOString()
      })
      .eq('email', email)

    if (updateError) throw updateError

    // Criar registro em form_abandonments para follow-up
    const { error: insertError } = await supabase
      .from(SUPABASE_SCHEMA.FORM_ABANDONMENTS)
      .insert({
        submission_id: progress.id,
        email,
        phone: progress.phone,
        full_name: progress.fullName,
        abandoned_at_step: abandonedAtStep,
        followup_sent: false
      })

    if (insertError) throw insertError

    console.log(`⚠️ Formulário marcado como abandonado em step ${abandonedAtStep}`)
    
    // Disparar webhook para n8n (follow-up automático)
    await triggerFollowupAutomation(email, abandonedAtStep)

    return true
  } catch (error) {
    console.error('❌ Erro ao marcar como abandonado:', error.message)
    throw error
  }
}

/**
 * Marcar formulário como completo
 * @param {string} email - Email do usuário
 * @returns {Promise<boolean>}
 */
export async function markFormAsCompleted(email) {
  try {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase não configurado')

    const { error } = await supabase
      .from(SUPABASE_SCHEMA.FORM_SUBMISSIONS)
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
        current_step: FORM_STEPS.COMPLETION
      })
      .eq('email', email)

    if (error) throw error

    console.log(`✅ Formulário completo para ${email}`)
    return true
  } catch (error) {
    console.error('❌ Erro ao marcar como completo:', error.message)
    throw error
  }
}

/**
 * Obter todos os abandonamentos para follow-up
 * @returns {Promise<array>}
 */
export async function getAbandonmentsForFollowup() {
  try {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase não configurado')

    const { data, error } = await supabase
      .from(SUPABASE_SCHEMA.FORM_ABANDONMENTS)
      .select('*')
      .eq('followup_sent', false)
      .order('created_at', { ascending: true })

    if (error) throw error

    console.log(`📊 ${data?.length || 0} abandonamentos para follow-up`)
    return data || []
  } catch (error) {
    console.error('❌ Erro ao obter abandonamentos:', error.message)
    throw error
  }
}

/**
 * Marcar follow-up como enviado
 * @param {string} abandonmentId - ID do abandonment
 * @param {string} followupType - Tipo de follow-up (email/whatsapp)
 * @returns {Promise<boolean>}
 */
export async function markFollowupAsSent(abandonmentId, followupType) {
  try {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase não configurado')

    const { error } = await supabase
      .from(SUPABASE_SCHEMA.FORM_ABANDONMENTS)
      .update({
        followup_sent: true,
        followup_sent_at: new Date().toISOString(),
        followup_type: followupType
      })
      .eq('id', abandonmentId)

    if (error) throw error

    console.log(`✅ Follow-up marcado como enviado (${followupType})`)
    return true
  } catch (error) {
    console.error('❌ Erro ao marcar follow-up:', error.message)
    throw error
  }
}

/**
 * Disparar webhook para n8n (automação de follow-up)
 * @param {string} email - Email do usuário
 * @param {number} abandonedAtStep - Step onde foi abandonado
 */
async function triggerFollowupAutomation(email, abandonedAtStep) {
  try {
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL
    
    if (!webhookUrl) {
      console.warn('⚠️ N8N webhook URL não configurada')
      return
    }

    const payload = {
      email,
      abandonedAtStep,
      timestamp: new Date().toISOString(),
      returnUrl: `${window.location.origin}?resume=${email}`
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) throw new Error('Webhook falhou')
    console.log('✅ Follow-up automático disparado')
  } catch (error) {
    console.warn('⚠️ Erro ao disparar follow-up automático:', error.message)
  }
}

/**
 * Upload de arquivo para Supabase Storage
 * @param {File} file - Arquivo a ser enviado
 * @param {string} path - Caminho no storage (ex: 'profile-photos/user@email.com/photo.jpg')
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
// NOVAS FUNÇÕES - ESTRUTURA NORMALIZADA
// ============================================

/**
 * Criar ou atualizar candidato na estrutura normalizada
 * @param {object} candidateData - Dados do candidato
 * @returns {Promise<object>} - Candidato criado/atualizado
 */
export async function upsertCandidate(candidateData) {
  try {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase não configurado')

    const candidate = {
      full_name: candidateData.fullName,
      email: candidateData.email,
      phone_number: candidateData.phone,
      preferred_language: candidateData.language || 'en',
      depot_location: candidateData.selectedDepot,
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
 * Buscar candidato por email
 * @param {string} email - Email do candidato
 * @returns {Promise<object|null>}
 */
export async function getCandidateByEmail(email) {
  try {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase não configurado')

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
    if (!supabase) throw new Error('Supabase não configurado')

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

    // A função agora retorna JSON diretamente (não array)
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
 * Migrar form_submission completado para estrutura normalizada
 * @param {string} email - Email do candidato
 * @returns {Promise<object>} - Candidato criado
 */
export async function migrateFormSubmissionToCandidate(email) {
  try {
    const supabase = getSupabase()
    if (!supabase) throw new Error('Supabase não configurado')

    // 1. Buscar form_submission
    const { data: submission, error: submissionError } = await supabase
      .from('form_submissions')
      .select('*')
      .eq('email', email)
      .eq('is_completed', true)
      .single()

    if (submissionError) throw new Error('Form submission não encontrado ou não completado')

    // 2. Executar função de migração no PostgreSQL
    const { data, error } = await supabase
      .rpc('migrate_form_submission_to_candidate', { p_submission_id: submission.id })

    if (error) throw error

    console.log(`✅ Form submission migrado para candidato: ${data}`)
    return {
      success: true,
      candidateId: data
    }
  } catch (error) {
    console.error('❌ Erro ao migrar form submission:', error.message)
    return {
      success: false,
      error: error.message
    }
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

export default {
  // Form submissions (estrutura antiga)
  upsertFormSubmission,
  getFormProgress,
  saveFormStep,
  markFormAsAbandoned,
  markFormAsCompleted,
  getAbandonmentsForFollowup,
  markFollowupAsSent,

  // Storage
  uploadFile,
  getFileUrl,
  deleteFile,
  listFiles,

  // Candidates (estrutura nova)
  upsertCandidate,
  getCandidateByEmail,
  uploadCandidateDocument,
  getCandidateDocuments,
  updateDocumentStatus,
  getCandidateCompletionStatus,
  migrateFormSubmissionToCandidate,
  getCandidateDocumentsView,
  getDocumentTypes
}
