/**
 * Teste de Webhook n8n
 * Diagnostica conexão e configuração do webhook
 */

import 'dotenv/config';
import fetch from 'node-fetch';

const N8N_WEBHOOK_URL = process.env.VITE_N8N_WEBHOOK_URL;
const N8N_URL = process.env.N8N_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function log(message, type = 'info') {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    test: '🧪',
    webhook: '🔔'
  };
  console.log(`${icons[type]} ${message}`);
}

// ============================================
// TESTES DE WEBHOOK
// ============================================

async function testWebhookConnection() {
  log('\n🔍 TESTE 1: Conexão com Webhook', 'test');

  if (!N8N_WEBHOOK_URL) {
    log('  VITE_N8N_WEBHOOK_URL não configurado', 'error');
    return { success: false, error: 'URL não configurada' };
  }

  log(`  URL: ${N8N_WEBHOOK_URL}`, 'info');

  try {
    const testPayload = {
      event: 'webhook_test',
      timestamp: new Date().toISOString(),
      message: 'Test from diagnostic script',
      test: true
    };

    log(`  Enviando payload de teste...`, 'info');

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayload)
    });

    log(`  Status: ${response.status} ${response.statusText}`, response.ok ? 'success' : 'error');

    if (response.ok) {
      const responseText = await response.text();
      log(`  Resposta: ${responseText || '(vazia)'}`, 'info');
      return { success: true, status: response.status, body: responseText };
    } else {
      const errorText = await response.text();
      log(`  Erro: ${errorText || '(vazio)'}`, 'error');
      return { success: false, status: response.status, error: errorText };
    }
  } catch (error) {
    log(`  Erro de conexão: ${error.message}`, 'error');
    return { success: false, error: error.message };
  }
}

async function testFormAbandonmentPayload() {
  log('\n🔍 TESTE 2: Payload de Abandono', 'test');

  if (!N8N_WEBHOOK_URL) {
    log('  Webhook não configurado', 'warning');
    return { success: false };
  }

  try {
    const payload = {
      event: 'form_abandoned',
      timestamp: new Date().toISOString(),
      data: {
        email: 'test@example.com',
        full_name: 'Test User',
        phone: '+44 7123 456789',
        abandoned_at_step: 5,
        language: 'en',
        selected_depot: 'Southampton',
        created_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
        completed_steps: [1, 2, 3, 4],
        return_url: 'http://localhost:5173/onboarding?resume=test@example.com'
      },
      metadata: {
        user_agent: 'Diagnostic Test',
        referrer: '',
        source: 'sbl_onboarding_form_test'
      }
    };

    log(`  Enviando evento: form_abandoned`, 'webhook');

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    log(`  Status: ${response.status}`, response.ok ? 'success' : 'error');

    if (response.ok) {
      const body = await response.text();
      log(`  Resposta: ${body || '(vazia)'}`, 'info');
      return { success: true, status: response.status };
    } else {
      const error = await response.text();
      log(`  Erro: ${error || '(vazio)'}`, 'error');
      return { success: false, status: response.status, error };
    }
  } catch (error) {
    log(`  Erro: ${error.message}`, 'error');
    return { success: false, error: error.message };
  }
}

async function testFormCompletionPayload() {
  log('\n🔍 TESTE 3: Payload de Conclusão', 'test');

  if (!N8N_WEBHOOK_URL) {
    log('  Webhook não configurado', 'warning');
    return { success: false };
  }

  try {
    const payload = {
      event: 'form_completed',
      timestamp: new Date().toISOString(),
      data: {
        candidate_id: '00000000-0000-0000-0000-000000000000',
        email: 'test@example.com',
        full_name: 'Test User',
        phone: '+44 7123 456789',
        language: 'en',
        depot_location: 'Southampton',
        depot_code: 'DSO2',
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        all_documents_uploaded: true,
        employment_status: 'Limited company (self-employed)'
      },
      metadata: {
        user_agent: 'Diagnostic Test',
        source: 'sbl_onboarding_form_test'
      }
    };

    log(`  Enviando evento: form_completed`, 'webhook');

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    log(`  Status: ${response.status}`, response.ok ? 'success' : 'error');

    if (response.ok) {
      const body = await response.text();
      log(`  Resposta: ${body || '(vazia)'}`, 'info');
      return { success: true, status: response.status };
    } else {
      const error = await response.text();
      log(`  Erro: ${error || '(vazio)'}`, 'error');
      return { success: false, status: response.status, error };
    }
  } catch (error) {
    log(`  Erro: ${error.message}`, 'error');
    return { success: false, error: error.message };
  }
}

