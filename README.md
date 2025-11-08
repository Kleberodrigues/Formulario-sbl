# 🎯 SBL Onboarding Form - Documentação Completa

[![CI](https://github.com/Kleberodrigues/Formulario-sbl/actions/workflows/ci.yml/badge.svg)](https://github.com/Kleberodrigues/Formulario-sbl/actions/workflows/ci.yml)


> **Inteligência que multiplica resultados** - SinergIA

---

## 📚 Arquivos Inclusos

### 📋 Documentação
- **CLAUDE.md** - Documentação técnica para Claude Code (LEIA PRIMEIRO!)
- **PRD.md** - Product Requirements Document (requisitos completos)
- **SETUP.md** - Guia passo-a-passo de setup (configuração inicial)
- **README.md** - Este arquivo

### 🔧 Configuração
- **.env.example** - Template de variáveis de ambiente
- **.cursorules** - Regras para Claude Code no Cursor

### 💾 Código
- **supabase-config.js** - Configuração Supabase
- **supabase-service.js** - Serviço com operações CRUD

### 🗄️ Banco de Dados
- **migrations.sql** - Schema SQL (tabelas, índices, RLS)

---

## 🚀 Quick Start (5 minutos)

### 1️⃣ Ler Documentação
```
Leia CLAUDE.md primeiro para entender o contexto completo
```

### 2️⃣ Setup Supabase
```bash
# Acesse: https://app.supabase.com
# Crie novo projeto
# Copie credenciais para .env.local
```

### 3️⃣ Executar Migrations
```bash
# No SQL Editor do Supabase, copie migrations.sql
# Execute com Ctrl+Enter
```

### 4️⃣ Instalar Dependências
```bash
npm install @supabase/supabase-js
```

### 5️⃣ Começar Desenvolvimento
```bash
npm run dev
# Abra http://localhost:5173
```

---

## 📁 Estrutura do Projeto

```
projeto/
├── CLAUDE.md                 # 📌 Leia isto primeiro
├── PRD.md                    # Requisitos detalhados
├── SETUP.md                  # Guia de setup
├── .env.example              # Template variáveis
├── .cursorules               # Regras para Claude Code
├── migrations.sql            # Schema Supabase
├── supabase-config.js        # Config Supabase
├── supabase-service.js       # Serviço CRUD
├── src/
│   ├── index.html           # HTML principal
│   ├── main.js              # Entrada JavaScript
│   ├── config/              # Configurações
│   ├── components/          # Componentes reutilizáveis
│   ├── pages/               # Páginas (Steps)
│   ├── services/            # Lógica de negócio
│   ├── utils/               # Funções auxiliares
│   └── styles/              # CSS
├── package.json
└── .git/
```

---

## 🎨 Design & Cores

- **Primária**: Teal/Turquesa `#17A798`
- **Secundária**: Branco `#FFFFFF`
- **Textos**: Cinza escuro `#333333`
- **Inputs**: Cinza claro `#F5F5F5`

Clonar do design atual: https://sbl.zeritycloud.com/onboarding

---

## 📊 Fluxo do Formulário

```
Step 1: Boas-vindas
  ↓ (seleciona idioma)
Step 2: Contato
  ↓ (preenche nome, email, telefone)
Step 3: Chat
  ↓ (envia mensagem teste)
Step 4: Depósito
  ↓ (seleciona localização no mapa)
Step Final: Conclusão
  ↓
✅ Sucesso! (Salvo em Supabase)
```

---

## 🗄️ Banco de Dados

### Tabelas Principais

**form_submissions** - Dados do formulário
- email (unique)
- full_name
- phone
- language
- selected_depot
- current_step
- completed_steps
- messages (JSONB)
- is_completed
- is_abandoned
- timestamps

**form_abandonments** - Rastreamento de abandono
- submission_id (FK)
- email
- abandoned_at_step
- followup_sent
- followup_type (email/whatsapp)

---

## 🔌 Integrações

### Supabase
```javascript
import { initSupabase } from './supabase-config.js'
import { saveFormStep } from './supabase-service.js'

const supabase = initSupabase()
await saveFormStep(email, stepNumber, stepData)
```

### n8n (Follow-up Automático)
- Webhook dispara quando usuário abandona
- Envia email/WhatsApp com link para retomar
- Marca como enviado no Supabase

### Mapbox (Mapa de Depósitos)
- Exibe localizações no Step 4
- Permite seleção de depósito

---

## 💻 Usando Claude Code no Cursor

### Setup Inicial
```
1. Abra o projeto no Cursor
2. Leia CLAUDE.md (será usado como referência)
3. Abra .cursorules (regras do projeto)
```

### Pedir uma Tarefa
```
Leia CLAUDE.md e PRD.md

Crie o componente Step 2 (Contato) com:
- Validação de email e telefone
- Integração com Supabase
- Feedback visual de erro
```

### Validar Antes de Commit
```bash
depcruise src/ --validate
```

---

## 🧪 Checklist de Desenvolvimento

### Antes de Começar
- [ ] Leia CLAUDE.md
- [ ] Configure Supabase
- [ ] Execute migrations.sql
- [ ] Copie .env.example para .env.local
- [ ] Instale dependências: `npm install`

### Durante o Desenvolvimento
- [ ] Escreva código limpo e comentado
- [ ] Valide com `depcruise src/`
- [ ] Teste em mobile (320px+)
- [ ] Verifique Supabase tem dados
- [ ] Sem console errors/warnings

### Antes de Deploy
- [ ] Teste todos os 5 steps
- [ ] Teste abandono em cada step
- [ ] Verifique follow-up dispara
- [ ] Responsividade OK
- [ ] Performance OK (< 2s para salvar)
- [ ] Segurança OK (sem API keys expostas)

---

## 🔐 Segurança

### Variáveis de Ambiente
```
VITE_SUPABASE_URL=xxx         # Público (OK no cliente)
VITE_SUPABASE_ANON_KEY=xxx    # Público (OK no cliente)
VITE_N8N_WEBHOOK_URL=xxx      # Público (OK no cliente)
SUPABASE_SERVICE_ROLE_KEY=xxx # PRIVADO (Nunca no cliente!)
```

### RLS (Row Level Security)
- Usuários só veem seus próprios dados
- Validar email como identificador único
- Rate limiting ativo

### Inputs
- Validar antes de salvar
- Sanitizar strings
- Verificar tipos de dados

---

## 📱 Responsividade

**Breakpoints**:
- Mobile: 320px - 767px
- Tablet: 768px - 1023px  
- Desktop: 1024px+

Testar em:
- iPhone (375px)
- iPad (768px)
- Desktop (1440px)

---

## 🧑‍💻 Desenvolvendo com Claude Code

### Exemplo 1: Criar Step 1

**Prompt**:
```
Leia CLAUDE.md

Crie um novo arquivo: src/pages/WelcomePage.js

Deve ter:
- Logo SBL centrado
- Texto "Welcome to SBL"
- Seletor de idioma dropdown com PT, EN, BG, RO
- Botão "Continuar"
- Salvar seleção de idioma no Supabase com saveFormStep

Use cores do design: #17A798 para botão
```

### Exemplo 2: Criar Validação

**Prompt**:
```
Crie src/utils/validators.js

Função validateEmail(email) - retorna true/false
Função validatePhone(phone) - retorna true/false  
Função validateFullName(name) - retorna true/false

Adicione erro amigável em português
```

### Exemplo 3: Integrar com Supabase

**Prompt**:
```
Atualize src/pages/ContactPage.js

Quando clicar "Continuar":
1. Validar email, phone, fullName
2. Chamar saveFormStep() do supabase-service.js
3. Mostrar loading spinner
4. Se sucesso: ir para Step 3
5. Se erro: mostrar mensagem amigável
```

---

## 📊 Monitoring

### Queries Úteis

```sql
-- Taxa de conclusão
SELECT 
  COUNT(*) total,
  SUM(CASE WHEN is_completed THEN 1 ELSE 0 END) completed,
  ROUND(100 * SUM(CASE WHEN is_completed THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric, 2) taxa
FROM form_submissions
WHERE created_at >= NOW() - '7 days'::interval;

-- Abandonamentos por step
SELECT abandoned_at_step, COUNT(*) qty
FROM form_abandonments
GROUP BY abandoned_at_step
ORDER BY qty DESC;

-- Follow-ups enviados
SELECT COUNT(*), SUM(CASE WHEN followup_sent THEN 1 ELSE 0 END)
FROM form_abandonments;
```

---

## 🆘 Troubleshooting

### "Supabase não inicializado"
→ Verifique .env.local tem as credenciais corretas

### "Email já existe"
→ Tratado no código (upsert), verifique RLS

### "Webhook n8n não funciona"
→ Teste URL manualmente, verifique logs em n8n

### "Dados não salvando"
→ Verifique console (F12), RLS policies, permissões

---

## 🎯 Próximas Etapas

1. ✅ Setup Supabase (SETUP.md)
2. ✅ Executar migrations.sql
3. ✅ Desenvolver Steps 1-5
4. ✅ Testar abandono
5. ✅ Configurar n8n follow-up
6. ✅ Deploy em staging
7. ✅ Teste com usuários
8. ✅ Deploy em produção

---

## 📞 Contato & Suporte

**Projeto**: SBL Onboarding Form  
**Agência**: SinergIA  
**Lema**: Inteligência que multiplica resultados  
**Dev**: Kleber  

---

## 📝 Changelog

### v1.0.0 (Em Desenvolvimento)
- Estrutura base do projeto
- Documentação CLAUDE.md + PRD.md
- Supabase config + service
- Migrations SQL
- Setup guide

### v1.1.0 (Próximo)
- Steps 1-5 implementados
- n8n integration ativa
- Dashboard de métricas
- Mobile responsivo

---

## 📚 Referências

- **CLAUDE.md** - Documentação técnica completa
- **PRD.md** - Requisitos funcionais
- **SETUP.md** - Guia passo-a-passo
- **migrations.sql** - Schema Supabase
- **supabase-config.js** - Configuração
- **supabase-service.js** - Serviço CRUD

---

## ✨ Boas Práticas

✅ **Fazer**
- Ler CLAUDE.md antes de qualquer tarefa
- Validar com `depcruise`
- Testar em mobile
- Comentar em português
- Usar async/await

❌ **Não Fazer**
- Mudar estrutura de pastas
- Adicionar dependências sem discutir
- Expor chaves de API
- Ignorar validações
- Usar var (usar const/let)

---

**Última atualização**: Novembro 2025


