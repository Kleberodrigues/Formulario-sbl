/**
 * Script de Teste da Estrutura Supabase
 * Valida todas as tabelas, views, functions e testa CRUD
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function log(message, type = 'info') {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    step: '📍',
    test: '🧪'
  };
  console.log(`${icons[type]} ${message}`);
}

async function runTest(testName, testFn) {
  try {
    log(`Teste: ${testName}`, 'test');
    const result = await testFn();
    log(`  Passou: ${testName}`, 'success');
    return { success: true, result };
  } catch (error) {
    log(`  Falhou: ${testName} - ${error.message}`, 'error');
    return { success: false, error: error.message };
  }
}

// ============================================
// TESTES DE ESTRUTURA
// ============================================

async function testTableExists(tableName) {
  return runTest(`Tabela ${tableName} existe`, async () => {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error && error.code === '42P01') {
      throw new Error(`Tabela ${tableName} não existe`);
    }
    return true;
  });
}

async function testDocumentTypes() {
  return runTest('Tipos de documentos populados', async () => {
    const { data, error } = await supabase
      .from('document_types')
      .select('*')
      .order('display_order');

    if (error) throw error;

    if (!data || data.length === 0) {
      throw new Error('Nenhum tipo de documento encontrado');
    }

    console.log(`    ${data.length} tipos encontrados:`);
    data.forEach(type => {
      const required = type.is_required ? '[OBRIGATÓRIO]' : '[OPCIONAL]';
      console.log(`      ${type.display_order}. ${type.name} ${required}`);
    });

    return data;
  });
}

async function testViewExists() {
  return runTest('VIEW candidate_documents_view existe', async () => {
    const { data, error } = await supabase
      .from('candidate_documents_view')
      .select('*')
      .limit(1);

    if (error && error.code === '42P01') {
      throw new Error('VIEW não existe');
    }
    return true;
  });
}

async function testFunctionExists(functionName) {
  return runTest(`FUNCTION ${functionName} existe`, async () => {
    const { data, error } = await supabase
      .rpc(functionName, {});

    // Se a função existe mas dá erro de parâmetro, está OK
    if (error && error.message.includes('required argument')) {
      return true;
    }

    if (error && error.code === '42883') {
      throw new Error(`Função ${functionName} não existe`);
    }

    return true;
  });
}

// ============================================
// TESTES CRUD
// ============================================

async function testCreateCandidate() {
  return runTest('Criar candidato de teste', async () => {
    const testEmail = `test_${Date.now()}@example.com`;

    const { data, error } = await supabase
      .from('candidates')
      .insert({
        full_name: 'Test User',
        email: testEmail,
        phone_number: '+44 123 456 789',
        preferred_language: 'en',
        depot_location: 'Southampton',
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    console.log(`    Candidato criado: ${data.id}`);
    return data;
  });
}

async function testGetCandidateDocuments(candidateId) {
  return runTest('Buscar documentos do candidato (FUNCTION)', async () => {
    const { data, error } = await supabase
      .rpc('get_candidate_documents', { p_candidate_id: candidateId });

    if (error) throw error;

    console.log(`    ${data.length} tipos de documentos retornados`);
    console.log(`    Documentos obrigatórios: ${data.filter(d => d.is_required).length}`);
    return data;
  });
}

async function testGetCompletionStatus(candidateId) {
  return runTest('Verificar status de conclusão (FUNCTION)', async () => {
    const { data, error } = await supabase
      .rpc('get_candidate_completion_status', { p_candidate_id: candidateId });

    if (error) throw error;

    const status = data[0];
    console.log(`    Total obrigatórios: ${status.total_required}`);
    console.log(`    Total enviados: ${status.total_uploaded}`);
    console.log(`    Completo: ${status.is_complete ? 'Sim' : 'Não'}`);

    return status;
  });
}

async function testUploadDocument(candidateId) {
  return runTest('Upload de documento de teste', async () => {
    // Buscar ID do tipo "profile_photo"
    const { data: docType, error: docTypeError } = await supabase
      .from('document_types')
      .select('id')
      .eq('code', 'profile_photo')
      .single();

    if (docTypeError) throw docTypeError;

    // Criar documento de teste (sem arquivo real)
    const { data, error } = await supabase
      .from('candidate_documents')
      .insert({
        candidate_id: candidateId,
        document_type_id: docType.id,
        storage_bucket: 'form-documents',
        storage_path: `test/profile_photo_${Date.now()}.jpg`,
        original_filename: 'test_photo.jpg',
        file_size: 1024,
        mime_type: 'image/jpeg',
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    console.log(`    Documento criado: ${data.id}`);
    return data;
  });
}

async function testUpdateDocumentStatus(documentId) {
  return runTest('Atualizar status do documento', async () => {
    const { data, error } = await supabase
      .from('candidate_documents')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        review_notes: 'Documento de teste aprovado automaticamente'
      })
      .eq('id', documentId)
      .select()
      .single();

    if (error) throw error;

    console.log(`    Status atualizado para: ${data.status}`);
    return data;
  });
}

async function testCandidateDocumentsView() {
  return runTest('Consultar VIEW candidate_documents_view', async () => {
    const { data, error } = await supabase
      .from('candidate_documents_view')
      .select('*')
      .limit(5);

    if (error) throw error;

    console.log(`    ${data.length} registros na view`);
    return data;
  });
}

async function testCleanup(candidateId) {
  return runTest('Limpar dados de teste', async () => {
    // Deletar candidato (CASCADE deleta documentos)
    const { error } = await supabase
      .from('candidates')
      .delete()
      .eq('id', candidateId);

    if (error) throw error;

    console.log(`    Candidato ${candidateId} deletado`);
    return true;
  });
}

// ============================================
// FLUXO PRINCIPAL
// ============================================

async function main() {
  console.log('\n========================================');
  console.log('🧪 TESTE DA ESTRUTURA SUPABASE');
  console.log('========================================\n');

  const results = {
    total: 0,
    passed: 0,
    failed: 0
  };

  // Fase 1: Verificar Estrutura
  log('FASE 1: Verificação de Estrutura', 'step');

  const structureTests = [
    () => testTableExists('candidates'),
    () => testTableExists('document_types'),
    () => testTableExists('candidate_documents'),
    () => testDocumentTypes(),
    () => testViewExists(),
    () => testFunctionExists('get_candidate_documents'),
    () => testFunctionExists('get_candidate_completion_status'),
    () => testFunctionExists('migrate_form_submission_to_candidate')
  ];

  for (const test of structureTests) {
    const result = await test();
    results.total++;
    result.success ? results.passed++ : results.failed++;
  }

  // Se estrutura não está OK, parar
  if (results.failed > 0) {
    log('\n⚠️  Estrutura incompleta. Execute supabase-migration.sql primeiro!', 'error');
    return;
  }

  // Fase 2: Testes CRUD
  log('\nFASE 2: Testes CRUD', 'step');

  let candidateId = null;
  let documentId = null;

  // Criar candidato
  const createResult = await testCreateCandidate();
  results.total++;
  if (createResult.success) {
    results.passed++;
    candidateId = createResult.result.id;
  } else {
    results.failed++;
    log('Não foi possível continuar testes CRUD', 'error');
    return;
  }

  // Testes com o candidato criado
  const crudTests = [
    () => testGetCandidateDocuments(candidateId),
    () => testGetCompletionStatus(candidateId),
    () => testUploadDocument(candidateId),
    () => testCandidateDocumentsView()
  ];

  for (const test of crudTests) {
    const result = await test();
    results.total++;
    result.success ? results.passed++ : results.failed++;

    // Guardar documentId para próximo teste
    if (result.success && result.result && result.result.id) {
      documentId = result.result.id;
    }
  }

  // Atualizar status do documento
  if (documentId) {
    const updateResult = await testUpdateDocumentStatus(documentId);
    results.total++;
    updateResult.success ? results.passed++ : results.failed++;
  }

  // Fase 3: Verificação Pós-Update
  log('\nFASE 3: Verificação Pós-Update', 'step');

  const postTests = [
    () => testGetCompletionStatus(candidateId)
  ];

  for (const test of postTests) {
    const result = await test();
    results.total++;
    result.success ? results.passed++ : results.failed++;
  }

  // Fase 4: Cleanup
  log('\nFASE 4: Limpeza', 'step');

  const cleanupResult = await testCleanup(candidateId);
  results.total++;
  cleanupResult.success ? results.passed++ : results.failed++;

  // Relatório Final
  console.log('\n========================================');
  console.log('📊 RELATÓRIO DE TESTES');
  console.log('========================================\n');
  console.log(`Total de testes: ${results.total}`);
  console.log(`✅ Passou: ${results.passed}`);
  console.log(`❌ Falhou: ${results.failed}`);
  console.log(`📈 Taxa de sucesso: ${((results.passed / results.total) * 100).toFixed(2)}%`);
  console.log('\n========================================\n');

  if (results.failed === 0) {
    log('Todos os testes passaram! Estrutura 100% funcional! 🎉', 'success');
  } else {
    log(`${results.failed} teste(s) falharam. Verifique os logs acima.`, 'warning');
  }
}

// ============================================
// EXECUÇÃO
// ============================================

main().catch(error => {
  log(`Erro fatal: ${error.message}`, 'error');
  console.error(error);
  process.exit(1);
});
