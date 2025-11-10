# 📚 Guia de Migração - Estrutura Supabase

**Guia completo para migrar de estrutura monolítica para estrutura normalizada**

Data: 2025-11-10
Versão: 1.0.0

---

## 🎯 Objetivo

Migrar a estrutura atual do Supabase (`form_submissions` monolítica) para uma estrutura normalizada com 3 tabelas:
- `candidates` - Dados básicos dos candidatos
- `document_types` - Tipos de documentos (configurável)
- `candidate_documents` - Documentos enviados com status individual

---

## ✅ Pré-requisitos

Antes de iniciar a migração, certifique-se de:

- [ ] Ter acesso ao Supabase Dashboard
- [ ] Ter uma chave de API com permissões de admin (`SUPABASE_SERVICE_KEY`)
- [ ] Ter backup do banco de dados atual
- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas (`npm install`)

---

## 📋 Processo de Migração

### **Passo 1: Backup do Banco de Dados** 🔒

⚠️ **IMPORTANTE:** Sempre faça backup antes de qualquer migração!

1. Acesse Supabase Dashboard
2. Vá em **Database** > **Backups**
3. Clique em **Create backup**
4. Aguarde conclusão do backup

**Alternativa via CLI:**
```bash
# Export via pg_dump (requer acesso direto ao PostgreSQL)
pg_dump -h db.PROJECT_REF.supabase.co -U postgres -d postgres > backup-$(date +%Y%m%d).sql
```

---

### **Passo 2: Executar Script SQL de Criação** 🗄️

1. Abra o Supabase Dashboard
2. Vá em **SQL Editor**
3. Clique em **New query**
4. Copie e cole o conteúdo de `supabase-migration.sql`
5. Clique em **Run** (ou pressione `Ctrl+Enter`)

**O que esse script faz:**
- ✅ Cria 3 tabelas (`candidates`, `document_types`, `candidate_documents`)
- ✅ Cria índices para performance
- ✅ Cria VIEW `candidate_documents_view` para queries otimizadas
- ✅ Cria FUNCTION `get_candidate_documents()`
- ✅ Cria FUNCTION `get_candidate_completion_status()`
- ✅ Cria FUNCTION `migrate_form_submission_to_candidate()`
- ✅ Cria FUNCTION `migrate_all_completed_submissions()`
- ✅ Cria TRIGGER `update_updated_at`
- ✅ Popula `document_types` com 13 tipos de documentos

**Tempo estimado:** 2-3 minutos

---

### **Passo 3: Verificar Criação das Tabelas** ✔️

No **SQL Editor**, execute:

```sql
-- Verificar tabelas criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('candidates', 'document_types', 'candidate_documents');

-- Verificar tipos de documentos
SELECT * FROM document_types ORDER BY display_order;

-- Verificar FUNCTIONs criadas
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%candidate%';
```

**Resultado esperado:**
- 3 tabelas encontradas
- 13 tipos de documentos
- 4 functions disponíveis

---

### **Passo 4: Configurar Variáveis de Ambiente** 🔐

Certifique-se de ter no `.env`:

```bash
VITE_SUPABASE_URL=https://seu-project.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_KEY=sua-chave-service-role # NECESSÁRIO para migração
```

⚠️ **Atenção:** A `SUPABASE_SERVICE_KEY` possui permissões de admin. Nunca exponha no frontend!

**Onde encontrar:**
1. Supabase Dashboard > **Settings** > **API**
2. Copie `service_role key` (secret)

---

### **Passo 5: Testar Migração (Dry Run)** 🧪

Antes de executar a migração real, faça um teste:

```bash
npm run migrate:dry-run
```

**O que isso faz:**
- ✅ Verifica conexão com Supabase
- ✅ Verifica se tabelas existem
- ✅ Lista quantos formulários seriam migrados
- ❌ **NÃO faz nenhuma alteração**

**Saída esperada:**
```
🚀 MIGRAÇÃO SUPABASE - SBL ONBOARDING
========================================

✅ Conexão com Supabase estabelecida
✅ Todas as tabelas existem!
✅ Encontrados X formulários completados

ℹ️  Formulários que seriam migrados:
   1. user1@example.com (João Silva)
   2. user2@example.com (Maria Santos)
   ...

ℹ️  Execute sem --dry-run para realizar a migração
```

---

### **Passo 6: Executar Migração Real** 🚀

Quando estiver pronto, execute a migração:

```bash
npm run migrate
```

**O que isso faz:**
1. Verifica conexão e estrutura
2. Busca todos os `form_submissions` com `is_completed = true`
3. Para cada submission:
   - Cria entrada em `candidates`
   - Migra documentos para `candidate_documents`
   - Mantém `form_submissions` intacto (não deleta)
4. Gera relatório de migração

**Tempo estimado:** 1-5 minutos (depende do volume)

**Saída esperada:**
```
========================================
📊 RELATÓRIO DE MIGRAÇÃO
========================================

Total de registros: 50
✅ Sucesso: 48
❌ Falhas: 2
📈 Taxa de sucesso: 96.00%

⚠️  Registros com falha:
   - user3@example.com: Email duplicado
   - user4@example.com: Documentos inválidos

========================================
```

