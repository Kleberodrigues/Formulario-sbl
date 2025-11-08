# 🚀 Guia de Setup - SBL Onboarding Form

## 📋 Pré-requisitos

- Node.js 16+ instalado
- Git instalado
- Conta Supabase (free tier funciona)
- Conta n8n (para automação)
- Conhecimento básico de JavaScript/HTML/CSS

---

## ✅ Passo 1: Clone e Setup Inicial

```bash
# Clone o repositório
git clone <seu-repo> sbl-form
cd sbl-form

# Instale dependências
npm install

# Copie as variáveis de ambiente
cp .env.example .env.local
```

---

## 🔧 Passo 2: Configurar Supabase

### 2.1 - Criar Projeto

1. Acesse: https://app.supabase.com
2. Clique "New Project"
3. Preencha:
   - **Project Name**: `sbl-onboarding`
   - **Database Password**: Salve em local seguro!
   - **Region**: Selecione mais próximo (ex: South America - São Paulo)
4. Aguarde criação (~2 min)

### 2.2 - Obter Credenciais

1. Após criado, vá para **Settings > API**
2. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### 2.3 - Executar Migrations

1. Acesse **SQL Editor**
2. Crie novo query
3. Cole o conteúdo de `migrations.sql`
4. Execute com Ctrl+Enter

✅ Verifique se as tabelas foram criadas em **Table Editor**

---

## 🤖 Passo 3: Configurar n8n (Follow-up)

### 3.1 - Criar Webhook

1. Acesse seu n8n
2. Crie novo workflow
3. Comece com **Webhook** trigger
4. Selecione: POST
5. Copie a URL → `VITE_N8N_WEBHOOK_URL`

### 3.2 - Configurar Ações

Adicione no workflow:

```
Webhook (recebe abandonment)
    ↓
Query Supabase (obter dados do usuário)
    ↓
Send Email (template com link de retorno)
    ↓
Send WhatsApp (se phone disponível)
    ↓
Update Supabase (marcar followup_sent = true)
```

**Exemplo de Email**:
```
Assunto: Você deixou seu formulário pela metade 👀

Olá [full_name],

Você estava na Etapa [step] do nosso onboarding.

Clique aqui para continuar: [resume_link]

Fico no aguardo!
Silva Brothers Logistics
```

---

## 📧 Passo 4: Configurar Email & WhatsApp (Opcional)

### Email (SendGrid)

1. Registre em: https://sendgrid.com
2. Obtenha **API Key**
3. Configure em n8n como ação

### WhatsApp (Twilio ou WhatsApp Business API)

1. Registre em: https://www.twilio.com
2. Obtenha credenciais
3. Configure em n8n como ação

---

## 📁 Passo 5: Estruturar Projeto

### 5.1 - Copiar Arquivos Base

```bash
# Copiar arquivos de configuração já criados
mkdir -p src/{config,components,pages,services,utils,styles}

# Já deve ter:
# src/
# ├── index.html
# ├── main.js
# └── styles.css
```

### 5.2 - Atualizar .env.local

```bash
# Abra .env.local e preencha:
VITE_SUPABASE_URL=https://seu-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_N8N_WEBHOOK_URL=https://seu-n8n.com/webhook/form-abandonment
VITE_ENV=development
VITE_APP_URL=http://localhost:5173
```

---

## 🎨 Passo 6: Instalar Dependências

```bash
# Supabase Client
npm install @supabase/supabase-js

# Mapbox (opcional, para mapa)
npm install mapbox-gl

# Validação
npm install validator

# Dependency Cruiser (já instalado globalmente)
npm install --save-dev dependency-cruiser
```

---

## 🛠️ Passo 7: Desenvolvimento

### 7.1 - Iniciar Servidor

```bash
npm run dev
# Abre em: http://localhost:5173
```

### 7.2 - Validar Arquitetura

```bash
depcruise src/ --validate
```

### 7.3 - Usar Claude Code

1. Abra no Cursor
2. Comando: Ctrl+K (ou Cmd+K no Mac)
3. Peça ao Claude:
   ```
   Leia CLAUDE.md e PRD.md

   Crie o componente Step 1 (Welcome) com:
   - Logo SBL
   - Seletor de idioma (PT, EN, BG, RO)
   - Botão Continuar
   - Salvar idioma no Supabase
   ```

---

## 🧪 Passo 8: Testar Localmente

