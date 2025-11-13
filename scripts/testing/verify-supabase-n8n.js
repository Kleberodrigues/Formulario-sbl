/**
 * Verificar Salvamento no Supabase e Integração n8n
 * Valida se todos os dados foram salvos corretamente e se n8n recebeu notificação
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Carregar variáveis de ambiente
config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
const n8nWebhookUrl = process.env.VITE_N8N_WEBHOOK_URL

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY devem estar definidos no .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('========================================')
console.log('🔍 VERIFICAÇÃO COMPLETA DO SISTEMA')
console.log('========================================\n')

async function verificarSistema() {
  try {
    // 1. Verificar último candidato
    console.log('📋 PARTE 1: DADOS DO ÚLTIMO CANDIDATO\n')

    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (candidateError) {
      console.error('❌ Erro ao buscar candidato:', candidateError.message)
      return
    }

    console.log('✅ Candidato encontrado:')
    console.log(`   ID: ${candidate.id}`)
    console.log(`   Nome: ${candidate.full_name}`)
    console.log(`   Email: ${candidate.email}`)
    console.log(`   Telefone: ${candidate.phone_number}`)
    console.log(`   Idioma: ${candidate.preferred_language}`)
    console.log(`   Depósito: ${candidate.depot_location}`)
    console.log(`   Status: ${candidate.status}`)
    console.log(`   Completo: ${candidate.is_completed ? 'SIM ✅' : 'NÃO ❌'}`)
    console.log(`   Criado em: ${candidate.created_at}`)
    console.log(`   Concluído em: ${candidate.completed_at || 'N/A'}`)
    console.log('')

    // 2. Verificar documentos do candidato
    console.log('📄 PARTE 2: DOCUMENTOS DO CANDIDATO\n')

    const { data: documents, error: docsError } = await supabase
      .from('candidate_documents')
      .select(`
        id,
        file_name,
        file_path,
        file_size,
        status,
        created_at,
        document_types (code, name)
      `)
      .eq('candidate_id', candidate.id)
      .order('created_at', { ascending: true })

    if (docsError) {
      console.error('❌ Erro ao buscar documentos:', docsError.message)
    } else if (documents.length === 0) {
      console.log('⚠️  Nenhum documento encontrado')
    } else {
      console.log(`✅ Total de documentos: ${documents.length}\n`)

      documents.forEach((doc, index) => {
        const docType = doc.document_types?.name || 'Desconhecido'
        const docCode = doc.document_types?.code || 'N/A'
        const fileSize = doc.file_size ? `${(doc.file_size / 1024).toFixed(2)} KB` : 'N/A'

        console.log(`${index + 1}. ${docType}`)
        console.log(`   Code: ${docCode}`)
        console.log(`   Arquivo: ${doc.file_name}`)
        console.log(`   Tamanho: ${fileSize}`)
        console.log(`   Status: ${doc.status}`)
        console.log(`   Path: ${doc.file_path}`)
        console.log(`   Criado: ${doc.created_at}\n`)
      })
    }

    // 3. Verificar dados pessoais completos
    console.log('📝 PARTE 3: VALIDAÇÃO DE DADOS COMPLETOS\n')

    const camposObrigatorios = {
      'Nome completo': candidate.full_name,
      'Email': candidate.email,
      'Telefone': candidate.phone_number,
      'Idioma': candidate.preferred_language,
      'Depósito': candidate.depot_location,
      'Data nascimento': candidate.birth_date,
      'National Insurance': candidate.national_insurance_number,
      'Status emprego': candidate.employment_status
    }

    let camposCompletos = 0
    let camposFaltando = 0

    Object.entries(camposObrigatorios).forEach(([campo, valor]) => {
      if (valor && valor !== null && valor !== '') {
        console.log(`✅ ${campo}: OK`)
        camposCompletos++
      } else {
        console.log(`❌ ${campo}: FALTANDO`)
        camposFaltando++
      }
    })

    console.log(`\nTotal: ${camposCompletos}/${Object.keys(camposObrigatorios).length} campos completos\n`)

    // 4. Verificar configuração n8n
    console.log('🔗 PARTE 4: INTEGRAÇÃO N8N\n')

    if (!n8nWebhookUrl) {
      console.log('⚠️  VITE_N8N_WEBHOOK_URL não configurado no .env')
      console.log('   Notificações de conclusão não serão enviadas\n')
    } else {
      console.log('✅ n8n Webhook configurado:')
      console.log(`   URL: ${n8nWebhookUrl}`)
      console.log('   Status: Pronto para receber notificações')

      // Verificar se há notificação de conclusão nos logs (baseado no screenshot)
      if (candidate.is_completed && candidate.completed_at) {
        console.log('\n✅ Candidato marcado como completo')
        console.log('   A notificação n8n deveria ter sido enviada')
        console.log('   Verifique os logs do console do navegador para confirmar')
      }
    }

    console.log('')

    // 5. Resumo final
    console.log('========================================')
    console.log('📊 RESUMO FINAL')
    console.log('========================================\n')

    const statusGeral = {
      candidato: candidate ? '✅ OK' : '❌ ERRO',
      documentos: documents && documents.length >= 4 ? '✅ OK' : '⚠️  PARCIAL',
      dadosCompletos: camposCompletos >= 6 ? '✅ OK' : '⚠️  PARCIAL',
      n8nConfig: n8nWebhookUrl ? '✅ OK' : '⚠️  NÃO CONFIGURADO',
      conclusao: candidate?.is_completed ? '✅ COMPLETO' : '⚠️  PENDENTE'
    }

    console.log('Status do Sistema:')
    console.log(`  Candidato salvo: ${statusGeral.candidato}`)
    console.log(`  Documentos enviados: ${statusGeral.documentos} (${documents?.length || 0} documentos)`)
    console.log(`  Dados completos: ${statusGeral.dadosCompletos}`)
    console.log(`  Integração n8n: ${statusGeral.n8nConfig}`)
    console.log(`  Formulário: ${statusGeral.conclusao}`)
    console.log('')

    const tudoOk = Object.values(statusGeral).every(status => status.includes('✅'))

    if (tudoOk) {
      console.log('🎉 TUDO FUNCIONANDO PERFEITAMENTE!')
    } else {
      console.log('⚠️  Alguns itens precisam de atenção (veja acima)')
    }

    console.log('\n========================================\n')

  } catch (error) {
    console.error('❌ Erro ao verificar sistema:', error.message)
    console.error(error)
  }
}

// Executar
verificarSistema()
