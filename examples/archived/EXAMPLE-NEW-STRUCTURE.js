/**
 * Exemplo de Uso da Nova Estrutura Normalizada
 *
 * Este arquivo demonstra como usar as novas funções do supabaseService.js
 * para trabalhar com a estrutura normalizada (candidates + candidate_documents)
 */

import {
  // Funções antigas (para onboarding)
  upsertFormSubmission,
  getFormProgress,
  saveFormStep,
  markFormAsCompleted,

  // Funções novas (estrutura normalizada)
  upsertCandidate,
  getCandidateByEmail,
  uploadCandidateDocument,
  getCandidateDocuments,
  updateDocumentStatus,
  getCandidateCompletionStatus,
  migrateFormSubmissionToCandidate,
  getDocumentTypes
} from './src/services/supabaseService.js'

// ============================================
// CENÁRIO 1: Onboarding Normal (Steps 1-12)
// ============================================
// Durante o onboarding, continuar usando form_submissions

async function exampleOnboarding() {
  const email = 'user@example.com'

  // Step 1: Welcome - Salvar idioma
  await upsertFormSubmission(email, {
    language: 'en',
    currentStep: 1
  })

  // Step 2: Depot - Salvar depot
  await saveFormStep(email, 2, {
    selectedDepot: 'Southampton',
    depot_code: 'DSO2'
  })

  // Step 3: Contact - Salvar contato
  await saveFormStep(email, 3, {
    fullName: 'John Doe',
    phone: '+44 123 456 789'
  })

  // ... outros steps ...

  // Step 12: Documents Upload - Marcar como completo
  await markFormAsCompleted(email)
}

// ============================================
// CENÁRIO 2: Após Conclusão - Migração Automática
// ============================================

async function exampleAutoMigration() {
  const email = 'user@example.com'

  // Após is_completed = true, disparar migração
  const result = await migrateFormSubmissionToCandidate(email)

  if (result.success) {
    console.log('✅ Migração concluída:', result.candidateId)
  } else {
    console.error('❌ Erro na migração:', result.error)
  }
}

// ============================================
// CENÁRIO 3: Upload de Documento Individual
// ============================================

async function exampleUploadDocument() {
  const email = 'user@example.com'

  // 1. Buscar candidato
  const candidate = await getCandidateByEmail(email)

  if (!candidate) {
    console.error('Candidato não encontrado')
    return
  }

  // 2. Fazer upload de documento
  const fileInput = document.querySelector('input[type="file"]')
  const file = fileInput.files[0]

  const uploadResult = await uploadCandidateDocument(
    candidate.id,
    'right_to_work', // Código do tipo de documento
    file
  )

  if (uploadResult.success) {
    console.log('✅ Documento enviado:', uploadResult.document.id)
    console.log('📄 URL:', uploadResult.url)
  } else {
    console.error('❌ Erro ao enviar:', uploadResult.error)
  }
}

// ============================================
// CENÁRIO 4: Listar Documentos de um Candidato
// ============================================

async function exampleListDocuments() {
  const email = 'user@example.com'

  // 1. Buscar candidato
  const candidate = await getCandidateByEmail(email)

  // 2. Buscar documentos (usa a FUNCTION PostgreSQL)
  const documents = await getCandidateDocuments(candidate.id)

  console.log('📄 Documentos do candidato:')
  documents.forEach(doc => {
    console.log(`  - ${doc.document_name}:`, doc.status || 'não enviado')
  })

  /*
  Saída esperada:
  📄 Documentos do candidato:
    - Direito ao Trabalho: pending
    - Comprovante de Endereço: pending
    - Certificado CAF: não enviado
    - Carteira de Motorista: pending
    ...
  */
}

// ============================================
// CENÁRIO 5: Verificar Status de Conclusão
// ============================================

async function exampleCheckCompletion() {
  const email = 'user@example.com'
  const candidate = await getCandidateByEmail(email)

  // Usa FUNCTION get_candidate_completion_status
  const status = await getCandidateCompletionStatus(candidate.id)

  console.log('📊 Status de conclusão:')
  console.log(`  Total obrigatórios: ${status.total_required}`)
  console.log(`  Total enviados: ${status.total_uploaded}`)
  console.log(`  Aprovados: ${status.total_approved}`)
  console.log(`  Rejeitados: ${status.total_rejected}`)
  console.log(`  Pendentes: ${status.total_pending}`)
  console.log(`  Completo: ${status.is_complete ? 'Sim' : 'Não'}`)

  if (status.missing_documents.length > 0) {
    console.log('⚠️  Documentos faltando:')
    status.missing_documents.forEach(doc => {
      console.log(`    - ${doc}`)
    })
  }

  /*
  Saída esperada:
  📊 Status de conclusão:
    Total obrigatórios: 10
    Total enviados: 7
    Aprovados: 0
    Rejeitados: 0
    Pendentes: 7
    Completo: Não
  ⚠️  Documentos faltando:
    - Seguro Nacional
    - Extrato Bancário
    - Certificado de IVA
  */
}

// ============================================
// CENÁRIO 6: Admin - Aprovar/Rejeitar Documento
// ============================================

async function exampleReviewDocument() {
  const documentId = 'doc-uuid-123'

  // Aprovar documento
  const approved = await updateDocumentStatus(
    documentId,
    'approved',
    'Documento válido e legível'
  )

  // Rejeitar documento
  const rejected = await updateDocumentStatus(
    documentId,
    'rejected',
    'Documento borrado, favor reenviar'
  )

  console.log('✅ Status atualizado')
}

