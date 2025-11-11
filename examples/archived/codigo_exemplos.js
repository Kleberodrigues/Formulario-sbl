// ============================================
// EXEMPLOS DE CÓDIGO JAVASCRIPT/TYPESCRIPT
// Upload e Consulta de Documentos no Supabase
// ============================================

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'SUA_URL_DO_SUPABASE'
const supabaseKey = 'SUA_CHAVE_DO_SUPABASE'
const supabase = createClient(supabaseUrl, supabaseKey)

// ============================================
// 1. CRIAR NOVO CANDIDATO
// ============================================

async function createCandidate(candidateData) {
  const { data, error } = await supabase
    .from('candidates')
    .insert([
      {
        full_name: candidateData.full_name,
        email: candidateData.email,
        phone_number: candidateData.phone_number,
        preferred_language: candidateData.preferred_language,
        depot_location: candidateData.depot_location
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar candidato:', error)
    return null
  }

  console.log('Candidato criado:', data)
  return data
}

// Exemplo de uso:
// const newCandidate = await createCandidate({
//   full_name: 'João Silva',
//   email: 'joao.silva@email.com',
//   phone_number: '+44 7700 900123',
//   preferred_language: 'Português',
//   depot_location: 'DSO2 (Southampton - SO40 9LR)'
// })

// ============================================
// 2. FAZER UPLOAD DE DOCUMENTO
// ============================================

async function uploadDocument(candidateId, documentTypeCode, file) {
  try {
    // 1. Buscar o ID do tipo de documento
    const { data: docType, error: docTypeError } = await supabase
      .from('document_types')
      .select('id')
      .eq('code', documentTypeCode)
      .single()

    if (docTypeError) {
      throw new Error('Tipo de documento não encontrado')
    }

    // 2. Gerar nome único para o arquivo
    const fileExtension = file.name.split('.').pop()
    const fileName = `${documentTypeCode}_${crypto.randomUUID()}.${fileExtension}`
    const filePath = `${fileName}`

    // 3. Upload do arquivo para o Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('form-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      throw uploadError
    }

    // 4. Registrar o documento no banco de dados
    const { data: documentRecord, error: recordError } = await supabase
      .from('candidate_documents')
      .insert([
        {
          candidate_id: candidateId,
          document_type_id: docType.id,
          storage_bucket: 'form-documents',
          storage_path: uploadData.path,
          original_filename: file.name,
          file_size: file.size,
          mime_type: file.type
        }
      ])
      .select()
      .single()

    if (recordError) {
      throw recordError
    }

    console.log('Documento enviado com sucesso:', documentRecord)
    return documentRecord

  } catch (error) {
    console.error('Erro no upload:', error)
    return null
  }
}

// Exemplo de uso em um formulário HTML:
// const fileInput = document.getElementById('fileInput')
// const file = fileInput.files[0]
// await uploadDocument('uuid-do-candidato', 'proof_of_address', file)

// ============================================
// 3. LISTAR TODOS OS DOCUMENTOS DE UM CANDIDATO
// ============================================

async function getCandidateDocuments(candidateId) {
  const { data, error } = await supabase
    .from('candidate_documents_view')
    .select('*')
    .eq('candidate_id', candidateId)
    .order('display_order')

  if (error) {
    console.error('Erro ao buscar documentos:', error)
    return []
  }

  return data
}

// Exemplo de uso:
// const documents = await getCandidateDocuments('uuid-do-candidato')
// console.log('Documentos do candidato:', documents)

// ============================================
// 4. BUSCAR URL PÚBLICA DE UM DOCUMENTO
// ============================================

async function getDocumentUrl(storagePath) {
  const { data, error } = await supabase.storage
    .from('form-documents')
    .createSignedUrl(storagePath, 3600) // URL válida por 1 hora

  if (error) {
    console.error('Erro ao gerar URL:', error)
    return null
  }

  return data.signedUrl
}

// Exemplo de uso:
// const url = await getDocumentUrl('proof_of_address_uuid-123.pdf')
// console.log('URL do documento:', url)

// ============================================
// 5. VERIFICAR STATUS DOS DOCUMENTOS OBRIGATÓRIOS
// ============================================

async function checkRequiredDocuments(candidateId) {
  const { data, error } = await supabase.rpc('get_candidate_documents', {
    p_candidate_id: candidateId
  })

  if (error) {
    console.error('Erro:', error)
    return null
  }

  const requiredDocs = data.filter(doc => doc.is_required)
  const missingDocs = requiredDocs.filter(doc => !doc.storage_path)
  const pendingDocs = requiredDocs.filter(doc => doc.status === 'pending')

  return {
    total: requiredDocs.length,
    uploaded: requiredDocs.length - missingDocs.length,
    missing: missingDocs,
    pending: pendingDocs
  }
}

// Exemplo de uso:
// const status = await checkRequiredDocuments('uuid-do-candidato')
// console.log(`Documentos enviados: ${status.uploaded}/${status.total}`)
// console.log('Documentos faltando:', status.missing)

// ============================================
// 6. ATUALIZAR STATUS DE UM DOCUMENTO (ADMIN)
// ============================================

async function updateDocumentStatus(documentId, newStatus, reviewNotes = null) {
  const { data, error } = await supabase
    .from('candidate_documents')
    .update({
      status: newStatus,
      reviewed_at: new Date().toISOString(),
      review_notes: reviewNotes
    })
    .eq('id', documentId)
    .select()
    .single()

  if (error) {
    console.error('Erro ao atualizar status:', error)
    return null
  }

  console.log('Status atualizado:', data)
  return data
}

// Exemplo de uso:
// await updateDocumentStatus('doc-uuid', 'approved', 'Documento válido')
// await updateDocumentStatus('doc-uuid', 'rejected', 'Documento ilegível')

// ============================================
// 7. DELETAR DOCUMENTO (E ARQUIVO DO STORAGE)
// ============================================

async function deleteDocument(documentId) {
  try {
    // 1. Buscar informações do documento
    const { data: doc, error: fetchError } = await supabase
      .from('candidate_documents')
      .select('storage_path')
      .eq('id', documentId)
      .single()

    if (fetchError) throw fetchError

    // 2. Deletar arquivo do Storage
    const { error: storageError } = await supabase.storage
      .from('form-documents')
      .remove([doc.storage_path])

    if (storageError) throw storageError

    // 3. Deletar registro do banco
    const { error: deleteError } = await supabase
      .from('candidate_documents')
      .delete()
      .eq('id', documentId)

    if (deleteError) throw deleteError

    console.log('Documento deletado com sucesso')
    return true

  } catch (error) {
    console.error('Erro ao deletar documento:', error)
    return false
  }
}

// ============================================
// 8. COMPONENTE REACT PARA UPLOAD
// ============================================

import React, { useState } from 'react'

function DocumentUploadForm({ candidateId, documentTypeCode, onSuccess }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    
    // Validações
    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
      setError('Arquivo muito grande (máx: 10MB)')
      return
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Tipo de arquivo não permitido')
      return
    }

    setFile(selectedFile)
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file) {
      setError('Selecione um arquivo')
      return
    }

    setUploading(true)
    setError(null)

    const result = await uploadDocument(candidateId, documentTypeCode, file)

    if (result) {
      if (onSuccess) onSuccess(result)
      setFile(null)
    } else {
      setError('Erro ao enviar documento')
    }

    setUploading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png"
        disabled={uploading}
      />
      
      {error && <div className="error">{error}</div>}
      
      <button type="submit" disabled={!file || uploading}>
        {uploading ? 'Enviando...' : 'Enviar Documento'}
      </button>
    </form>
  )
}

