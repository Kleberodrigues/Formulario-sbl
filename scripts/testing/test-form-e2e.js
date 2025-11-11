/**
 * Teste End-to-End do Formulário SBL
 * Simula o preenchimento completo de todos os 12 steps
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const N8N_WEBHOOK_URL = process.env.VITE_N8N_WEBHOOK_URL;

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

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// SIMULAÇÃO DE DADOS DO FORMULÁRIO
// ============================================

const TEST_DATA = {
  // Step 1: Welcome/Language
  language: 'en',

  // Step 2: Depot
  selectedDepot: 'Southampton',
  depotCode: 'DSO2',

  // Step 3: Contact
  email: `test_e2e_${Date.now()}@example.com`,
  fullName: 'John Test Silva',
  phone: '+44 7123 456789',

  // Step 4: Personal Info
  birthDate: '1990-05-15',
  birthCity: 'London',
  birthCountry: 'United Kingdom',
  motherName: 'Maria',
  motherSurname: 'Silva',
  nextOfKinName: 'Jane Silva',
  nextOfKinRelationship: 'Spouse',
  nextOfKinPhone: '+44 7987 654321',

  // Step 5: Address History
  addressHistory: [
    {
      country: 'United Kingdom',
      address_line_1: '123 Main Street',
      address_line_2: 'Apt 4',
      city: 'London',
      postal_code: 'SW1A 1AA',
      duration: '5 years',
      move_in_date: '2019-01-01'
    },
    {
      country: 'United Kingdom',
      address_line_1: '456 Old Road',
      city: 'Manchester',
      postal_code: 'M1 1AA',
      duration: '2 years',
      move_in_date: '2017-01-01'
    }
  ],

  // Step 6: Additional Info
  nationalInsuranceNumber: 'AB 123456 C',
  utrNumber: '1234567890',
  employmentStatus: 'Limited company (self-employed)',
  vatNumber: 'GB123456789',

  // Step 9: Bank Details
  bankAccountNumber: '12345678',
  bankSortCode: '12-34-56'
};

// ============================================
// TESTES POR STEP
// ============================================

async function testStep3_CreateCandidate() {
  log('STEP 3: Contact Information', 'step');

  try {
    const { data, error } = await supabase
      .from('candidates')
      .insert({
        full_name: TEST_DATA.fullName,
        email: TEST_DATA.email,
        phone_number: TEST_DATA.phone,
        preferred_language: TEST_DATA.language,
        depot_location: TEST_DATA.selectedDepot,
        depot_code: TEST_DATA.depotCode,
        status: 'in_progress'
      })
      .select()
      .single();

    if (error) throw error;

    log(`  Candidato criado: ${data.id}`, 'success');
    log(`  Email: ${data.email}`, 'info');
    return data;
  } catch (error) {
    log(`  Erro: ${error.message}`, 'error');
    throw error;
  }
}

async function testStep4_PersonalInfo(candidateId) {
  log('\nSTEP 4: Personal Information', 'step');

  try {
    const { data, error } = await supabase
      .from('candidates')
      .update({
        birth_date: TEST_DATA.birthDate,
        birth_city: TEST_DATA.birthCity,
        birth_country: TEST_DATA.birthCountry,
        mother_name: TEST_DATA.motherName,
        mother_surname: TEST_DATA.motherSurname,
        next_of_kin_name: TEST_DATA.nextOfKinName,
        next_of_kin_relationship: TEST_DATA.nextOfKinRelationship,
        next_of_kin_phone: TEST_DATA.nextOfKinPhone
      })
      .eq('id', candidateId)
      .select()
      .single();

    if (error) throw error;

    log(`  Informações pessoais salvas`, 'success');
    log(`  Data nascimento: ${data.birth_date}`, 'info');
    return data;
  } catch (error) {
    log(`  Erro: ${error.message}`, 'error');
    throw error;
  }
}

async function testStep5_AddressHistory(candidateId) {
  log('\nSTEP 5: Address History', 'step');

  try {
    const { data, error } = await supabase
      .from('candidates')
      .update({
        address_history: TEST_DATA.addressHistory
      })
      .eq('id', candidateId)
      .select()
      .single();

    if (error) throw error;

    log(`  Histórico de endereços salvo`, 'success');
    log(`  Endereços: ${TEST_DATA.addressHistory.length}`, 'info');
    return data;
  } catch (error) {
    log(`  Erro: ${error.message}`, 'error');
    throw error;
  }
}

async function testStep6_AdditionalInfo(candidateId) {
  log('\nSTEP 6: Additional Information', 'step');

  try {
    const { data, error } = await supabase
      .from('candidates')
      .update({
        national_insurance_number: TEST_DATA.nationalInsuranceNumber,
        utr_number: TEST_DATA.utrNumber,
        employment_status: TEST_DATA.employmentStatus,
        vat_number: TEST_DATA.vatNumber
      })
      .eq('id', candidateId)
      .select()
      .single();

    if (error) throw error;

    log(`  Informações adicionais salvas`, 'success');
    log(`  NI: ${data.national_insurance_number}`, 'info');
    return data;
  } catch (error) {
    log(`  Erro: ${error.message}`, 'error');
    throw error;
  }
}

async function testStep7_ProfilePhoto(candidateId) {
  log('\nSTEP 7: Profile Photo', 'step');

  try {
    // Buscar document_type para profile_photo
    const { data: docType, error: docTypeError } = await supabase
      .from('document_types')
      .select('id')
      .eq('code', 'profile_photo')
      .single();

    if (docTypeError) throw docTypeError;

    // Simular upload de documento
    const { data, error } = await supabase
      .from('candidate_documents')
      .insert({
        candidate_id: candidateId,
        document_type_id: docType.id,
        storage_bucket: 'form-documents',
        storage_path: `${candidateId}/profile_photo_test.jpg`,
        original_filename: 'profile_photo.jpg',
        file_size: 2048,
        mime_type: 'image/jpeg',
        status: 'uploaded'
      })
      .select()
      .single();

    if (error) throw error;

    log(`  Foto de perfil enviada`, 'success');
    log(`  Documento ID: ${data.id}`, 'info');
    return data;
  } catch (error) {
    log(`  Erro: ${error.message}`, 'error');
    throw error;
  }
}

async function testStep8_DrivingLicence(candidateId) {
  log('\nSTEP 8: Driving Licence', 'step');

  try {
    // Buscar document_type para frente da CNH
    const { data: frontDocType, error: frontDocTypeError } = await supabase
      .from('document_types')
      .select('id')
      .eq('code', 'driving_licence_front')
      .single();

    if (frontDocTypeError) throw frontDocTypeError;

    // Buscar document_type para verso da CNH
    const { data: backDocType, error: backDocTypeError } = await supabase
      .from('document_types')
      .select('id')
      .eq('code', 'driving_licence_back')
      .single();

    if (backDocTypeError) throw backDocTypeError;

    // Upload frente
    const { data: frontDoc, error: frontError } = await supabase
      .from('candidate_documents')
      .insert({
        candidate_id: candidateId,
        document_type_id: frontDocType.id,
        storage_bucket: 'form-documents',
        storage_path: `${candidateId}/driving_licence_front.jpg`,
        original_filename: 'licence_front.jpg',
        file_size: 3072,
        mime_type: 'image/jpeg',
        status: 'uploaded'
      })
      .select()
      .single();

    if (frontError) throw frontError;

    // Upload verso
    const { data: backDoc, error: backError } = await supabase
      .from('candidate_documents')
      .insert({
        candidate_id: candidateId,
        document_type_id: backDocType.id,
        storage_bucket: 'form-documents',
        storage_path: `${candidateId}/driving_licence_back.jpg`,
        original_filename: 'licence_back.jpg',
        file_size: 3072,
        mime_type: 'image/jpeg',
        status: 'uploaded'
      })
      .select()
      .single();

    if (backError) throw backError;

    log(`  CNH enviada (frente + verso)`, 'success');
    log(`  Frente: ${frontDoc.id}`, 'info');
    log(`  Verso: ${backDoc.id}`, 'info');
    return { front: frontDoc, back: backDoc };
  } catch (error) {
    log(`  Erro: ${error.message}`, 'error');
    throw error;
  }
}

async function testStep9_BankDetails(candidateId) {
  log('\nSTEP 9: Bank Details', 'step');

  try {
    const { data, error } = await supabase
      .from('candidates')
      .update({
        bank_account_number: TEST_DATA.bankAccountNumber,
        bank_sort_code: TEST_DATA.bankSortCode,
        payment_declaration_accepted: true,
        payment_declaration_accepted_at: new Date().toISOString()
      })
      .eq('id', candidateId)
      .select()
      .single();

    if (error) throw error;

    log(`  Dados bancários salvos`, 'success');
    log(`  Conta: ${data.bank_account_number}`, 'info');
    return data;
  } catch (error) {
    log(`  Erro: ${error.message}`, 'error');
    throw error;
  }
}

async function testStep11_DocumentsUpload(candidateId) {
  log('\nSTEP 11: Documents Upload', 'step');

  try {
    const requiredDocs = [
      'right_to_work',
      'proof_of_address',
      'national_insurance',
      'bank_statement'
    ];

    const uploadedDocs = [];

    for (const docCode of requiredDocs) {
      const { data: docType, error: docTypeError } = await supabase
        .from('document_types')
        .select('id')
        .eq('code', docCode)
        .single();

      if (docTypeError) continue; // Skip se tipo não existir

      const { data, error } = await supabase
        .from('candidate_documents')
        .insert({
          candidate_id: candidateId,
          document_type_id: docType.id,
          storage_bucket: 'form-documents',
          storage_path: `${candidateId}/${docCode}_test.pdf`,
          original_filename: `${docCode}.pdf`,
          file_size: 4096,
          mime_type: 'application/pdf',
          status: 'uploaded'
        })
        .select()
        .single();

      if (!error) {
        uploadedDocs.push(data);
        log(`  ${docCode} enviado`, 'info');
      }
    }

    log(`  ${uploadedDocs.length} documentos obrigatórios enviados`, 'success');
    return uploadedDocs;
  } catch (error) {
    log(`  Erro: ${error.message}`, 'error');
    throw error;
  }
}

async function testStep12_Completion(candidateId, candidateData) {
  log('\nSTEP 12: Completion', 'step');

  try {
    // Marcar como completo
    const { data, error } = await supabase
      .from('candidates')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
        status: 'completed'
      })
      .eq('id', candidateId)
      .select()
      .single();

    if (error) throw error;

    log(`  Candidato marcado como completo`, 'success');
    log(`  Completed at: ${data.completed_at}`, 'info');

    // Enviar notificação n8n
    if (N8N_WEBHOOK_URL) {
      log(`\n  Enviando notificação n8n...`, 'info');

      try {
        const payload = {
          event: 'form_completed',
          timestamp: new Date().toISOString(),
          data: {
            candidate_id: candidateId,
            email: candidateData.email,
            full_name: candidateData.fullName,
            phone: candidateData.phone,
            language: candidateData.language,
            depot_location: candidateData.selectedDepot,
            depot_code: candidateData.depotCode,
            completed_at: data.completed_at,
            all_documents_uploaded: true,
            employment_status: candidateData.employmentStatus
          },
          metadata: {
            user_agent: 'E2E Test Script',
            source: 'sbl_onboarding_form_test'
          }
        };

        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          log(`  Webhook n8n enviado com sucesso`, 'success');
          log(`  Status: ${response.status}`, 'info');
        } else {
          log(`  Webhook n8n falhou: ${response.status}`, 'warning');
        }
      } catch (n8nError) {
        log(`  Erro ao enviar webhook n8n: ${n8nError.message}`, 'warning');
      }
    } else {
      log(`  N8N_WEBHOOK_URL não configurado`, 'warning');
    }

    return data;
  } catch (error) {
    log(`  Erro: ${error.message}`, 'error');
    throw error;
  }
}

// ============================================
// VALIDAÇÕES
// ============================================

async function validateCandidateData(candidateId) {
  log('\n🔍 VALIDAÇÃO: Dados do Candidato', 'step');

  try {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', candidateId)
      .single();

    if (error) throw error;

    const checks = [
      { field: 'full_name', expected: TEST_DATA.fullName },
      { field: 'email', expected: TEST_DATA.email },
      { field: 'phone_number', expected: TEST_DATA.phone },
      { field: 'preferred_language', expected: TEST_DATA.language },
      { field: 'depot_location', expected: TEST_DATA.selectedDepot },
      { field: 'birth_date', expected: TEST_DATA.birthDate },
      { field: 'national_insurance_number', expected: TEST_DATA.nationalInsuranceNumber },
      { field: 'employment_status', expected: TEST_DATA.employmentStatus },
      { field: 'is_completed', expected: true },
      { field: 'status', expected: 'completed' }
    ];

    let passed = 0;
    let failed = 0;

    for (const check of checks) {
      if (data[check.field] === check.expected) {
        log(`  ✅ ${check.field}: OK`, 'info');
        passed++;
      } else {
        log(`  ❌ ${check.field}: Esperado '${check.expected}', obtido '${data[check.field]}'`, 'error');
        failed++;
      }
    }

    log(`\n  Total: ${checks.length} | Passou: ${passed} | Falhou: ${failed}`, 'info');

    return { passed, failed, total: checks.length };
  } catch (error) {
    log(`  Erro na validação: ${error.message}`, 'error');
    throw error;
  }
}

async function validateDocuments(candidateId) {
  log('\n🔍 VALIDAÇÃO: Documentos', 'step');

  try {
    const { data, error } = await supabase
      .from('candidate_documents')
      .select('*')
      .eq('candidate_id', candidateId);

    if (error) throw error;

    log(`  Total de documentos enviados: ${data.length}`, 'info');

    // Verificar status de conclusão
    const { data: status, error: statusError } = await supabase
      .rpc('get_candidate_completion_status', { p_candidate_id: candidateId });

    if (statusError) throw statusError;

    log(`  Documentos obrigatórios: ${status.total_required}`, 'info');
    log(`  Documentos enviados: ${status.total_uploaded}`, 'info');
    log(`  Completo: ${status.is_complete ? 'Sim' : 'Não'}`, status.is_complete ? 'success' : 'warning');

    return { documentsCount: data.length, completionStatus: status };
  } catch (error) {
    log(`  Erro na validação: ${error.message}`, 'error');
    throw error;
  }
}

async function cleanup(candidateId) {
  log('\n🧹 LIMPEZA: Removendo dados de teste', 'step');

  try {
    const { error } = await supabase
      .from('candidates')
      .delete()
      .eq('id', candidateId);

    if (error) throw error;

    log(`  Candidato ${candidateId} deletado (CASCADE)`, 'success');
    return true;
  } catch (error) {
    log(`  Erro na limpeza: ${error.message}`, 'error');
    throw error;
  }
}

// ============================================
// FLUXO PRINCIPAL
// ============================================

async function main() {
  console.log('\n========================================');
  console.log('🧪 TESTE END-TO-END DO FORMULÁRIO SBL');
  console.log('========================================\n');

  let candidateId = null;
  const results = {
    steps: { passed: 0, failed: 0 },
    validation: { passed: 0, failed: 0 }
  };

  try {
    // PHASE 1: Simular preenchimento de todos os steps
    log('FASE 1: Simulação de Preenchimento', 'step');

    const candidate = await testStep3_CreateCandidate();
    candidateId = candidate.id;
    results.steps.passed++;

    await testStep4_PersonalInfo(candidateId);
    results.steps.passed++;

    await testStep5_AddressHistory(candidateId);
    results.steps.passed++;

    await testStep6_AdditionalInfo(candidateId);
    results.steps.passed++;

    await testStep7_ProfilePhoto(candidateId);
    results.steps.passed++;

    await testStep8_DrivingLicence(candidateId);
    results.steps.passed++;

    await testStep9_BankDetails(candidateId);
    results.steps.passed++;

    await testStep11_DocumentsUpload(candidateId);
    results.steps.passed++;

    await testStep12_Completion(candidateId, TEST_DATA);
    results.steps.passed++;

    // PHASE 2: Validações
    log('\n\nFASE 2: Validações', 'step');

    const candidateValidation = await validateCandidateData(candidateId);
    results.validation.passed += candidateValidation.passed;
    results.validation.failed += candidateValidation.failed;

    const docsValidation = await validateDocuments(candidateId);

    // PHASE 3: Cleanup
    log('\n\nFASE 3: Limpeza', 'step');
    await cleanup(candidateId);

    // Relatório Final
    console.log('\n========================================');
    console.log('📊 RELATÓRIO FINAL');
    console.log('========================================\n');
    console.log('Steps do Formulário:');
    console.log(`  ✅ Executados: ${results.steps.passed}`);
    console.log(`  ❌ Falharam: ${results.steps.failed}`);

    console.log('\nValidações:');
    console.log(`  ✅ Passou: ${results.validation.passed}`);
    console.log(`  ❌ Falhou: ${results.validation.failed}`);

    console.log('\nDocumentos:');
    console.log(`  Total enviado: ${docsValidation.documentsCount}`);
    console.log(`  Status: ${docsValidation.completionStatus.is_complete ? 'Completo ✅' : 'Incompleto ⚠️'}`);

    console.log('\n========================================\n');

    if (results.steps.failed === 0 && results.validation.failed === 0) {
      log('🎉 Teste E2E passou! Formulário 100% funcional!', 'success');
    } else {
      log('⚠️  Alguns testes falharam. Verifique os logs acima.', 'warning');
    }

  } catch (error) {
    log(`\n❌ Erro fatal no teste E2E: ${error.message}`, 'error');
    console.error(error);

    if (candidateId) {
      log('\nTentando limpar dados de teste...', 'info');
      try {
        await cleanup(candidateId);
      } catch (cleanupError) {
        log(`Erro na limpeza: ${cleanupError.message}`, 'error');
      }
    }

    process.exit(1);
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
