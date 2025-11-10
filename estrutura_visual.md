# ESTRUTURA DE ARMAZENAMENTO DE DOCUMENTOS
## Sistema de Onboarding - Silva Brothers Logistics LTD

---

## 📊 DIAGRAMA DE RELACIONAMENTO

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CANDIDATES                                   │
│  (Tabela com dados básicos dos candidatos)                          │
├─────────────────────────────────────────────────────────────────────┤
│ • id (UUID - Primary Key)                                            │
│ • full_name                                                          │
│ • email                                                              │
│ • phone_number                                                       │
│ • preferred_language                                                 │
│ • depot_location                                                     │
│ • status                                                             │
│ • created_at / updated_at                                            │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    CANDIDATE_DOCUMENTS                               │
│  (Relaciona candidatos com seus documentos no Storage)              │
├─────────────────────────────────────────────────────────────────────┤
│ • id (UUID)                                                          │
│ • candidate_id → CANDIDATES.id                                       │
│ • document_type_id → DOCUMENT_TYPES.id                               │
│ • storage_bucket (ex: 'form-documents')                              │
│ • storage_path (ex: 'form-documents/proof_address_uuid.pdf')         │
│ • original_filename                                                  │
│ • file_size / mime_type                                              │
│ • status (pending/approved/rejected)                                 │
│ • uploaded_at / reviewed_at                                          │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ N:1
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DOCUMENT_TYPES                                  │
│  (Tipos de documentos aceitos no sistema)                           │
├─────────────────────────────────────────────────────────────────────┤
│ • id (Serial - Primary Key)                                          │
│ • code (ex: 'proof_of_address')                                      │
│ • name (ex: 'Comprovante de Endereço')                               │
│ • description                                                        │
│ • is_required                                                        │
│ • display_order                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📁 SUPABASE STORAGE (Bucket: form-documents)

O Storage **NÃO** é uma tabela. É um sistema de arquivos onde cada documento é um arquivo individual:

```
form-documents/
│
├── form_enderecos_a1b2c3d4-uuid.pdf
├── form_enderecos_e5f6g7h8-uuid.pdf
│
├── contract_recorrente_a1b2c3d4-uuid.pdf
├── contract_recorrente_e5f6g7h8-uuid.pdf
│
├── proof_of_address_a1b2c3d4-uuid.pdf
├── proof_of_address_e5f6g7h8-uuid.pdf
│
├── right_to_work_a1b2c3d4-uuid.pdf
├── driver_license_a1b2c3d4-uuid.pdf
├── vehicle_insurance_a1b2c3d4-uuid.pdf
├── bank_statement_a1b2c3d4-uuid.pdf
└── ...
```

**Cada arquivo tem um nome único:** `{document_type}_{uuid}.{extensão}`

---

## 🔄 FLUXO DE DADOS

### 1️⃣ Candidato se cadastra:
```sql
INSERT INTO candidates (full_name, email, phone_number)
VALUES ('João Silva', 'joao@email.com', '+44 7700 900123');
-- Retorna: candidate_id = uuid-1234
```

### 2️⃣ Candidato faz upload de documento:
**No Frontend:**
- Upload do arquivo para o Supabase Storage
- Storage retorna o caminho: `form-documents/proof_of_address_uuid-5678.pdf`

**No Backend:**
```sql
INSERT INTO candidate_documents 
(candidate_id, document_type_id, storage_path, original_filename)
VALUES (
    'uuid-1234',
    (SELECT id FROM document_types WHERE code = 'proof_of_address'),
    'form-documents/proof_of_address_uuid-5678.pdf',
    'meu_comprovante.pdf'
);
```

### 3️⃣ Consultar documentos de um candidato:
```sql
SELECT * FROM candidate_documents_view 
WHERE candidate_id = 'uuid-1234';
```

**Resultado:**
| candidate_id | full_name   | document_name              | storage_path                        | status  |
|--------------|-------------|----------------------------|-------------------------------------|---------|
| uuid-1234    | João Silva  | Comprovante de Endereço    | form-documents/proof_address_...    | pending |
| uuid-1234    | João Silva  | Carteira de Motorista      | form-documents/driver_license_...   | approved|
| uuid-1234    | João Silva  | Contrato Recorrente        | form-documents/contract_...         | pending |

---

## 📋 EXEMPLO PRÁTICO: Um Candidato com Múltiplos Documentos