### 8.1 - Teste de Submissão

```javascript
// No console do browser:
const { supabase } = await import('./src/config/supabase.js')
const { getSupabase } = await import('./supabase-config.js')

// Testar inserção
const result = await getSupabase()
  .from('form_submissions')
  .insert({ email: 'teste@teste.com', language: 'pt-BR' })
console.log(result)
```

### 8.2 - Teste de Abandono

1. Preencha até Step 2
2. Feche a aba/browser
3. Verifique em Supabase:
   - Row foi criado?
   - `is_abandoned = true`?
   - Row em `form_abandonments`?
4. Verifi se webhook n8n foi disparado

### 8.3 - Checklist de QA

```
[ ] Step 1 funciona (idioma salvo)
[ ] Step 2 funciona (validação de email)
[ ] Step 3 funciona (chat salvo)
[ ] Step 4 funciona (depósito salvo)
[ ] Final funciona (marca como completo)
[ ] Abandonamento detectado
[ ] Supabase tem dados
[ ] n8n webhook dispara
[ ] Email de follow-up chega
[ ] Retomar funciona
[ ] Mobile responsivo
[ ] Sem console errors
```

---

## 🚀 Passo 9: Deploy

### 9.1 - Build

```bash
npm run build
# Cria: dist/
```

### 9.2 - Deploy (Vercel)

```bash
npm install -g vercel
vercel login
vercel

# Configure variáveis de ambiente no Vercel Dashboard
```

### 9.3 - Configurar Domínio

- Apontamos DNS para Vercel
- Ativar HTTPS
- Testar em produção

---

## 📊 Monitoramento

### Métricas para Rastrear

```sql
-- Taxa de conclusão
SELECT 
  COUNT(*) total,
  SUM(CASE WHEN is_completed THEN 1 ELSE 0 END) completed,
  ROUND(100.0 * SUM(CASE WHEN is_completed THEN 1 ELSE 0 END) / COUNT(*), 2) as taxa_conclusao
FROM form_submissions
WHERE created_at >= NOW() - INTERVAL '7 days';

-- Abandonaments por step
SELECT 
  abandoned_at_step,
  COUNT(*) qty
FROM form_abandonments
GROUP BY abandoned_at_step
ORDER BY qty DESC;

-- Follow-ups enviados
SELECT 
  COUNT(*) total,
  SUM(CASE WHEN followup_sent THEN 1 ELSE 0 END) sent,
  ROUND(100.0 * SUM(CASE WHEN followup_sent THEN 1 ELSE 0 END) / COUNT(*), 2) as taxa_envio
FROM form_abandonments;
```

---

## 🐛 Troubleshooting

### Erro: "Supabase não inicializado"

```javascript
// Verifique se as credenciais estão em .env.local
// Reinicie o dev server: npm run dev
```

### Erro: "Chave de API inválida"

```bash
# Copie novamente as credenciais de Settings > API
# Verifique se não tem espaços em branco
```

### Webhook n8n não funciona

1. Verifique URL em `.env.local`
2. Teste POST manualmente:
   ```bash
   curl -X POST https://seu-n8n.com/webhook/form-abandonment \
     -H "Content-Type: application/json" \
     -d '{"email": "teste@teste.com", "step": 2}'
   ```
3. Verifique logs em n8n Dashboard

### Dados não salvando no Supabase

1. Abra Console (F12)
2. Procure por erros
3. Verifique RLS policies:
   ```sql
   -- Verifique em: Database > Policies
   ```
4. Teste inserção manual

---

## 📚 Recursos Úteis

- **Docs Supabase**: https://supabase.com/docs
- **Docs n8n**: https://docs.n8n.io
- **MDN Web Docs**: https://developer.mozilla.org
- **SBL Atual**: https://sbl.zeritycloud.com/onboarding

---

## 🎯 Próximos Passos

1. ✅ Setup Supabase
2. ✅ Setup n8n
3. ✅ Desenvolver Steps
4. ✅ Testar completo
5. ✅ Deploy em staging
6. ✅ Testar com usuários reais
7. ✅ Deploy em produção
8. ✅ Monitorar métricas

---

## 💬 Suporte

Dúvidas? Abra issue ou contate:
- **Email**: kleber@sinergiatech.com
- **Agência**: SinergIA
- **Slogan**: Inteligência que multiplica resultados

---

**Última atualização**: Novembro 2025

