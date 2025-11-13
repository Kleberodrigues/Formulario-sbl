/**
 * Validar Tipos de Documento no Supabase
 * Verifica se todos os documentos necessários para o formulário estão presentes
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Carregar variáveis de ambiente
config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY devem estar definidos no .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Documentos que o frontend espera (DocumentsUploadPage.js)
const REQUIRED_DOCS = [
  { code: 'right_to_work', name: 'Right to Work', required: true },
  { code: 'proof_of_address', name: 'Proof of Address', required: true },
  { code: 'national_insurance', name: 'National Insurance', required: true },
  { code: 'bank_statement', name: 'Bank Statement', required: true },
  { code: 'vat_certificate', name: 'VAT Certificate', required: false }
]

async function validateDocumentTypes() {
  console.log('========================================')
  console.log('🔍 VALIDAÇÃO DE TIPOS DE DOCUMENTO')
  console.log('========================================\n')

  console.log('📋 Documentos necessários para o formulário:\n')

  let allFound = true

  for (const doc of REQUIRED_DOCS) {
    const { data, error } = await supabase
      .from('document_types')
      .select('code, name, is_required')
      .eq('code', doc.code)
      .single()

    if (error) {
      console.log(`❌ ${doc.code}`)
      console.log(`   Status: NÃO ENCONTRADO`)
      console.log(`   Esperado: ${doc.name} ${doc.required ? '(obrigatório)' : '(opcional)'}`)
      console.log(`   Erro: ${error.message}\n`)
      allFound = false
    } else {
      console.log(`✅ ${doc.code}`)
      console.log(`   Nome: ${data.name}`)
      console.log(`   Status: ${data.is_required ? 'Obrigatório' : 'Opcional'}`)
      console.log(`   ID: ${data.id || 'N/A'}\n`)
    }
  }

  console.log('========================================')
  console.log('📊 RESULTADO')
  console.log('========================================\n')

  if (allFound) {
    console.log('✅ TODOS OS DOCUMENTOS NECESSÁRIOS ESTÃO PRESENTES!\n')
    console.log('🎉 Upload de documentos deve funcionar corretamente.\n')
    console.log('Próximos passos:')
    console.log('  1. Acesse http://localhost:3001/')
    console.log('  2. Preencha o formulário até o Step 12 (Documents Upload)')
    console.log('  3. Faça upload de todos os 5 documentos')
    console.log('  4. Verifique que não há mais erro 406\n')
  } else {
    console.log('❌ ALGUNS DOCUMENTOS AINDA ESTÃO FALTANDO\n')
    console.log('Execute o seguinte SQL no Supabase para adicionar os documentos faltantes:\n')

    for (const doc of REQUIRED_DOCS) {
      const { error } = await supabase
        .from('document_types')
        .select('code')
        .eq('code', doc.code)
        .single()

      if (error) {
        console.log(`INSERT INTO document_types (code, name, is_required, display_order)`)
        console.log(`VALUES ('${doc.code}', '${doc.name}', ${doc.required}, (SELECT MAX(display_order) + 1 FROM document_types));\n`)
      }
    }
  }

  console.log('========================================\n')
}

// Executar
validateDocumentTypes().catch(err => {
  console.error('❌ Erro ao validar tipos de documento:', err.message)
  process.exit(1)
})