### Tabela CANDIDATES:
| id           | full_name        | email                  | phone_number      | depot_location          |
|--------------|------------------|------------------------|-------------------|-------------------------|
| uuid-1234    | João Silva       | joao@email.com         | +44 7700 900123   | DSO2 (Southampton)      |
| uuid-5678    | Maria Santos     | maria@email.com        | +44 7700 900456   | Swindon                 |

### Tabela CANDIDATE_DOCUMENTS:
| id        | candidate_id | document_type_id | storage_path                                    | status   |
|-----------|--------------|------------------|-------------------------------------------------|----------|
| doc-1     | uuid-1234    | 3                | form-documents/proof_of_address_abc123.pdf      | approved |
| doc-2     | uuid-1234    | 4                | form-documents/right_to_work_abc456.pdf         | pending  |
| doc-3     | uuid-1234    | 6                | form-documents/driver_license_abc789.pdf        | approved |
| doc-4     | uuid-5678    | 3                | form-documents/proof_of_address_def123.pdf      | pending  |
| doc-5     | uuid-5678    | 4                | form-documents/right_to_work_def456.pdf         | approved |

### Arquivos no SUPABASE STORAGE (Bucket: form-documents):
```
form-documents/
├── proof_of_address_abc123.pdf  ← João Silva
├── right_to_work_abc456.pdf     ← João Silva
├── driver_license_abc789.pdf    ← João Silva
├── proof_of_address_def123.pdf  ← Maria Santos
└── right_to_work_def456.pdf     ← Maria Santos
```

---

## 🎯 RESUMO

**NÃO É ASSIM (Errado - Storage não funciona como tabela):**
```
❌ Candidato | Doc1 | Doc2 | Doc3 | Doc4 | ...
   João     | PDF  | PDF  | PDF  | PDF  |
   Maria    | PDF  | PDF  | PDF  | PDF  |
```

**É ASSIM (Correto):**

1. **TABELA CANDIDATES** = Dados do candidato
2. **TABELA CANDIDATE_DOCUMENTS** = Registra qual documento pertence a qual candidato
3. **STORAGE** = Armazena os arquivos físicos (PDFs, imagens, etc)

**A tabela CANDIDATE_DOCUMENTS faz a ponte entre o candidato e seus arquivos no Storage!**

---

## 📝 TIPOS DE DOCUMENTOS CONFIGURADOS

| Código              | Nome                    | Obrigatório | Ordem |
|---------------------|-------------------------|-------------|-------|
| form_enderecos      | Formulário de Endereços | ✅ Sim      | 1     |
| contract_recorrente | Contrato Recorrente     | ✅ Sim      | 2     |
| proof_of_address    | Comprovante de Endereço | ✅ Sim      | 3     |
| right_to_work       | Direito ao Trabalho     | ✅ Sim      | 4     |
| caf_certificate     | Certificado CAF         | ✅ Sim      | 5     |
| driver_license      | Carteira de Motorista   | ✅ Sim      | 6     |
| vehicle_insurance   | Seguro do Veículo       | ❌ Não      | 7     |
| vehicle_mot         | MOT do Veículo          | ❌ Não      | 8     |
| bank_statement      | Extrato Bancário        | ❌ Não      | 9     |
| national_insurance  | National Insurance      | ✅ Sim      | 10    |
| passport            | Passaporte              | ❌ Não      | 11    |
| visa                | Visto                   | ❌ Não      | 12    |
| profile_photo       | Foto de Perfil          | ❌ Não      | 13    |

---

## 🔧 CONFIGURAÇÃO DO BUCKET NO SUPABASE

### Criar o Bucket:
```sql
-- No Supabase Dashboard: Storage > Create Bucket
-- Nome: form-documents
-- Public: false (privado)
```

### Políticas de Segurança (RLS):
```sql
-- Permitir upload para usuários autenticados
CREATE POLICY "Usuários podem fazer upload de documentos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'form-documents');

-- Permitir visualização apenas do próprio documento
CREATE POLICY "Usuários podem ver seus próprios documentos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'form-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Admin pode ver tudo
CREATE POLICY "Admin pode ver todos documentos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'form-documents' AND auth.jwt() ->> 'role' = 'admin');
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Criar tabela `candidates`
- [ ] Criar tabela `document_types`
- [ ] Criar tabela `candidate_documents`
- [ ] Inserir tipos de documentos
- [ ] Criar view `candidate_documents_view`
- [ ] Criar função `get_candidate_documents()`
- [ ] Criar bucket `form-documents` no Storage
- [ ] Configurar políticas de segurança (RLS)
- [ ] Testar upload de documento
- [ ] Testar consulta de documentos por candidato
