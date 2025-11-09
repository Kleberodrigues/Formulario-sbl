# 🔧 Configuração n8n - SBL Onboarding Form

Guia completo para configurar o workflow de abandono de formulário no n8n.

---

## 📋 Pré-requisitos

- Acesso ao n8n: `https://heavydragonfly-n8n.cloudfy.cloud`
- Conta SMTP configurada (Gmail, SendGrid, etc.)
- WhatsApp Business API (opcional)
- Credenciais do Supabase (PostgreSQL)

---

## 🚀 Passo a Passo de Configuração

### 1. Importar Workflow no n8n

1. Acesse: `https://heavydragonfly-n8n.cloudfy.cloud`
2. Clique em **"+ Add workflow"** ou **"Import from File"**
3. Selecione o arquivo: `n8n-workflow-abandonment.json`
4. Clique em **"Import"**

### 2. Configurar Credenciais

#### A. SMTP (Email)

1. No node **"Send Abandonment Email"**, clique em **"Credential to connect with"**
2. Clique em **"+ Create New Credential"**
3. Preencha:
   ```
   Host: smtp.gmail.com (ou seu provedor)
   Port: 587
   Secure: false
   User: seu-email@gmail.com
   Password: sua-senha-de-app
   ```
4. **Importante para Gmail**:
   - Ative "Verificação em 2 etapas"
   - Gere uma "Senha de app" em: https://myaccount.google.com/apppasswords
   - Use a senha de app (não sua senha normal)

**Alternativas SMTP:**
- **SendGrid**: `smtp.sendgrid.net` (porta 587)
- **Mailgun**: `smtp.mailgun.org` (porta 587)
- **AWS SES**: `email-smtp.us-east-1.amazonaws.com` (porta 587)

#### B. WhatsApp Business API (Opcional)

1. No node **"Send WhatsApp"**, configure credenciais
2. Opções:
   - **Twilio**: https://www.twilio.com/whatsapp
   - **MessageBird**: https://messagebird.com/whatsapp
   - **360dialog**: https://www.360dialog.com

3. Exemplo Twilio:
   ```
   Account SID: ACxxxxxxxxxxxxx
   Auth Token: xxxxxxxxxxxxx
   From: whatsapp:+14155238886
   ```

#### C. Supabase (PostgreSQL)

1. No node **"Log Abandonment to Supabase"**, configure:
   ```
   Host: db.seu-project.supabase.co
   Database: postgres
   User: postgres
   Password: sua-senha-supabase
   Port: 5432
   SSL: Require
   ```

2. **Obter credenciais**:
   - Acesse: https://supabase.com/dashboard/project/SEU_PROJECT
   - Vá em **Settings → Database**
   - Copie: **Host**, **Database name**, **User**, **Password**

### 3. Obter URL do Webhook

1. No node **"Webhook - Form Abandoned"**, clique
2. Copie a **Production URL**:
   ```
   https://heavydragonfly-n8n.cloudfy.cloud/webhook/formulario-sbl-abandonment
   ```
3. **IMPORTANTE**: Salve esta URL!

### 4. Configurar .env do Projeto

1. Abra o arquivo `.env` no projeto
2. Adicione a URL do webhook:
   ```bash
   VITE_N8N_WEBHOOK_URL=https://heavydragonfly-n8n.cloudfy.cloud/webhook/formulario-sbl-abandonment
   ```
3. Configure outras variáveis:
   ```bash
   # App
   VITE_APP_URL=https://sbl.zeritycloud.com

   # Supabase
   VITE_SUPABASE_URL=https://seu-project.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima

   # n8n Webhook
   VITE_N8N_WEBHOOK_URL=https://heavydragonfly-n8n.cloudfy.cloud/webhook/formulario-sbl-abandonment

   # Flags
   VITE_ENABLE_ABANDONMENT_TRACKING=true
   ```

### 5. Ativar Workflow

1. No n8n, clique no botão **"Active"** (canto superior direito)
2. O workflow deve mudar de cinza para verde
3. Pronto! O workflow está ativo e pronto para receber webhooks

---

## 🧪 Testar Integração

### Teste Manual via n8n

1. No node **"Webhook - Form Abandoned"**, clique em **"Listen for Test Event"**
2. No projeto, execute:
   ```bash
   npm run dev
   ```
3. Abra: `http://localhost:5173`
4. Preencha até Step 3
5. Feche a aba
6. Abra novamente: `http://localhost:5173`
7. Verifique o n8n - deve receber o webhook!

### Teste via Postman/cURL

```bash
curl -X POST https://heavydragonfly-n8n.cloudfy.cloud/webhook/formulario-sbl-abandonment \
  -H "Content-Type: application/json" \
  -d '{
    "event": "form_abandoned",
    "timestamp": "2025-11-09T10:00:00Z",
    "data": {
      "email": "teste@example.com",
      "full_name": "João Silva",
      "phone": "+44 123 456 789",
      "abandoned_at_step": 5,
      "language": "en",
      "selected_depot": "Southampton DSO2",
      "created_at": "2025-11-09T09:00:00Z",
      "last_activity": "2025-11-09T09:45:00Z",
      "completed_steps": [1, 2, 3, 4],
      "return_url": "https://sbl.com/onboarding?resume=teste@example.com"
    },
    "metadata": {
      "user_agent": "Mozilla/5.0",
      "referrer": "https://google.com",
      "source": "sbl_onboarding_form"
    }
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Abandonment notification received",
  "timestamp": "2025-11-09T10:00:00.000Z"
}
```

