/**
 * Script de Migração Supabase
 * Executa a migração de form_submissions para a estrutura normalizada
 *
 * Uso: node migrate-supabase.js [--dry-run] [--all]
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// CONFIGURAÇÃO
// ============================================

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  console.error('   Configure VITE_SUPABASE_URL e SUPABASE_SERVICE_KEY no .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Argumentos da linha de comando
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const migrateAll = args.includes('--all');

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function log(message, type = 'info') {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    step: '📍'
  };
  console.log(`${icons[type]} ${message}`);
}

async function checkDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .select('id')
      .limit(1);

    if (error) throw error;

    log('Conexão com Supabase estabelecida', 'success');
    return true;
  } catch (error) {
    log(`Erro ao conectar com Supabase: ${error.message}`, 'error');
    return false;
  }
}

async function executeSQL() {
  try {
    log('Executando script SQL de migração...', 'step');

    const sqlPath = path.join(__dirname, 'supabase-migration.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Nota: O SDK do Supabase não suporta execução direta de SQL multi-statement
    // O SQL deve ser executado manualmente no Supabase Dashboard > SQL Editor

    log('Script SQL pronto para execução manual', 'warning');
    log('Execute o arquivo supabase-migration.sql no Supabase Dashboard > SQL Editor', 'info');

    return true;
  } catch (error) {
    log(`Erro ao ler script SQL: ${error.message}`, 'error');
    return false;
  }
}

async function checkTablesExist() {
  try {
    log('Verificando se tabelas foram criadas...', 'step');

    // Verificar se tabela candidates existe
    const { error: candidatesError } = await supabase
      .from('candidates')
      .select('id')
      .limit(1);

    if (candidatesError && candidatesError.code === '42P01') {
      log('Tabela candidates não existe. Execute o script SQL primeiro!', 'error');
      return false;
    }

    // Verificar se tabela document_types existe
    const { error: docTypesError } = await supabase
      .from('document_types')
      .select('id')
      .limit(1);

    if (docTypesError && docTypesError.code === '42P01') {
      log('Tabela document_types não existe. Execute o script SQL primeiro!', 'error');
      return false;
    }

    // Verificar se tabela candidate_documents existe
    const { error: docError } = await supabase
      .from('candidate_documents')
      .select('id')
      .limit(1);

    if (docError && docError.code === '42P01') {
      log('Tabela candidate_documents não existe. Execute o script SQL primeiro!', 'error');
      return false;
    }

    log('Todas as tabelas existem!', 'success');
    return true;
  } catch (error) {
    log(`Erro ao verificar tabelas: ${error.message}`, 'error');
    return false;
  }
}

async function getCompletedSubmissions() {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .select('id, email, full_name, is_completed, completed_at')
      .eq('is_completed', true)
      .order('completed_at', { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    log(`Erro ao buscar submissions: ${error.message}`, 'error');
    return [];
  }
}

async function migrateSubmission(submissionId, email) {
  try {
    const { data, error } = await supabase
      .rpc('migrate_form_submission_to_candidate', { p_submission_id: submissionId });

    if (error) throw error;

    return {
      success: true,
      candidateId: data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function migrateAllSubmissions() {
  try {
    log('Iniciando migração de todos os formulários completados...', 'step');

    const { data, error } = await supabase
      .rpc('migrate_all_completed_submissions');

    if (error) throw error;

    return data || [];
  } catch (error) {
    log(`Erro ao migrar todos os submissions: ${error.message}`, 'error');
    return [];
  }
}

async function generateReport(results) {
  const total = results.length;
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log('\n========================================');
  console.log('📊 RELATÓRIO DE MIGRAÇÃO');
  console.log('========================================\n');
  console.log(`Total de registros: ${total}`);
  console.log(`✅ Sucesso: ${successful}`);
  console.log(`❌ Falhas: ${failed}`);
  console.log(`📈 Taxa de sucesso: ${((successful / total) * 100).toFixed(2)}%`);

  if (failed > 0) {
    console.log('\n⚠️  Registros com falha:');
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   - ${r.email}: ${r.error_message}`);
      });
  }

  console.log('\n========================================\n');
}

// ============================================
// FLUXO PRINCIPAL
// ============================================

async function main() {
  console.log('\n========================================');
  console.log('🚀 MIGRAÇÃO SUPABASE - SBL ONBOARDING');
  console.log('========================================\n');

  if (isDryRun) {
    log('Modo DRY RUN - nenhuma alteração será feita', 'warning');
  }

  // 1. Verificar conexão
  log('Passo 1: Verificando conexão com Supabase...', 'step');
  const connected = await checkDatabaseConnection();
  if (!connected) {
    log('Não foi possível conectar ao Supabase', 'error');
    process.exit(1);
  }

  // 2. Verificar se tabelas existem
  log('\nPasso 2: Verificando estrutura do banco de dados...', 'step');
  const tablesExist = await checkTablesExist();

  if (!tablesExist) {
    log('\n⚠️  AÇÃO NECESSÁRIA:', 'warning');
    log('Execute o script SQL antes de continuar:', 'info');
    log('1. Abra Supabase Dashboard > SQL Editor', 'info');
    log('2. Copie e cole o conteúdo de supabase-migration.sql', 'info');
    log('3. Execute o script', 'info');
    log('4. Execute este script novamente\n', 'info');
    process.exit(1);
  }

  // 3. Buscar submissions completados
  log('\nPasso 3: Buscando formulários completados...', 'step');
  const submissions = await getCompletedSubmissions();

  if (submissions.length === 0) {
    log('Nenhum formulário completado encontrado', 'info');
    process.exit(0);
  }

  log(`Encontrados ${submissions.length} formulários completados`, 'success');

  if (isDryRun) {
    log('\nFormulários que seriam migrados:', 'info');
    submissions.forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.email} (${s.full_name || 'Sem nome'})`);
    });
    log('\nExecute sem --dry-run para realizar a migração', 'info');
    process.exit(0);
  }

  // 4. Confirmar migração
  if (!migrateAll) {
    log('\n⚠️  Use --all para confirmar a migração de todos os registros', 'warning');
    log('Exemplo: node migrate-supabase.js --all', 'info');
    process.exit(0);
  }

  // 5. Executar migração
  log('\nPasso 4: Executando migração...', 'step');
  const results = await migrateAllSubmissions();

  // 6. Gerar relatório
  log('\nPasso 5: Gerando relatório...', 'step');
  await generateReport(results);

  log('Migração concluída!', 'success');
}

// ============================================
// EXECUÇÃO
// ============================================

main().catch(error => {
  log(`Erro fatal: ${error.message}`, 'error');
  console.error(error);
  process.exit(1);
});
