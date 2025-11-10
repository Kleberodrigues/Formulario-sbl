# 📊 Plano de Migração do Supabase
## De: Estrutura Simples → Para: Estrutura Profissional

---

## 🔍 ANÁLISE COMPARATIVA

### ❌ ESTRUTURA ATUAL (form_submissions)

**Problema:** Tudo em uma única tabela monolítica

```sql
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY,
  email VARCHAR(255),
  full_name VARCHAR(255),
  phone VARCHAR(20),

  -- ❌ Documentos como colunas individuais
  profile_photo_url TEXT,
  driving_licence_front_url TEXT,
  driving_licence_back_url TEXT,
  bank_account_number TEXT,
  bank_sort_code TEXT,
  documents JSONB,  -- ❌ JSONB sem estrutura clara

  -- ❌ Falta gestão de status de documentos
  -- ❌ Falta histórico de aprovação/rejeição
  -- ❌ Falta metadados dos arquivos
  -- ❌ Difícil adicionar novos tipos de documentos

  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  is_completed BOOLEAN
);
```

**Limitações:**
- ❌ Não escalável (adicionar novo documento = alterar schema)
- ❌ Sem gestão de status individual por documento
- ❌ Sem histórico de aprovação/rejeição
- ❌ Sem metadados (tamanho, tipo, data upload)
- ❌ JSONB dificulta queries e relatórios
- ❌ Sem relacionamento claro entre candidato e documentos

---

### ✅ ESTRUTURA PROPOSTA (Normalizada)

**Solução:** 3 tabelas relacionadas + Storage

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

**Vantagens:**
- ✅ Escalável (novos documentos = insert, não alter table)
- ✅ Status individual: pending/approved/rejected
- ✅ Histórico completo: quem revisou, quando, notas
- ✅ Metadados completos: tamanho, tipo, nome original
- ✅ Queries eficientes com JOINs
- ✅ Relatórios e dashboards fáceis
- ✅ Adicionar novos documentos sem tocar no código

---

## 🚀 MUDANÇAS NECESSÁRIAS NO SUPABASE

### 1️⃣ **CRIAR 3 NOVAS TABELAS**

#### A. Tabela `candidates`
**Dados básicos dos candidatos (substitui parte da `form_submissions`)**

```sql
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Dados pessoais
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),

    -- Configurações
    preferred_language VARCHAR(10) DEFAULT 'English',
    depot_location VARCHAR(100),

    -- Status geral
    status VARCHAR(50) DEFAULT 'pending', -- pending, active, inactive

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_candidates_email ON candidates(email);
CREATE INDEX idx_candidates_status ON candidates(status);
```

**Campos que VÊM da `form_submissions`:**
- `full_name` ← `form_submissions.full_name`
- `email` ← `form_submissions.email`
- `phone_number` ← `form_submissions.phone`
- `preferred_language` ← `form_submissions.language`
- `depot_location` ← `form_submissions.selected_depot`

---

#### B. Tabela `document_types`
**Tipos de documentos aceitos no sistema (configurável)**

```sql
CREATE TABLE document_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_required BOOLEAN DEFAULT false,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Popular com 13 tipos de documentos
INSERT INTO document_types (code, name, description, is_required, display_order) VALUES
('form_enderecos', 'Formulário de Endereços', 'Formulário completo com dados de endereço', true, 1),
('contract_recorrente', 'Contrato Recorrente', 'Contrato de prestação de serviços recorrente', true, 2),
('proof_of_address', 'Comprovante de Endereço', 'Conta de água, luz, gás ou telefone', true, 3),
('right_to_work', 'Direito ao Trabalho', 'Documento que comprova elegibilidade para trabalho no Reino Unido', true, 4),
('caf_certificate', 'Certificado CAF', 'Certificate of Application Form', true, 5),
('driver_license', 'Carteira de Motorista', 'CNH ou Driver License válida', true, 6),
('vehicle_insurance', 'Seguro do Veículo', 'Apólice de seguro do veículo', false, 7),
('vehicle_mot', 'MOT do Veículo', 'Certificado de inspeção técnica do veículo', false, 8),
('bank_statement', 'Extrato Bancário', 'Extrato bancário recente (últimos 3 meses)', false, 9),
('national_insurance', 'National Insurance', 'Número de National Insurance', true, 10),
('passport', 'Passaporte', 'Cópia do passaporte válido', false, 11),
('visa', 'Visto', 'Visto de trabalho (se aplicável)', false, 12),
('profile_photo', 'Foto de Perfil', 'Foto para o perfil do candidato', false, 13);
```

**Benefícios:**
- ✅ Adicionar novo tipo = simples INSERT
- ✅ Modificar ordem = UPDATE display_order
- ✅ Marcar obrigatório/opcional = UPDATE is_required
- ✅ Sem alterar código ou schema

---

#### C. Tabela `candidate_documents`
**Relacionamento entre candidatos e documentos (coração do sistema)**

