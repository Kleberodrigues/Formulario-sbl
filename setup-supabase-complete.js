/**
 * Script Completo de Setup do Supabase
 * Cria tabelas E popula dados em uma única execução
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

// Extrair project ref da URL
const projectRef = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');

// API REST do Supabase para executar SQL
const SUPABASE_SQL_API = `https://${projectRef}.supabase.co/rest/v1/rpc/sql_query`;

async function executeSQLDirect(sql) {
  try {
    const response = await fetch(SUPABASE_SQL_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      },
      body: JSON.stringify({ query: sql })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    return data;
  } catch (error) {
    throw new Error(`Erro ao executar SQL: ${error.message}`);
  }
}

async function checkTableExists(tableName) {
  const sql = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = '${tableName}'
    );
  `;

  try {
    const result = await executeSQLDirect(sql);
    return result[0]?.exists || false;
  } catch (error) {
    console.log(`⚠️  Não foi possível verificar tabela ${tableName}: ${error.message}`);
    return false;
  }
}

async function createTablesSQL() {
  console.log('📍 Criando tabelas no Supabase...\n');

  const sqlFile = path.join(__dirname, 'supabase-migration.sql');

  if (!fs.existsSync(sqlFile)) {
    throw new Error('Arquivo supabase-migration.sql não encontrado!');
  }

  const sql = fs.readFileSync(sqlFile, 'utf-8');

  // O Supabase não aceita executar SQL multi-statement via API
  // Então vamos instruir o usuário a executar manualmente
  console.log('⚠️  O Supabase REST API não suporta execução de SQL multi-statement.');
  console.log('ℹ️  Você precisa executar o SQL manualmente no Dashboard.\n');
  console.log('📋 INSTRUÇÕES:');
  console.log('1. Abra: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
  console.log('2. Copie o conteúdo de: supabase-migration.sql');
  console.log('3. Cole no editor SQL');
  console.log('4. Clique em "Run" ou pressione Ctrl+Enter');
  console.log('5. Aguarde a execução completar');
  console.log('6. Execute este script novamente\n');

  return false;
}

async function main() {
  console.log('\n========================================');
  console.log('🚀 SETUP COMPLETO DO SUPABASE');
  console.log('========================================\n');

  console.log(`📍 Projeto: ${projectRef}`);
  console.log(`📍 URL: ${SUPABASE_URL}\n`);

  // Verificar se tabelas existem
  console.log('📍 Verificando tabelas...\n');

  const candidates = await checkTableExists('candidates');
  const document_types = await checkTableExists('document_types');
  const candidate_documents = await checkTableExists('candidate_documents');

  console.log(`${candidates ? '✅' : '❌'} candidates`);
  console.log(`${document_types ? '✅' : '❌'} document_types`);
  console.log(`${candidate_documents ? '✅' : '❌'} candidate_documents\n`);

  if (!candidates || !document_types || !candidate_documents) {
    console.log('⚠️  Tabelas não encontradas!\n');
    await createTablesSQL();
    process.exit(1);
  }

  console.log('✅ Todas as tabelas existem!\n');

  // Verificar se document_types está populado
  console.log('📍 Verificando tipos de documentos...\n');

  try {
    const countSQL = `SELECT COUNT(*) as count FROM document_types;`;
    const countResult = await executeSQLDirect(countSQL);
    const count = parseInt(countResult[0]?.count || 0);

    console.log(`ℹ️  ${count} tipos de documentos encontrados\n`);

    if (count === 0) {
      console.log('📥 Populando tipos de documentos...\n');

      const insertSQL = `
        INSERT INTO document_types (code, name, description, is_required, display_order) VALUES
        ('form_enderecos', 'Formulário de Endereços', 'Formulário completo com dados de endereço', true, 1),
        ('contract_recorrente', 'Contrato Recorrente', 'Contrato de prestação de serviços recorrente', true, 2),
        ('proof_of_address', 'Comprovante de Endereço', 'Conta de água, luz, gás ou telefone (últimos 3 meses)', true, 3),
        ('right_to_work', 'Direito ao Trabalho', 'Documento que comprova elegibilidade para trabalho no Reino Unido', true, 4),
        ('caf_certificate', 'Certificado CAF', 'Certificate of Application Form', true, 5),
        ('driver_license', 'Carteira de Motorista', 'CNH ou Driver License válida', true, 6),
        ('vehicle_insurance', 'Seguro do Veículo', 'Apólice de seguro do veículo', false, 7),
        ('vehicle_mot', 'MOT do Veículo', 'Certificado de inspeção técnica do veículo', false, 8),
        ('bank_statement', 'Extrato Bancário', 'Extrato bancário recente (últimos 3 meses)', false, 9),
        ('national_insurance', 'National Insurance', 'Número de National Insurance', true, 10),
        ('passport', 'Passaporte', 'Cópia do passaporte válido', false, 11),
        ('visa', 'Visto', 'Visto de trabalho (se aplicável)', false, 12),
        ('profile_photo', 'Foto de Perfil', 'Foto para o perfil do candidato', false, 13)
        ON CONFLICT (code) DO NOTHING;
      `;

      await executeSQLDirect(insertSQL);
      console.log('✅ Tipos de documentos inseridos!\n');
    }

    // Listar tipos
    const listSQL = `SELECT * FROM document_types ORDER BY display_order;`;
    const types = await executeSQLDirect(listSQL);

    console.log('📋 Tipos de documentos cadastrados:\n');
    types.forEach(type => {
      const required = type.is_required ? '[OBRIGATÓRIO]' : '[OPCIONAL]';
      console.log(`  ${type.display_order}. ${type.name} ${required}`);
    });

    console.log('\n✅ Setup completo! Estrutura 100% configurada!');
    console.log('\n🧪 Execute: npm run test:supabase para testar');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Erro fatal:', error.message);
  process.exit(1);
});