// ============================================
// CENÁRIO 7: Listar Tipos de Documentos
// ============================================

async function exampleListDocumentTypes() {
  const types = await getDocumentTypes()

  console.log('📋 Tipos de documentos disponíveis:')
  types.forEach(type => {
    const required = type.is_required ? '[OBRIGATÓRIO]' : '[OPCIONAL]'
    console.log(`  ${type.display_order}. ${type.name} ${required}`)
    console.log(`     Código: ${type.code}`)
    console.log(`     Descrição: ${type.description}`)
  })

  /*
  Saída esperada:
  📋 Tipos de documentos disponíveis:
    1. Formulário de Endereços [OBRIGATÓRIO]
       Código: form_enderecos
       Descrição: Formulário completo com dados de endereço
    2. Contrato Recorrente [OBRIGATÓRIO]
       Código: contract_recorrente
       Descrição: Contrato de prestação de serviços recorrente
    ...
  */
}

// ============================================
// CENÁRIO 8: Admin - Dashboard com Filtros
// ============================================

async function exampleAdminDashboard() {
  const { getCandidateDocumentsView } = await import('./src/services/supabaseService.js')

  // Listar todos os documentos pendentes
  const pendingDocs = await getCandidateDocumentsView({
    documentStatus: 'pending'
  })

  console.log('📊 Documentos pendentes de revisão:')
  pendingDocs.forEach(doc => {
    console.log(`  - ${doc.full_name} (${doc.email})`)
    console.log(`    Documento: ${doc.document_name}`)
    console.log(`    Enviado em: ${doc.uploaded_at}`)
  })

  // Listar candidatos ativos
  const activeCandidates = await getCandidateDocumentsView({
    candidateStatus: 'active'
  })

  // Listar apenas documentos obrigatórios
  const requiredDocs = await getCandidateDocumentsView({
    isRequired: true
  })

  /*
  Saída esperada:
  📊 Documentos pendentes de revisão:
    - João Silva (joao@example.com)
      Documento: Direito ao Trabalho
      Enviado em: 2025-11-08T10:00:00Z
    - Maria Santos (maria@example.com)
      Documento: Comprovante de Endereço
      Enviado em: 2025-11-08T11:30:00Z
  */
}

// ============================================
// CENÁRIO 9: Exemplo Completo - Step 12 (Upload Final)
// ============================================

async function exampleStep12Complete() {
  const email = localStorage.getItem('sbl_user_email')

  // 1. Verificar se form_submission está completo
  const progress = await getFormProgress(email)

  if (!progress.isCompleted) {
    console.error('Formulário ainda não foi completado')
    return
  }

  // 2. Migrar para estrutura normalizada
  console.log('🔄 Migrando para estrutura normalizada...')
  const migrationResult = await migrateFormSubmissionToCandidate(email)

  if (!migrationResult.success) {
    console.error('Erro na migração:', migrationResult.error)
    return
  }

  // 3. Buscar candidato criado
  const candidate = await getCandidateByEmail(email)
  console.log('✅ Candidato criado:', candidate.id)

  // 4. Listar documentos
  const documents = await getCandidateDocuments(candidate.id)
  console.log(`📄 ${documents.length} documentos migrados`)

  // 5. Verificar status de conclusão
  const status = await getCandidateCompletionStatus(candidate.id)

  if (status.is_complete) {
    console.log('🎉 Todos os documentos obrigatórios foram enviados!')
  } else {
    console.log(`⚠️ Faltam ${status.missing_documents.length} documentos obrigatórios`)
  }

  // 6. Redirecionar para página de sucesso
  window.location.href = '/success'
}

// ============================================
// EXPORT PARA TESTES
// ============================================

export {
  exampleOnboarding,
  exampleAutoMigration,
  exampleUploadDocument,
  exampleListDocuments,
  exampleCheckCompletion,
  exampleReviewDocument,
  exampleListDocumentTypes,
  exampleAdminDashboard,
  exampleStep12Complete
}

// ============================================
// QUERIES SQL ÚTEIS PARA ADMIN
// ============================================

/*
-- Ver candidatos com documentos pendentes
SELECT * FROM candidate_documents_view
WHERE document_status = 'pending'
ORDER BY uploaded_at DESC;

-- Ver candidatos que completaram todos os documentos obrigatórios
SELECT c.*, COUNT(cd.id) as total_docs
FROM candidates c
LEFT JOIN candidate_documents cd ON c.id = cd.candidate_id
WHERE (
  SELECT is_complete
  FROM get_candidate_completion_status(c.id)
  LIMIT 1
) = true
GROUP BY c.id;

-- Ver documentos por status
SELECT
  dt.name as tipo_documento,
  COUNT(CASE WHEN cd.status = 'pending' THEN 1 END) as pendentes,
  COUNT(CASE WHEN cd.status = 'approved' THEN 1 END) as aprovados,
  COUNT(CASE WHEN cd.status = 'rejected' THEN 1 END) as rejeitados
FROM document_types dt
LEFT JOIN candidate_documents cd ON dt.id = cd.document_type_id
GROUP BY dt.id, dt.name
ORDER BY dt.display_order;

-- Ver candidatos por depot
SELECT
  depot_location,
  COUNT(*) as total_candidatos,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as ativos,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pendentes
FROM candidates
GROUP BY depot_location;

-- Ver uploads recentes (últimas 24h)
SELECT * FROM candidate_documents_view
WHERE uploaded_at >= NOW() - INTERVAL '24 hours'
ORDER BY uploaded_at DESC;
*/