```sql
CREATE TABLE candidate_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relacionamentos
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    document_type_id INTEGER NOT NULL REFERENCES document_types(id),

    -- Storage (Supabase Storage)
    storage_bucket VARCHAR(100) DEFAULT 'form-documents',
    storage_path TEXT NOT NULL,

    -- Metadados do arquivo
    original_filename VARCHAR(255),
    file_size INTEGER, -- em bytes
    mime_type VARCHAR(100), -- application/pdf, image/jpeg, etc

    -- Status e validação (NOVO!)
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID, -- admin que revisou
    review_notes TEXT, -- motivo da aprovação/rejeição

    -- Evitar duplicatas (1 candidato = 1 documento por tipo)
    UNIQUE(candidate_id, document_type_id)
);

CREATE INDEX idx_candidate_documents_candidate ON candidate_documents(candidate_id);
CREATE INDEX idx_candidate_documents_type ON candidate_documents(document_type_id);
CREATE INDEX idx_candidate_documents_status ON candidate_documents(status);
```

**Campos que SUBSTITUEM `form_submissions`:**
- `profile_photo_url` → `candidate_documents` WHERE `document_type_id = profile_photo`
- `driving_licence_front_url` → `candidate_documents` WHERE `document_type_id = driver_license`
- `driving_licence_back_url` → **REMOVIDO** (não precisa mais, só 1 upload)
- `documents JSONB` → **REMOVIDO** (agora é tabela normalizada)

---

### 2️⃣ **CRIAR VIEW PARA FACILITAR QUERIES**

```sql
CREATE VIEW candidate_documents_view AS
SELECT
    c.id as candidate_id,
    c.full_name,
    c.email,
    c.phone_number,
    c.depot_location,
    c.status as candidate_status,

    dt.code as document_code,
    dt.name as document_name,
    dt.is_required,
    dt.display_order,

    cd.id as document_id,
    cd.storage_path,
    cd.original_filename,
    cd.file_size,
    cd.mime_type,
    cd.status as document_status,
    cd.uploaded_at,
    cd.reviewed_at,
    cd.review_notes
FROM candidates c
LEFT JOIN candidate_documents cd ON c.id = cd.candidate_id
LEFT JOIN document_types dt ON cd.document_type_id = dt.id
ORDER BY c.created_at DESC, dt.display_order;
```

**Uso:**
```sql
-- Ver todos os documentos de um candidato
SELECT * FROM candidate_documents_view
WHERE candidate_id = 'uuid-123';

-- Ver candidatos com documentos pendentes
SELECT * FROM candidate_documents_view
WHERE document_status = 'pending';
```

---

### 3️⃣ **CRIAR FUNÇÃO PARA BUSCAR DOCUMENTOS**

```sql
CREATE OR REPLACE FUNCTION get_candidate_documents(p_candidate_id UUID)
RETURNS TABLE (
    document_code VARCHAR,
    document_name VARCHAR,
    is_required BOOLEAN,
    storage_path TEXT,
    status VARCHAR,
    uploaded_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        dt.code,
        dt.name,
        dt.is_required,
        cd.storage_path,
        cd.status,
        cd.uploaded_at
    FROM document_types dt
    LEFT JOIN candidate_documents cd
        ON dt.id = cd.document_type_id
        AND cd.candidate_id = p_candidate_id
    ORDER BY dt.display_order;
END;
$$ LANGUAGE plpgsql;
```

**Uso em JavaScript:**
```javascript
const { data } = await supabase.rpc('get_candidate_documents', {
  p_candidate_id: 'uuid-123'
});
```

---

### 4️⃣ **TRIGGER PARA AUTO-ATUALIZAR `updated_at`**

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_candidates_updated_at
    BEFORE UPDATE ON candidates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## 🗂️ STORAGE (SUPABASE STORAGE)

### Estrutura do Bucket `form-documents`

```
form-documents/
├── proof_of_address_a1b2c3d4-uuid.pdf
├── proof_of_address_e5f6g7h8-uuid.pdf
├── right_to_work_a1b2c3d4-uuid.pdf
├── driver_license_a1b2c3d4-uuid.pdf
├── profile_photo_a1b2c3d4-uuid.jpg
└── ...
```

**Formato:** `{document_type_code}_{uuid}.{extensão}`

---

## 📋 MAPEAMENTO: FORM_SUBMISSIONS → NOVA ESTRUTURA

| Campo Atual (form_submissions) | Nova Estrutura | Observação |
|-------------------------------|----------------|------------|
| `id` | `candidates.id` | UUID mantido |
| `email` | `candidates.email` | UNIQUE |
| `full_name` | `candidates.full_name` | - |
| `phone` | `candidates.phone_number` | - |
| `language` | `candidates.preferred_language` | - |
| `selected_depot` | `candidates.depot_location` | - |
| `profile_photo_url` | `candidate_documents` + `storage_path` | Normalizado |
| `driving_licence_front_url` | `candidate_documents` | Tipo: driver_license |
| `driving_licence_back_url` | **REMOVIDO** | Apenas 1 arquivo CNH |
| `documents` (JSONB) | `candidate_documents` (tabela) | Normalizado |
| `current_step` | **MANTER** em `form_submissions` | Progresso formulário |
| `is_completed` | **MANTER** ou `candidates.status` | - |
| `created_at` | `candidates.created_at` | - |
| `updated_at` | `candidates.updated_at` | Auto-atualizado |