export default DocumentUploadForm

// ============================================
// 9. LISTAR DOCUMENTOS COM STATUS (REACT)
// ============================================

function DocumentsList({ candidateId }) {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDocuments()
  }, [candidateId])

  const loadDocuments = async () => {
    setLoading(true)
    const docs = await getCandidateDocuments(candidateId)
    setDocuments(docs)
    setLoading(false)
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Pendente', color: 'orange' },
      approved: { label: 'Aprovado', color: 'green' },
      rejected: { label: 'Rejeitado', color: 'red' }
    }
    return badges[status] || { label: 'N/A', color: 'gray' }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="documents-list">
      <h3>Documentos do Candidato</h3>
      
      {documents.map(doc => (
        <div key={doc.document_id} className="document-item">
          <h4>{doc.document_name}</h4>
          
          {doc.storage_path ? (
            <>
              <span className={`badge badge-${getStatusBadge(doc.document_status).color}`}>
                {getStatusBadge(doc.document_status).label}
              </span>
              <p>Enviado em: {new Date(doc.uploaded_at).toLocaleDateString()}</p>
              <button onClick={() => viewDocument(doc.storage_path)}>
                Ver Documento
              </button>
            </>
          ) : (
            <span className="badge badge-gray">Não enviado</span>
          )}
          
          {doc.is_required && <span className="required">*Obrigatório</span>}
        </div>
      ))}
    </div>
  )
}

// ============================================
// 10. VALIDAÇÃO COMPLETA DO ONBOARDING
// ============================================

async function validateOnboarding(candidateId) {
  const status = await checkRequiredDocuments(candidateId)
  
  const validation = {
    isComplete: status.missing.length === 0,
    allApproved: status.pending.length === 0,
    percentage: (status.uploaded / status.total) * 100,
    missingDocuments: status.missing.map(d => d.document_name),
    pendingApproval: status.pending.map(d => d.document_name)
  }

  return validation
}

// Exemplo de uso:
// const validation = await validateOnboarding('uuid-do-candidato')
// if (validation.isComplete && validation.allApproved) {
//   console.log('Candidato pronto para começar!')
// } else {
//   console.log(`Progresso: ${validation.percentage}%`)
//   console.log('Documentos faltando:', validation.missingDocuments)
// }

// ============================================
// EXPORTAR FUNÇÕES
// ============================================

export {
  createCandidate,
  uploadDocument,
  getCandidateDocuments,
  getDocumentUrl,
  checkRequiredDocuments,
  updateDocumentStatus,
  deleteDocument,
  validateOnboarding
}
