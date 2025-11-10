/**
 * Script para Popular Tipos de Documentos
 * Executa o INSERT dos 13 tipos de documentos
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const documentTypes = [
  {
    code: 'form_enderecos',
    name: 'Formulário de Endereços',
    description: 'Formulário completo com dados de endereço',
    is_required: true,
    display_order: 1
  },
  {
    code: 'contract_recorrente',
    name: 'Contrato Recorrente',
    description: 'Contrato de prestação de serviços recorrente',
    is_required: true,
    display_order: 2
  },
  {
    code: 'proof_of_address',
    name: 'Comprovante de Endereço',
    description: 'Conta de água, luz, gás ou telefone (últimos 3 meses)',
    is_required: true,
    display_order: 3
  },
  {
    code: 'right_to_work',
    name: 'Direito ao Trabalho',
    description: 'Documento que comprova elegibilidade para trabalho no Reino Unido',
    is_required: true,
    display_order: 4
  },
  {
    code: 'caf_certificate',
    name: 'Certificado CAF',
    description: 'Certificate of Application Form',
    is_required: true,
    display_order: 5
  },
  {
    code: 'driver_license',
    name: 'Carteira de Motorista',
    description: 'CNH ou Driver License válida',
    is_required: true,
    display_order: 6
  },
  {
    code: 'vehicle_insurance',
    name: 'Seguro do Veículo',
    description: 'Apólice de seguro do veículo',
    is_required: false,
    display_order: 7
  },
  {
    code: 'vehicle_mot',
    name: 'MOT do Veículo',
    description: 'Certificado de inspeção técnica do veículo',
    is_required: false,
    display_order: 8
  },
  {
    code: 'bank_statement',
    name: 'Extrato Bancário',
    description: 'Extrato bancário recente (últimos 3 meses)',
    is_required: false,
    display_order: 9
  },
  {
    code: 'national_insurance',
    name: 'National Insurance',
    description: 'Número de National Insurance',
    is_required: true,
    display_order: 10
  },
  {
    code: 'passport',
    name: 'Passaporte',
    description: 'Cópia do passaporte válido',
    is_required: false,
    display_order: 11
  },
  {
    code: 'visa',
    name: 'Visto',
    description: 'Visto de trabalho (se aplicável)',
    is_required: false,
    display_order: 12
  },
  {
    code: 'profile_photo',
    name: 'Foto de Perfil',
    description: 'Foto para o perfil do candidato',
    is_required: false,
    display_order: 13
  }
];

async function main() {
  console.log('🚀 Populando tipos de documentos...\n');

  // Verificar quantos já existem
  const { data: existing, error: countError } = await supabase
    .from('document_types')
    .select('code');

  if (countError) {
    console.error('❌ Erro ao verificar tipos existentes:', countError.message);
    process.exit(1);
  }

  console.log(`ℹ️  ${existing.length} tipos já existem no banco\n`);

  if (existing.length === 13) {
    console.log('✅ Todos os 13 tipos já estão populados!');

    // Listar os tipos
    const { data: all, error: listError } = await supabase
      .from('document_types')
      .select('*')
      .order('display_order');

    if (!listError) {
      console.log('\n📋 Tipos de documentos:\n');
      all.forEach(type => {
        const required = type.is_required ? '[OBRIGATÓRIO]' : '[OPCIONAL]';
        console.log(`  ${type.display_order}. ${type.name} ${required}`);
        console.log(`     Código: ${type.code}`);
      });
    }

    return;
  }

  // Inserir tipos que não existem
  console.log('📥 Inserindo tipos de documentos...\n');

  let inserted = 0;
  let skipped = 0;

  for (const docType of documentTypes) {
    // Verificar se já existe
    const exists = existing.find(e => e.code === docType.code);

    if (exists) {
      console.log(`⏭️  Pulando: ${docType.name} (já existe)`);
      skipped++;
      continue;
    }

    // Inserir
    const { error } = await supabase
      .from('document_types')
      .insert(docType);

    if (error) {
      console.error(`❌ Erro ao inserir ${docType.name}:`, error.message);
    } else {
      console.log(`✅ Inserido: ${docType.name}`);
      inserted++;
    }
  }

  console.log('\n========================================');
  console.log('📊 RESUMO');
  console.log('========================================');
  console.log(`Total: ${documentTypes.length}`);
  console.log(`✅ Inseridos: ${inserted}`);
  console.log(`⏭️  Pulados: ${skipped}`);
  console.log('========================================\n');

  // Listar todos
  const { data: all, error: listError } = await supabase
    .from('document_types')
    .select('*')
    .order('display_order');

  if (listError) {
    console.error('❌ Erro ao listar tipos:', listError.message);
    return;
  }

  console.log('📋 Tipos de documentos cadastrados:\n');
  all.forEach(type => {
    const required = type.is_required ? '[OBRIGATÓRIO]' : '[OPCIONAL]';
    console.log(`  ${type.display_order}. ${type.name} ${required}`);
  });

  console.log('\n✅ Configuração completa!');
}

main().catch(error => {
  console.error('❌ Erro fatal:', error.message);
  process.exit(1);
});
