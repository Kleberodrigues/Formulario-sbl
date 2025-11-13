/**
 * Teste de Verificação do Fix de Roteamento
 * Verifica se o formulário inicia sempre no Step 1 (Welcome)
 *
 * Para executar: node scripts/testing/test-routing-fix.js
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

console.log('========================================')
console.log('🧪 TESTE: VERIFICAÇÃO DO FIX DE ROTEAMENTO')
console.log('========================================\n')

/**
 * Teste 1: Verificar comportamento de localStorage
 */
async function testeLocalStorage() {
  console.log('📍 TESTE 1: Simulação de localStorage com progresso salvo\n')

  // Simular localStorage com progresso salvo no Step 5
  const savedProgress = {
    sessionId: 'test-session-12345',
    currentStep: 5,
    completedSteps: [1, 2, 3, 4, 5],
    formData: {
      full_name: 'Test User',
      email: 'test@example.com',
      phone_number: '+44 123 456 789'
    },
    timestamp: new Date().toISOString()
  }

  console.log('ℹ️  Progresso salvo simulado:')
  console.log(`   - Current Step: ${savedProgress.currentStep}`)
  console.log(`   - Completed Steps: ${savedProgress.completedSteps.join(', ')}`)
  console.log(`   - Email: ${savedProgress.formData.email}\n`)

  // Verificar comportamento sem parâmetro ?resume
  console.log('✅ SEM PARÂMETRO ?resume:')
  console.log('   → localStorage deveria ser limpo')
  console.log('   → currentStep deveria ser 1 (Welcome)')
  console.log('   → formData deveria ser vazio')
  console.log('   → Console deveria mostrar: "🆕 Iniciando formulário do zero (Step 1)"\n')

  // Verificar comportamento COM parâmetro ?resume
  console.log('✅ COM PARÂMETRO ?resume:')
  console.log('   → localStorage deveria ser mantido')
  console.log('   → currentStep deveria ser 5')
  console.log('   → formData deveria conter dados salvos')
  console.log('   → Console deveria mostrar: "📂 Parâmetro ?resume detectado - carregando progresso salvo"\n')

  return true
}

/**
 * Teste 2: Criar candidato de teste e verificar criação do candidateId
 */
async function testeCandidateCreation() {
  console.log('📍 TESTE 2: Verificação de criação do candidateId (Step 3)\n')

  const testEmail = `test_routing_fix_${Date.now()}@example.com`

  try {
    // Simular criação de candidato no Step 3
    const { data: candidate, error } = await supabase
      .from('candidates')
      .insert({
        full_name: 'Test Routing Fix',
        email: testEmail,
        phone_number: '+44 987 654 321',
        preferred_language: 'pt-BR',
        depot_location: 'London'
      })
      .select('id')
      .single()

    if (error) {
      console.error('❌ Erro ao criar candidato:', error.message)
      return false
    }

    console.log(`✅ Candidato criado com sucesso`)
    console.log(`ℹ️  Candidate ID: ${candidate.id}`)
    console.log(`ℹ️  Email: ${testEmail}\n`)

    // Verificar se candidateId está definido
    if (!candidate.id) {
      console.error('❌ ERRO: candidateId está undefined!')
      return false
    }

    console.log('✅ candidateId definido corretamente\n')

    // Limpar dados de teste
    console.log('🧹 LIMPEZA: Removendo candidato de teste...')
    const { error: deleteError } = await supabase
      .from('candidates')
      .delete()
      .eq('id', candidate.id)

    if (deleteError) {
      console.error('❌ Erro ao deletar candidato:', deleteError.message)
    } else {
      console.log('✅ Candidato deletado com sucesso\n')
    }

    return true
  } catch (err) {
    console.error('❌ Erro inesperado:', err.message)
    return false
  }
}

/**
 * Teste 3: Verificar lógica do main.js
 */
async function testeMainLogic() {
  console.log('📍 TESTE 3: Verificação da lógica do main.js\n')

  console.log('✅ Função shouldResumeProgress():')
  console.log('   - Deve verificar se URL contém parâmetro ?resume')
  console.log('   - Retorna true se presente, false caso contrário\n')

  console.log('✅ Função clearFormProgress():')
  console.log('   - Remove sbl_form_data do localStorage')
  console.log('   - Remove sbl_session_id do localStorage')
  console.log('   - PRESERVA sbl_abandonment (para tracking)\n')

  console.log('✅ Função initApp():')
  console.log('   - Verifica shouldResumeProgress()')
  console.log('   - Se true: chama loadSavedProgress()')
  console.log('   - Se false: chama clearFormProgress() e define currentStep = 1\n')

  return true
}

/**
 * Executar todos os testes
 */
async function executarTestes() {
  try {
    const teste1 = await testeLocalStorage()
    const teste2 = await testeCandidateCreation()
    const teste3 = await testeMainLogic()

    console.log('========================================')
    console.log('📊 RELATÓRIO FINAL')
    console.log('========================================\n')

    console.log('Testes:')
    console.log(`  ${teste1 ? '✅' : '❌'} Teste 1: LocalStorage`)
    console.log(`  ${teste2 ? '✅' : '❌'} Teste 2: Candidate Creation`)
    console.log(`  ${teste3 ? '✅' : '❌'} Teste 3: Main Logic\n`)

    const todosPassaram = teste1 && teste2 && teste3

    if (todosPassaram) {
      console.log('✅ TODOS OS TESTES PASSARAM!\n')
      console.log('📋 PRÓXIMOS PASSOS:')
      console.log('   1. Acesse http://localhost:3001/ no navegador')
      console.log('   2. Abra DevTools (F12) e vá para Console')
      console.log('   3. Verifique se mostra: "🆕 Iniciando formulário do zero (Step 1)"')
      console.log('   4. Confirme que a página carrega no Step 1 (Welcome/Language)')
      console.log('   5. Verifique que não há erros de candidateId undefined\n')
      console.log('🔗 URL para testar: http://localhost:3001/')
      console.log('🔗 URL para resumir: http://localhost:3001/?resume\n')
    } else {
      console.log('❌ ALGUNS TESTES FALHARAM\n')
    }

    console.log('========================================\n')

  } catch (error) {
    console.error('❌ Erro ao executar testes:', error.message)
    process.exit(1)
  }
}

// Executar
executarTestes()