---

### **Passo 7: Validar Migração** ✅

Execute queries para validar os dados:

```sql
-- 1. Verificar candidatos migrados
SELECT COUNT(*) as total_candidatos FROM candidates;

-- 2. Verificar documentos migrados
SELECT COUNT(*) as total_documentos FROM candidate_documents;

-- 3. Comparar com form_submissions
SELECT
  (SELECT COUNT(*) FROM form_submissions WHERE is_completed = true) as submissions_completados,
  (SELECT COUNT(*) FROM candidates) as candidatos_migrados;

-- 4. Ver documentos por status
SELECT
  status,
  COUNT(*) as quantidade
FROM candidate_documents
GROUP BY status;

-- 5. Ver candidatos com documentos pendentes
SELECT * FROM candidate_documents_view
WHERE document_status = 'pending'
LIMIT 10;
```

**Resultado esperado:**
- Número de candidatos = número de submissions completados
- Todos os documentos com status `pending`
- Nenhum erro de constraint

---

### **Passo 8: Testar API** 🧪

Teste as novas funções via JavaScript:

```javascript
import {
  getCandidateByEmail,
  getCandidateDocuments,
  getCandidateCompletionStatus,
  getDocumentTypes
} from './src/services/supabaseService.js'

// Buscar candidato
const candidate = await getCandidateByEmail('user@example.com')
console.log('Candidato:', candidate)

// Buscar documentos
const documents = await getCandidateDocuments(candidate.id)
console.log('Documentos:', documents)

// Status de conclusão
const status = await getCandidateCompletionStatus(candidate.id)
console.log('Status:', status)

// Tipos de documentos
const types = await getDocumentTypes()
console.log('Tipos:', types)
```

---

## 🔄 Estratégia Híbrida (Recomendada)

### **Durante Onboarding (Steps 1-12)**
- Continuar usando `form_submissions` para:
  - Progresso do formulário (`current_step`)
  - Abandono (`is_abandoned`)
  - Tracking de atividade (`last_activity`)

### **Após Conclusão**
- Automaticamente migrar para estrutura normalizada:
  - `form_submissions.is_completed = true` → Trigger migração
  - Dados vão para `candidates` + `candidate_documents`
  - Sistema de gestão usa estrutura profissional

### **Benefícios:**
- ✅ Zero downtime
- ✅ Onboarding rápido (estrutura simples)
- ✅ Gestão profissional (estrutura normalizada)
- ✅ Rollback fácil (dados antigos preservados)

---

## 🔧 Trigger Automático (Opcional)

Para migração automática após conclusão:

```sql
-- Criar trigger que migra automaticamente quando is_completed = true
CREATE OR REPLACE FUNCTION auto_migrate_on_completion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_completed = true AND OLD.is_completed = false THEN
        PERFORM migrate_form_submission_to_candidate(NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_migrate_on_completion
    AFTER UPDATE ON form_submissions
    FOR EACH ROW
    EXECUTE FUNCTION auto_migrate_on_completion();
```

---

## 🚨 Troubleshooting

### **Erro: "Tabelas não existem"**
**Causa:** Script SQL não foi executado
**Solução:** Execute Passo 2 novamente

### **Erro: "Email duplicado"**
**Causa:** Candidato já foi migrado anteriormente
**Solução:** Normal, a migração usa UPSERT (atualiza se existir)

### **Erro: "Permission denied"**
**Causa:** `SUPABASE_SERVICE_KEY` não configurada
**Solução:** Configure a chave no `.env`

### **Erro: "Função migrate_form_submission_to_candidate não existe"**
**Causa:** Script SQL incompleto
**Solução:** Re-execute o script SQL completo

---

## 📊 Comparação: Antes vs. Depois

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Estrutura** | 1 tabela monolítica | 3 tabelas normalizadas |
| **Documentos** | JSONB não estruturado | Tabela com status individual |
| **Escalabilidade** | Limitada (ALTER TABLE) | Ilimitada (INSERT) |
| **Status individual** | Não existe | ✅ pending/approved/rejected |
| **Histórico aprovação** | Não existe | ✅ reviewed_at, review_notes |
| **Metadados** | Não existe | ✅ file_size, mime_type |
| **Queries** | Difícil (JSONB) | Fácil (JOINs) |
| **Relatórios** | Complexo | Simples (VIEW) |

---

## 🎯 Próximos Passos

Após migração completa:

1. [ ] Atualizar DocumentsUploadPage.js para usar nova estrutura
2. [ ] Criar painel admin para gerenciar candidatos
3. [ ] Implementar aprovação/rejeição de documentos
4. [ ] Criar relatórios e dashboards
5. [ ] Configurar notificações por email (documento aprovado/rejeitado)

---

## 📞 Suporte

**Documentação detalhada:** `SUPABASE-MIGRATION-PLAN.md`
**Script SQL:** `supabase-migration.sql`
**Script Node.js:** `migrate-supabase.js`

**Comandos úteis:**
```bash
npm run migrate:dry-run  # Teste sem alterar nada
npm run migrate          # Executar migração real
```

---

**Desenvolvido por:** SinergIA (Kleber)
**Data:** 2025-11-10
**Versão:** 1.0.0