async function checkN8NWorkflows() {
  log('\n🔍 TESTE 4: Verificar Workflows n8n (via API)', 'test');

  if (!N8N_URL || !N8N_API_KEY) {
    log('  N8N_URL ou N8N_API_KEY não configurados', 'warning');
    log('  Pulando verificação de workflows', 'info');
    return { success: false, skipped: true };
  }

  try {
    const apiUrl = `${N8N_URL.replace(/\/$/, '')}/api/v1/workflows`;

    log(`  API URL: ${apiUrl}`, 'info');
    log(`  Buscando workflows ativos...`, 'info');

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      log(`  Erro na API: ${response.status} ${response.statusText}`, 'error');
      return { success: false, status: response.status };
    }

    const data = await response.json();

    log(`  Total de workflows: ${data.data?.length || 0}`, 'info');

    if (data.data && data.data.length > 0) {
      const activeWorkflows = data.data.filter(w => w.active);
      log(`  Workflows ativos: ${activeWorkflows.length}`, 'success');

      // Procurar workflow relacionado ao formulário
      const formWorkflows = data.data.filter(w =>
        w.name?.toLowerCase().includes('formulario') ||
        w.name?.toLowerCase().includes('sbl') ||
        w.name?.toLowerCase().includes('abandonment')
      );

      if (formWorkflows.length > 0) {
        log(`\n  Workflows relacionados ao formulário:`, 'info');
        formWorkflows.forEach(w => {
          log(`    - ${w.name} (${w.active ? 'ATIVO ✅' : 'INATIVO ❌'})`, 'info');
          log(`      ID: ${w.id}`, 'info');
        });
      }
    }

    return { success: true, workflows: data.data };
  } catch (error) {
    log(`  Erro: ${error.message}`, 'error');
    return { success: false, error: error.message };
  }
}

async function testDifferentMethods() {
  log('\n🔍 TESTE 5: Testar Métodos HTTP', 'test');

  if (!N8N_WEBHOOK_URL) {
    log('  Webhook não configurado', 'warning');
    return { success: false };
  }

  const methods = ['GET', 'POST', 'PUT'];
  const results = {};

  for (const method of methods) {
    try {
      log(`  Testando ${method}...`, 'info');

      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };

      if (method !== 'GET') {
        options.body = JSON.stringify({ test: true, method });
      }

      const response = await fetch(N8N_WEBHOOK_URL, options);

      results[method] = {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      };

      log(`    ${method}: ${response.status} ${response.statusText}`, response.ok ? 'success' : 'warning');
    } catch (error) {
      results[method] = { error: error.message };
      log(`    ${method}: Erro - ${error.message}`, 'error');
    }
  }

  return { success: true, results };
}

// ============================================
// FLUXO PRINCIPAL
// ============================================

async function main() {
  console.log('\n========================================');
  console.log('🔔 DIAGNÓSTICO DO WEBHOOK N8N');
  console.log('========================================');

  log('\n📋 Configuração:', 'info');
  log(`  VITE_N8N_WEBHOOK_URL: ${N8N_WEBHOOK_URL || '(não configurado)'}`, 'info');
  log(`  N8N_URL: ${N8N_URL || '(não configurado)'}`, 'info');
  log(`  N8N_API_KEY: ${N8N_API_KEY ? '✅ Configurado' : '❌ Não configurado'}`, 'info');

  const results = {
    connection: null,
    abandonment: null,
    completion: null,
    workflows: null,
    methods: null
  };

  // Executar testes
  results.connection = await testWebhookConnection();
  results.abandonment = await testFormAbandonmentPayload();
  results.completion = await testFormCompletionPayload();
  results.workflows = await checkN8NWorkflows();
  results.methods = await testDifferentMethods();

  // Relatório Final
  console.log('\n========================================');
  console.log('📊 RELATÓRIO FINAL');
  console.log('========================================\n');

  log('Resultados dos Testes:', 'info');
  log(`  Conexão básica: ${results.connection.success ? '✅ OK' : '❌ FALHOU'}`, 'info');
  log(`  Payload abandono: ${results.abandonment.success ? '✅ OK' : '❌ FALHOU'}`, 'info');
  log(`  Payload conclusão: ${results.completion.success ? '✅ OK' : '❌ FALHOU'}`, 'info');
  log(`  API workflows: ${results.workflows.skipped ? '⊘ PULADO' : results.workflows.success ? '✅ OK' : '❌ FALHOU'}`, 'info');

  console.log('\n📝 Recomendações:');

  if (!results.connection.success) {
    if (results.connection.status === 404) {
      log('  ⚠️  Status 404 - Webhook não encontrado', 'warning');
      log('  → Verifique se o workflow n8n está ativo', 'info');
      log('  → Confirme a URL do webhook no workflow', 'info');
      log('  → URL atual: ' + N8N_WEBHOOK_URL, 'info');
    } else if (results.connection.status === 401 || results.connection.status === 403) {
      log('  ⚠️  Erro de autenticação', 'warning');
      log('  → Verifique credenciais do webhook', 'info');
    } else if (!results.connection.status) {
      log('  ⚠️  Erro de conexão de rede', 'warning');
      log('  → Verifique conectividade com ' + N8N_URL, 'info');
    }
  } else {
    log('  ✅ Webhook funcionando corretamente!', 'success');
  }

  if (!results.completion.success && results.connection.success) {
    log('  ℹ️  Webhook aceita conexões mas rejeita payload de conclusão', 'info');
    log('  → Verifique se o workflow processa event=\'form_completed\'', 'info');
  }

  console.log('\n========================================\n');
}

// ============================================
// EXECUÇÃO
// ============================================

main().catch(error => {
  log(`Erro fatal: ${error.message}`, 'error');
  console.error(error);
  process.exit(1);
});
