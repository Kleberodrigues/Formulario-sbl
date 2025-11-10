# 🚀 SBL Onboarding - Nova Estrutura Supabase

**Sistema profissional de gestão de candidatos e documentos**

---

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [O Que Mudou](#o-que-mudou)
3. [Instalação](#instalação)
4. [Migração](#migração)
5. [Uso](#uso)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

A nova estrutura do Supabase migra de uma **tabela monolítica** para uma **arquitetura normalizada** com 3 tabelas:

```
┌─────────────────────┐
│    CANDIDATES       │  ← Dados básicos do candidato
│  (1 candidato)      │
└──────────┬──────────┘
           │ 1:N
           ▼
┌─────────────────────┐
│ CANDIDATE_DOCUMENTS │  ← Relacionamento candidato ↔ documentos
│  (N documentos)     │
└──────────┬──────────┘
           │ N:1
           ▼
┌─────────────────────┐
│   DOCUMENT_TYPES    │  ← Tipos de documentos (configurável)
│  (13 tipos)         │
└─────────────────────┘
```

### **Vantagens:**
- ✅ **Escalável**: Novos documentos = INSERT, não ALTER TABLE
- ✅ **Status Individual**: pending/approved/rejected por documento
- ✅ **Histórico**: Quem revisou, quando, notas
- ✅ **Metadados**: Tamanho, tipo MIME, nome original
- ✅ **Queries Eficientes**: JOINs otimizados
- ✅ **Relatórios Fáceis**: VIEW pré-configurada
- ✅ **Flexível**: Adicionar novos tipos sem código

---

## 🔄 O Que Mudou

### **Estrutura Antiga** ❌
```sql
form_submissions
├── documents JSONB (não estruturado)
├── profile_photo_url TEXT
├── driving_licence_front_url TEXT
└── driving_licence_back_url TEXT
```

**Problemas:**
- ❌ Adicionar documento = ALTER TABLE
- ❌ Sem status individual
- ❌ Sem histórico de aprovação
- ❌ JSONB dificulta queries

### **Estrutura Nova** ✅
```sql
candidates (dados básicos)
  ↓
candidate_documents (documentos com status)
  ↓
document_types (tipos configuráveis)
```

**Benefícios:**
- ✅ Escalável
- ✅ Status por documento
- ✅ Histórico completo
- ✅ Queries simples

---

## 🛠️ Instalação

### **1. Dependências**

Já instaladas no projeto:
```bash
npm install @supabase/supabase-js
npm install dotenv
npm install node-fetch
```

### **2. Configuração**

Adicione no `.env`:
```bash
VITE_SUPABASE_URL=https://seu-project.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_KEY=sua-chave-service-role # Para migração
```

⚠️ **IMPORTANTE:** `SUPABASE_SERVICE_KEY` tem permissões de admin. Nunca exponha no frontend!

---

## 📦 Migração

### **Passo 1: Backup** 🔒

Sempre faça backup antes:
1. Supabase Dashboard > Database > Backups
2. Create backup
3. Aguarde conclusão

### **Passo 2: Executar SQL** 🗄️

1. Abra Supabase Dashboard > SQL Editor
2. Copie e cole `supabase-migration.sql`
3. Execute (Ctrl+Enter)

Isso cria:
- ✅ 3 tabelas (candidates, document_types, candidate_documents)
- ✅ VIEW otimizada (candidate_documents_view)
- ✅ 4 FUNCTIONs PostgreSQL
- ✅ Trigger auto-update
- ✅ 13 tipos de documentos

### **Passo 3: Testar** 🧪

```bash
# Teste sem alterar nada
npm run migrate:dry-run
```

Saída esperada:
```
✅ Conexão com Supabase estabelecida
✅ Todas as tabelas existem!
✅ Encontrados X formulários completados
```

### **Passo 4: Migrar** 🚀

```bash
# Executar migração real
npm run migrate
```

Saída esperada:
```
========================================
📊 RELATÓRIO DE MIGRAÇÃO
========================================

Total de registros: 50
✅ Sucesso: 48
❌ Falhas: 2
📈 Taxa de sucesso: 96.00%
```

---

## 💻 Uso

### **Durante Onboarding (Steps 1-12)**

Continuar usando `form_submissions`:

```javascript
import { upsertFormSubmission, saveFormStep, markFormAsCompleted } from './src/services/supabaseService.js'

// Step 1
await upsertFormSubmission(email, { language: 'en' })

// Step 2
await saveFormStep(email, 2, { selectedDepot: 'Southampton' })

// Step 12
await markFormAsCompleted(email)
```

### **Após Conclusão → Migração Automática**

```javascript
import { migrateFormSubmissionToCandidate } from './src/services/supabaseService.js'

// Trigger após is_completed = true
const result = await migrateFormSubmissionToCandidate(email)

if (result.success) {
  console.log('✅ Candidato criado:', result.candidateId)
}
```

### **Upload de Documento Individual**

```javascript
import {
  getCandidateByEmail,
  uploadCandidateDocument
} from './src/services/supabaseService.js'

// 1. Buscar candidato
const candidate = await getCandidateByEmail(email)

// 2. Upload documento
const result = await uploadCandidateDocument(
  candidate.id,
  'right_to_work', // Código do tipo
  file
)

console.log('✅ Documento enviado:', result.url)
```

### **Listar Documentos**

```javascript
import { getCandidateDocuments } from './src/services/supabaseService.js'

const documents = await getCandidateDocuments(candidateId)

documents.forEach(doc => {
  console.log(`${doc.document_name}: ${doc.status || 'não enviado'}`)
})
```

### **Status de Conclusão**

```javascript
import { getCandidateCompletionStatus } from './src/services/supabaseService.js'

const status = await getCandidateCompletionStatus(candidateId)

console.log(`Progresso: ${status.total_uploaded}/${status.total_required}`)
console.log(`Completo: ${status.is_complete ? 'Sim' : 'Não'}`)

if (status.missing_documents.length > 0) {
  console.log('Faltam:', status.missing_documents)
}
```

### **Admin - Aprovar/Rejeitar**

```javascript
import { updateDocumentStatus } from './src/services/supabaseService.js'

// Aprovar
await updateDocumentStatus(
  documentId,
  'approved',
  'Documento válido'
)

// Rejeitar
await updateDocumentStatus(
  documentId,
  'rejected',
  'Documento borrado, reenviar'
)
```

---

## 📚 API Reference

### **Novas Funções (Estrutura Normalizada)**

#### `upsertCandidate(candidateData)`
Criar ou atualizar candidato.

```javascript
const candidate = await upsertCandidate({
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '+44 123 456 789',
  language: 'en',
  selectedDepot: 'Southampton',
  status: 'pending'
})
```

#### `getCandidateByEmail(email)`
Buscar candidato por email.

```javascript
const candidate = await getCandidateByEmail('john@example.com')
// Retorna: { id, full_name, email, phone_number, ... }
```

#### `uploadCandidateDocument(candidateId, documentTypeCode, file)`
Upload de documento vinculado ao candidato.

```javascript
const result = await uploadCandidateDocument(
  'uuid-123',
  'right_to_work',
  fileObject
)
// Retorna: { success, document, url }
```

#### `getCandidateDocuments(candidateId)`
Listar documentos de um candidato (usa PostgreSQL FUNCTION).

```javascript
const documents = await getCandidateDocuments('uuid-123')
// Retorna: Array com todos os tipos (enviados ou não)
```

#### `updateDocumentStatus(documentId, status, reviewNotes?)`
Atualizar status de um documento.

```javascript
await updateDocumentStatus(
  'doc-uuid',
  'approved',
  'Documento OK'
)
```

#### `getCandidateCompletionStatus(candidateId)`
Verificar status de conclusão (usa PostgreSQL FUNCTION).

```javascript
const status = await getCandidateCompletionStatus('uuid-123')
// Retorna:
// {
//   total_required: 10,
//   total_uploaded: 7,
//   total_approved: 0,
//   total_rejected: 0,
//   total_pending: 7,
//   is_complete: false,
//   missing_documents: ['Doc1', 'Doc2', 'Doc3']
// }
```

#### `migrateFormSubmissionToCandidate(email)`
Migrar form_submission para estrutura normalizada.

```javascript
const result = await migrateFormSubmissionToCandidate('john@example.com')
// Retorna: { success, candidateId }
```

#### `getDocumentTypes()`
Listar tipos de documentos disponíveis.

```javascript
const types = await getDocumentTypes()
// Retorna: Array com 13 tipos ordenados por display_order
```

#### `getCandidateDocumentsView(filters)`
Buscar view de candidatos com documentos (para admin).

```javascript
// Documentos pendentes
const pending = await getCandidateDocumentsView({
  documentStatus: 'pending'
})

// Candidatos ativos
const active = await getCandidateDocumentsView({
  candidateStatus: 'active'
})

// Apenas obrigatórios
const required = await getCandidateDocumentsView({
  isRequired: true
})
```

---

## 🗂️ Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `supabase-migration.sql` | Script SQL completo (tabelas, views, functions) |
| `migrate-supabase.js` | Script Node.js para migração automática |
| `SUPABASE-MIGRATION-PLAN.md` | Análise detalhada e plano de migração |
| `MIGRATION-GUIDE.md` | Guia passo a passo para executar migração |
| `EXAMPLE-NEW-STRUCTURE.js` | Exemplos de uso da nova estrutura |
| `README-MIGRATION.md` | Este arquivo |

---

## 🔍 Queries SQL Úteis

### Ver candidatos com documentos pendentes
```sql
SELECT * FROM candidate_documents_view
WHERE document_status = 'pending'
ORDER BY uploaded_at DESC;
```

### Ver documentos por status
```sql
SELECT
  dt.name as tipo_documento,
  COUNT(CASE WHEN cd.status = 'pending' THEN 1 END) as pendentes,
  COUNT(CASE WHEN cd.status = 'approved' THEN 1 END) as aprovados,
  COUNT(CASE WHEN cd.status = 'rejected' THEN 1 END) as rejeitados
FROM document_types dt
LEFT JOIN candidate_documents cd ON dt.id = cd.document_type_id
GROUP BY dt.id, dt.name
ORDER BY dt.display_order;
```

### Ver candidatos por depot
```sql
SELECT
  depot_location,
  COUNT(*) as total_candidatos,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as ativos,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pendentes
FROM candidates
GROUP BY depot_location;
```

---

## 🚨 Troubleshooting

### Erro: "Tabelas não existem"
**Solução:** Execute `supabase-migration.sql` no SQL Editor

### Erro: "Email duplicado"
**Solução:** Normal, a migração usa UPSERT (atualiza se existir)

### Erro: "Permission denied"
**Solução:** Configure `SUPABASE_SERVICE_KEY` no `.env`

### Erro: "Função não existe"
**Solução:** Re-execute o script SQL completo

---

## 📊 Comandos NPM

```bash
# Desenvolvimento
npm run dev              # Iniciar dev server

# Automação
npm run setup-n8n        # Configurar workflow n8n
npm run migrate:dry-run  # Testar migração (sem alterar)
npm run migrate          # Executar migração real

# Build
npm run build            # Build produção
npm run preview          # Preview build
```

---

## 🎯 Próximos Passos

Após migração completa:

1. [ ] Atualizar DocumentsUploadPage.js para usar nova estrutura
2. [ ] Criar painel admin para gerenciar candidatos
3. [ ] Implementar aprovação/rejeição de documentos
4. [ ] Criar relatórios e dashboards
5. [ ] Configurar notificações por email
6. [ ] Adicionar filtros avançados na view
7. [ ] Implementar busca full-text

---

## 📞 Documentação Completa

- **Análise Detalhada:** `SUPABASE-MIGRATION-PLAN.md`
- **Guia de Migração:** `MIGRATION-GUIDE.md`
- **Exemplos de Uso:** `EXAMPLE-NEW-STRUCTURE.js`
- **Script SQL:** `supabase-migration.sql`
- **Script Migração:** `migrate-supabase.js`

---

**Desenvolvido por:** SinergIA (Kleber)
**Data:** 2025-11-10
**Versão:** 1.0.0
**Projeto:** SBL Onboarding Form