---

## 🔄 ESTRATÉGIA DE MIGRAÇÃO

### **Opção 1: Migração Gradual (Recomendado)**

**Não apagar `form_submissions` - criar novo sistema em paralelo**

1. ✅ Criar novas tabelas (`candidates`, `document_types`, `candidate_documents`)
2. ✅ Manter `form_submissions` para formulário de onboarding
3. ✅ Após conclusão do formulário → criar entrada em `candidates`
4. ✅ Documentos vão para `candidate_documents`
5. ✅ `form_submissions` vira histórico de progresso
6. ✅ `candidates` + `candidate_documents` vira gestão de candidatos

**Vantagem:** Zero downtime, pode testar antes de migrar

---

### **Opção 2: Migração Completa (Mais arriscado)**

1. Criar novas tabelas
2. Migrar dados de `form_submissions` → `candidates`
3. Migrar documentos → `candidate_documents`
4. Apagar `form_submissions`

**Desvantagem:** Requer atualização de TODO o código

---

## 💡 RECOMENDAÇÃO FINAL

### ✅ **ESTRUTURA HÍBRIDA (Melhor dos 2 mundos)**

**Durante o Onboarding (Steps 1-12):**
- Usar `form_submissions` (como está hoje)
- Salvar progresso, steps completados, abandono
- JSONB temporário OK

**Após Conclusão do Formulário:**
- Criar entrada em `candidates`
- Migrar documentos para `candidate_documents`
- `form_submissions.is_completed = true`
- Sistema de gestão usa `candidates` + `candidate_documents`

**Benefícios:**
- ✅ Onboarding rápido e simples (form_submissions)
- ✅ Gestão profissional (candidates + candidate_documents)
- ✅ Melhor dos dois mundos
- ✅ Fácil implementar dashboards para admin

---

## 📊 EXEMPLO PRÁTICO

### Candidato: João Silva

**1. Durante Onboarding (form_submissions):**
```json
{
  "id": "uuid-1234",
  "email": "joao@email.com",
  "full_name": "João Silva",
  "current_step": 8,
  "profile_photo_url": "form-documents/photo_abc.jpg",
  "is_completed": false
}
```

**2. Após Conclusão → Migração Automática:**

**Tabela `candidates`:**
```sql
INSERT INTO candidates (id, full_name, email, phone_number, depot_location)
VALUES ('uuid-1234', 'João Silva', 'joao@email.com', '+44...', 'Southampton');
```

**Tabela `candidate_documents`:**
```sql
-- Foto de Perfil
INSERT INTO candidate_documents
(candidate_id, document_type_id, storage_path, status)
VALUES ('uuid-1234', 13, 'form-documents/photo_abc.jpg', 'pending');

-- CNH
INSERT INTO candidate_documents
(candidate_id, document_type_id, storage_path, status)
VALUES ('uuid-1234', 6, 'form-documents/cnh_abc.pdf', 'pending');

-- Comprovante Endereço
INSERT INTO candidate_documents
(candidate_id, document_type_id, storage_path, status)
VALUES ('uuid-1234', 3, 'form-documents/address_abc.pdf', 'pending');
```

**3. Admin Revisa Documentos:**
```sql
UPDATE candidate_documents
SET status = 'approved',
    reviewed_at = NOW(),
    review_notes = 'Documento válido'
WHERE id = 'doc-uuid';
```

---

## 🎯 PRÓXIMOS PASSOS

### Implementação Rápida (1-2 horas):

1. ✅ **Executar SQL de criação de tabelas**
   - Copiar `candidate_documents_structure.sql`
   - Executar no Supabase SQL Editor

2. ✅ **Criar função de migração automática**
   - Quando `form_submissions.is_completed = true`
   - Criar entrada em `candidates`
   - Migrar documentos para `candidate_documents`

3. ✅ **Atualizar código do formulário**
   - Manter salvamento em `form_submissions` durante onboarding
   - Adicionar hook após conclusão para migrar dados

4. ✅ **Criar painel admin**
   - Listar candidatos (`candidates`)
   - Ver documentos (`candidate_documents_view`)
   - Aprovar/rejeitar documentos

---

## ✨ BENEFÍCIOS DA NOVA ESTRUTURA

| Recurso | Antes | Depois |
|---------|-------|--------|
| Adicionar novo documento | ❌ Alterar schema | ✅ INSERT em document_types |
| Status por documento | ❌ Não existe | ✅ pending/approved/rejected |
| Histórico de aprovação | ❌ Não existe | ✅ reviewed_at, review_notes |
| Metadados de arquivo | ❌ Não existe | ✅ file_size, mime_type, etc |
| Relatórios | ❌ Difícil (JSONB) | ✅ Fácil (JOINs) |
| Escalabilidade | ❌ Limitada | ✅ Ilimitada |
| Dashboard admin | ❌ Complexo | ✅ Simples |

---

**Quer que eu implemente essa migração?** 🚀