---

## 📊 Estrutura do Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                   WEBHOOK RECEBE EVENTO                      │
│  https://n8n.com/webhook/formulario-sbl-abandonment         │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ├─→ [Webhook Response] (retorna sucesso)
                   │
                   └─→ [Check Event Type] (verifica se é form_abandoned)
                         │
                         ├─→ [Process Abandonment Data]
                         │     │
                         │     └─→ [Send Email] → [Log to Supabase]
                         │
                         └─→ [Check Phone Available]
                               │
                               └─→ [Prepare WhatsApp] → [Send WhatsApp]
```

---

## 🎨 Personalizar Email Template

No node **"Send Abandonment Email"**, você pode editar o HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Altere as cores aqui */
    .header { background: #17A798; } /* Cor do header */
    .cta-button { background: #17A798; } /* Cor do botão */
    .progress-fill { background: #17A798; } /* Cor da barra de progresso */
  </style>
</head>
<body>
  <!-- Template completo -->
</body>
</html>
```

---

## 🌍 Suporte Multi-idioma

O workflow suporta 4 idiomas automaticamente:
- 🇬🇧 **en** (English)
- 🇧🇷 **pt-BR** (Português)
- 🇧🇬 **bg** (Български)
- 🇷🇴 **ro** (Română)

**Como funciona:**
1. O formulário envia o campo `language` no payload
2. O node **"Process Abandonment Data"** seleciona o idioma
3. Email e WhatsApp são enviados no idioma correto

---

## 📝 Logs e Monitoramento

### Ver Execuções no n8n

1. No workflow, clique em **"Executions"** (canto inferior esquerdo)
2. Você verá todas as execuções com:
   - ✅ **Success**: Email enviado com sucesso
   - ❌ **Error**: Falha no envio (ver detalhes)
   - ⏸️ **Waiting**: Aguardando webhook

### Logs no Supabase

Todos os abandonos são registrados na tabela `form_abandonments`:

```sql
SELECT * FROM form_abandonments
ORDER BY created_at DESC
LIMIT 10;
```

Colunas:
- `email`, `phone`, `full_name`
- `abandoned_at_step` (em qual step abandonou)
- `followup_sent` (se email foi enviado)
- `followup_type` (email ou whatsapp)
- `created_at` (quando abandonou)

---

## ⚠️ Troubleshooting

### Webhook não recebe eventos

1. **Verifique se o workflow está ATIVO** (verde)
2. **Teste a URL no Postman**
3. **Verifique o .env**:
   ```bash
   echo $VITE_N8N_WEBHOOK_URL
   ```
4. **Verifique o console do navegador** (F12):
   ```
   ✅ Notificação de abandono enviada para n8n
   ```

### Email não chega

1. **Verifique as credenciais SMTP**
2. **Gmail**: Use senha de app, não senha normal
3. **Verifique spam/lixeira**
4. **Teste manualmente no n8n**:
   - Clique no node "Send Email"
   - Clique em "Execute Node"

### WhatsApp não envia

1. **Verifique se o telefone está no formato internacional**:
   ```
   ✅ +44 123 456 789
   ❌ 123456789
   ```
2. **Verifique credenciais da API**
3. **Twilio**: Certifique-se que o número está verificado

### Supabase não loga

1. **Verifique credenciais do banco**
2. **Certifique-se que a tabela existe**:
   ```sql
   CREATE TABLE IF NOT EXISTS form_abandonments (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email VARCHAR(255),
     phone VARCHAR(20),
     full_name VARCHAR(255),
     abandoned_at_step INT,
     language VARCHAR(10),
     selected_depot VARCHAR(255),
     followup_sent BOOLEAN DEFAULT FALSE,
     followup_type VARCHAR(50),
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

---

## 🔐 Segurança

### Webhook Security

1. **Adicionar autenticação** (opcional):
   - No node "Webhook", ative "Header Auth"
   - Configure token secreto
   - No projeto, adicione header:
     ```javascript
     headers: {
       'Authorization': 'Bearer SEU_TOKEN_SECRETO'
     }
     ```

2. **Limitar requisições**:
   - Configure rate limiting no n8n
   - Use Cloudflare para proteger webhook

### Dados Sensíveis

- ⚠️ **NÃO** logue senhas ou tokens
- ⚠️ **NÃO** envie dados bancários por email
- ✅ **USE** HTTPS sempre
- ✅ **CRIPTOGRAFE** dados sensíveis no Supabase

---

## 📚 Recursos Adicionais

- **n8n Docs**: https://docs.n8n.io
- **Webhook Node**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/
- **Email Node**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.emailsend/
- **Function Node**: https://docs.n8n.io/code/builtin/function/

---

## ✅ Checklist Final

- [ ] Workflow importado no n8n
- [ ] Credenciais SMTP configuradas e testadas
- [ ] Credenciais Supabase configuradas
- [ ] WhatsApp API configurada (opcional)
- [ ] URL do webhook copiada
- [ ] .env atualizado com VITE_N8N_WEBHOOK_URL
- [ ] Workflow ATIVADO no n8n (verde)
- [ ] Teste manual realizado com sucesso
- [ ] Email de abandono recebido
- [ ] Logs no Supabase verificados

---

**✨ Pronto! O sistema de abandono está 100% configurado!**

Se tiver problemas, verifique os logs de execução no n8n e os logs do console do navegador (F12).
