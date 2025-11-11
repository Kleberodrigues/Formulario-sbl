/**
 * Setup automático do n8n via API
 * Cria e configura o workflow de abandono automaticamente
 */

import 'dotenv/config';
import fetch from 'node-fetch';

// Configuração da API n8n
const N8N_URL = (process.env.N8N_URL || 'https://heavydragonfly-n8n.cloudfy.cloud').replace(/\/$/, ''); // Remove barra final
const N8N_API_KEY = process.env.N8N_API_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!N8N_API_KEY) {
  console.error('❌ N8N_API_KEY não encontrado no .env');
  process.exit(1);
}

// Headers para API do n8n
const headers = {
  'Content-Type': 'application/json',
  'X-N8N-API-KEY': N8N_API_KEY
};

/**
 * Criar workflow no n8n via API
 */
async function createWorkflow() {
  console.log('📦 Criando workflow no n8n...');

  const workflow = {
    name: "SBL Onboarding - Form Abandonment",
    nodes: [
      {
        parameters: {
          path: "formulario-sbl-abandonment",
          responseMode: "responseNode",
          options: {}
        },
        id: "webhook-abandonment",
        name: "Webhook - Form Abandoned",
        type: "n8n-nodes-base.webhook",
        typeVersion: 1,
        position: [250, 300],
        webhookId: "formulario-sbl-abandonment"
      },
      {
        parameters: {
          respondWith: "json",
          responseBody: '={{ { "success": true, "message": "Abandonment notification received", "timestamp": $now } }}'
        },
        id: "webhook-response",
        name: "Webhook Response",
        type: "n8n-nodes-base.respondToWebhook",
        typeVersion: 1,
        position: [450, 300]
      },
      {
        parameters: {
          conditions: {
            string: [
              {
                value1: "={{ $json.event }}",
                value2: "form_abandoned"
              }
            ]
          }
        },
        id: "check-event-type",
        name: "Check Event Type",
        type: "n8n-nodes-base.if",
        typeVersion: 1,
        position: [650, 300]
      },
      {
        parameters: {
          functionCode: `// Extrair dados do abandono
const data = $input.item.json.data || {};
const metadata = $input.item.json.metadata || {};

// Formatar dados para email
const emailData = {
  email: data.email || '',
  fullName: data.full_name || 'Candidato',
  phone: data.phone || '',
  abandonedStep: data.abandoned_at_step || 1,
  language: data.language || 'en',
  selectedDepot: data.selected_depot || 'N/A',
  returnUrl: data.return_url || '',
  completedSteps: data.completed_steps || [],
  totalSteps: 11,
  progressPercentage: Math.round((data.completed_steps?.length || 0) / 11 * 100),
  timestamp: $input.item.json.timestamp || new Date().toISOString(),
  userAgent: metadata.user_agent || '',
  source: metadata.source || 'sbl_onboarding_form'
};

// Determinar mensagem baseada no idioma
const messages = {
  'en': {
    subject: 'Complete Your SBL Application',
    greeting: 'Hello',
    body: \`We noticed you started your application with Silva Brothers Logistics but didn't finish.\\n\\nYou were on step \${emailData.abandonedStep} of \${emailData.totalSteps} (\${emailData.progressPercentage}% complete).\\n\\nWe'd love to have you join our team! Complete your application now:\`,
    cta: 'Continue Application',
    footer: 'If you have any questions, feel free to contact us.\\n\\nBest regards,\\nSilva Brothers Logistics Team'
  },
  'pt-BR': {
    subject: 'Complete Sua Candidatura na SBL',
    greeting: 'Olá',
    body: \`Notamos que você começou sua candidatura na Silva Brothers Logistics mas não finalizou.\\n\\nVocê estava na etapa \${emailData.abandonedStep} de \${emailData.totalSteps} (\${emailData.progressPercentage}% completo).\\n\\nGostaríamos muito de ter você em nosso time! Complete sua candidatura agora:\`,
    cta: 'Continuar Candidatura',
    footer: 'Se tiver alguma dúvida, não hesite em nos contatar.\\n\\nAtenciosamente,\\nEquipe Silva Brothers Logistics'
  },
  'bg': {
    subject: 'Завършете Вашата Кандидатура за SBL',
    greeting: 'Здравейте',
    body: \`Забелязахме, че започнахте кандидатурата си в Silva Brothers Logistics, но не я завършихте.\\n\\nБяхте на стъпка \${emailData.abandonedStep} от \${emailData.totalSteps} (\${emailData.progressPercentage}% завършено).\\n\\nБихме искали да се присъедините към нашия екип! Завършете кандидатурата си сега:\`,
    cta: 'Продължете Кандидатурата',
    footer: 'Ако имате въпроси, моля свържете се с нас.\\n\\nС уважение,\\nЕкипът на Silva Brothers Logistics'
  },
  'ro': {
    subject: 'Completează Aplicația Ta pentru SBL',
    greeting: 'Bună',
    body: \`Am observat că ai început aplicația ta la Silva Brothers Logistics dar nu ai finalizat-o.\\n\\nErai la pasul \${emailData.abandonedStep} din \${emailData.totalSteps} (\${emailData.progressPercentage}% completat).\\n\\nNe-ar plăcea să te alături echipei noastre! Completează aplicația acum:\`,
    cta: 'Continuă Aplicația',
    footer: 'Dacă ai întrebări, nu ezita să ne contactezi.\\n\\nCu stimă,\\nEchipa Silva Brothers Logistics'
  }
};

const lang = emailData.language || 'en';
const msg = messages[lang] || messages['en'];

emailData.subject = msg.subject;
emailData.greeting = msg.greeting;
emailData.bodyText = msg.body;
emailData.ctaText = msg.cta;
emailData.footer = msg.footer;

return { json: emailData };`
        },
        id: "process-abandonment-data",
        name: "Process Abandonment Data",
        type: "n8n-nodes-base.function",
        typeVersion: 1,
        position: [850, 200]
      },
      {
        parameters: {
          operation: "executeQuery",
          query: `INSERT INTO form_abandonments (
            email, phone, full_name, abandoned_at_step,
            language, selected_depot, followup_sent,
            followup_type, created_at
          ) VALUES (
            '{{ $json.email }}',
            '{{ $json.phone }}',
            '{{ $json.fullName }}',
            {{ $json.abandonedStep }},
            '{{ $json.language }}',
            '{{ $json.selectedDepot }}',
            true,
            'email',
            NOW()
          ) RETURNING *;`
        },
        id: "log-to-supabase",
        name: "Log to Supabase",
        type: "n8n-nodes-base.postgres",
        typeVersion: 2.4,
        position: [1050, 200],
        credentials: {
          postgres: {
            name: "Supabase PostgreSQL"
          }
        }
      }
    ],
    connections: {
      "Webhook - Form Abandoned": {
        main: [
          [
            {
              node: "Webhook Response",
              type: "main",
              index: 0
            },
            {
              node: "Check Event Type",
              type: "main",
              index: 0
            }
          ]
        ]
      },
      "Check Event Type": {
        main: [
          [
            {
              node: "Process Abandonment Data",
              type: "main",
              index: 0
            }
          ]
        ]
      },
      "Process Abandonment Data": {
        main: [
          [
            {
              node: "Log to Supabase",
              type: "main",
              index: 0
            }
          ]
        ]
      }
    },
    settings: {
      executionOrder: "v1"
    },
    staticData: null
  };

  try {
    const response = await fetch(`${N8N_URL}/api/v1/workflows`, {
      method: 'POST',
      headers,
      body: JSON.stringify(workflow)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro ao criar workflow: ${error}`);
    }

    const result = await response.json();
    console.log('✅ Workflow criado com sucesso!');
    console.log(`   ID: ${result.id}`);
    console.log(`   Nome: ${result.name}`);

    return result;
  } catch (error) {
    console.error('❌ Erro ao criar workflow:', error.message);
    throw error;
  }
}

/**
 * Criar credencial PostgreSQL (Supabase) no n8n
 */
async function createSupabaseCredential() {
  console.log('🔐 Criando credencial do Supabase...');

  // Extrair host do URL do Supabase
  const supabaseHost = SUPABASE_URL.replace('https://', '').replace('http://', '');
  const projectRef = supabaseHost.split('.')[0];

  const credential = {
    name: "Supabase PostgreSQL",
    type: "postgres",
    data: {
      host: `db.${projectRef}.supabase.co`,
      port: 5432,
      database: "postgres",
      user: "postgres",
      password: SUPABASE_SERVICE_KEY || "",
      ssl: "require"
    }
  };

  try {
    const response = await fetch(`${N8N_URL}/api/v1/credentials`, {
      method: 'POST',
      headers,
      body: JSON.stringify(credential)
    });

    if (!response.ok) {
      const error = await response.text();
      console.warn(`⚠️  Credencial pode já existir: ${error}`);
      return null;
    }

    const result = await response.json();
    console.log('✅ Credencial do Supabase criada!');
    console.log(`   ID: ${result.id}`);

    return result;
  } catch (error) {
    console.error('❌ Erro ao criar credencial:', error.message);
    return null;
  }
}

/**
 * Ativar workflow
 */
async function activateWorkflow(workflowId) {
  console.log(`🚀 Ativando workflow ${workflowId}...`);

  try {
    // Primeiro obter o workflow atual
    const getResponse = await fetch(`${N8N_URL}/api/v1/workflows/${workflowId}`, {
      method: 'GET',
      headers
    });

    if (!getResponse.ok) {
      throw new Error('Erro ao obter workflow');
    }

    const currentWorkflow = await getResponse.json();

    // Filtrar apenas campos permitidos e atualizar com active = true
    const updatedWorkflow = {
      name: currentWorkflow.name,
      nodes: currentWorkflow.nodes,
      connections: currentWorkflow.connections,
      settings: currentWorkflow.settings,
      staticData: currentWorkflow.staticData,
      active: true
    };

    const response = await fetch(`${N8N_URL}/api/v1/workflows/${workflowId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updatedWorkflow)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro ao ativar workflow: ${error}`);
    }

    const result = await response.json();
    console.log('✅ Workflow ativado com sucesso!');

    return result;
  } catch (error) {
    console.error('❌ Erro ao ativar workflow:', error.message);
    throw error;
  }
}

/**
 * Obter URL do webhook
 */
async function getWebhookUrl(workflowId) {
  console.log(`🔗 Obtendo URL do webhook...`);

  try {
    const response = await fetch(`${N8N_URL}/api/v1/workflows/${workflowId}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error('Erro ao obter workflow');
    }

    const workflow = await response.json();
    const webhookNode = workflow.nodes.find(n => n.type === 'n8n-nodes-base.webhook');

    if (webhookNode) {
      const webhookPath = webhookNode.parameters.path;
      const webhookUrl = `${N8N_URL}/webhook/${webhookPath}`;

      console.log('✅ URL do Webhook:');
      console.log(`   ${webhookUrl}`);
      console.log('');
      console.log('📝 Adicione ao .env:');
      console.log(`   VITE_N8N_WEBHOOK_URL=${webhookUrl}`);

      return webhookUrl;
    }

    return null;
  } catch (error) {
    console.error('❌ Erro ao obter webhook URL:', error.message);
    return null;
  }
}

/**
 * Executar setup completo
 */
async function main() {
  console.log('');
  console.log('🤖 Setup automático do n8n');
  console.log('================================');
  console.log('');

  try {
    // 1. Criar credencial do Supabase (comentado - criar manualmente no n8n)
    // await createSupabaseCredential();
    console.log('ℹ️  Credencial do Supabase deve ser criada manualmente no n8n');
    console.log('');

    // 2. Criar workflow
    const workflow = await createWorkflow();
    console.log('');

    // 3. Ativar workflow (deve ser feito manualmente no n8n)
    console.log('⚠️  Workflow criado mas não ativado automaticamente');
    console.log('   Ative manualmente no n8n clicando no botão "Active"');
    console.log('');

    // 4. Obter URL do webhook
    const webhookUrl = await getWebhookUrl(workflow.id);
    console.log('');

    console.log('✨ Setup concluído com sucesso!');
    console.log('');
    console.log('📋 Próximos passos:');
    console.log('1. Adicionar VITE_N8N_WEBHOOK_URL ao .env');
    console.log('2. Configurar credencial SMTP no n8n (para emails)');
    console.log('3. Testar o workflow');
    console.log('');
    console.log(`🌐 Acesse o n8n: ${N8N_URL}`);
    console.log('');

  } catch (error) {
    console.error('');
    console.error('💥 Erro durante o setup:', error.message);
    process.exit(1);
  }
}

// Executar
main();
