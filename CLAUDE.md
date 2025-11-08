# 🎯 SBL Onboarding Form - Documentação Claude

## Contexto do Projeto

**Nome**: Silva Brothers Logistics LTD - Onboarding Form
**Objetivo**: Criar um formulário multi-etapa (12 steps) com salvamento automático no Supabase, upload de documentos, e follow-up de abandono via n8n.

**Escopo**: Implementar formulário completo conforme `sbl.zeritycloud.com/onboarding` com:
- 12 steps progressivos
- Upload de fotos e documentos
- Integração Mapbox para seleção de depósitos
- Compliance GDPR/DPA
- Sistema de abandono e follow-up automático

---

## 📁 Estrutura do Projeto

```
Formulario-SBL/
├── public/
│   └── assets/
│       ├── logo.jpg              # Logo SBL (versão 1)
│       ├── logo2.png             # Logo SBL (versão 2)
│       └── .gitkeep
├── src/
│   ├── config/
│   │   ├── supabase.js           # Configuração Supabase + Storage
│   │   └── constants.js          # 12 STEPS + constantes
│   ├── components/
│   │   ├── FormStep.js           # Componente base de step
│   │   ├── Header.js             # Header com logo
│   │   ├── LanguageSelector.js   # Seletor 4 idiomas
│   │   ├── ProgressBar.js        # Barra progresso (12 steps)
│   │   ├── FileUpload.js         # Upload drag & drop
│   │   ├── ImagePreview.js       # Preview de imagens
│   │   ├── DocumentStatus.js     # Badge de status
│   │   ├── AddressHistoryList.js # Lista de endereços
│   │   └── MapboxDepotSelector.js # Mapa interativo
│   ├── pages/
│   │   ├── WelcomePage.js        # Step 1: Language
│   │   ├── DepotPage.js          # Step 2: Depot + Mapbox
│   │   ├── ContactPage.js        # Step 3: Nome/Email/Tel
│   │   ├── ChatPage.js           # Step 4: Chat teste
│   │   ├── PersonalInfoPage.js   # Step 5: Info pessoal
│   │   ├── AddressHistoryPage.js # Step 6: 7 anos endereços
│   │   ├── AdditionalInfoPage.js # Step 7: NI/UTR/VAT
│   │   ├── ProfilePhotoPage.js   # Step 8: Selfie upload
│   │   ├── DrivingLicencePage.js # Step 9: CNH frente/verso
│   │   ├── BankDetailsPage.js    # Step 10: Dados bancários
│   │   ├── DocumentGuidePage.js  # Step 11: Guia GDPR
│   │   └── DocumentsUploadPage.js # Step 12: 5 documentos
│   ├── services/
│   │   ├── supabaseService.js    # CRUD + Storage
│   │   └── automationService.js  # n8n webhooks
│   ├── utils/
│   │   ├── validators.js         # Validações (NI, UTR, VAT, etc)
│   │   ├── translations.js       # i18n (4 idiomas)
│   │   └── helpers.js            # Funções auxiliares
│   ├── styles/
│   │   ├── global.css            # Estilos globais
│   │   ├── components.css        # Componentes
│   │   └── responsive.css        # Media queries
│   ├── main.js                   # Roteador 12 steps
│   └── index.html               # HTML principal
├── .env.example                  # Template env vars
├── .gitignore
├── package.json
├── vite.config.js
├── PRD.md                        # Requisitos detalhados
├── CLAUDE.md                     # Este arquivo
└── INSTRUCOES.md                 # Setup e execução
```

---

## 🎨 Design e Cores

- **Primária**: Teal/Turquesa `#17A798`
- **Primária Hover**: `#148882`
- **Secundária**: Branco `#FFFFFF`
- **Texto**: Cinza escuro `#333333`
- **Texto Claro**: `#666666`
- **Inputs**: Cinza claro `#F5F5F5`
- **Borda**: `#DDDDDD`
- **Erro**: `#E74C3C`
- **Sucesso**: `#27AE60`

---

## 📊 Fluxo Completo (12 Steps)

### **Step 1: Welcome / Language Selection** ✅ IMPLEMENTADO
**URL**: `/onboarding`
**Componente**: `WelcomePage.js`

**Campos**:
- Dropdown de idioma (pt-BR, en, bg, ro)
- Link privacy policy
- Botão "Continuar"

**Salva**: `language`

---

### **Step 2: Depot Selection** 🆕
**URL**: `/onboarding/depot`
**Componente**: `DepotPage.js`

**Campos**:
- Mapa Mapbox com pins de depósitos
- Dropdown: "Onde você gostaria de se candidatar?"
- Lista com códigos (ex: "DSO2 (Southampton - SO40 9LR)")

**Salva**: `selected_depot`, `depot_code`

**Integração**: Mapbox GL JS

---

### **Step 3: Contact Information** ✅ IMPLEMENTADO
**URL**: `/onboarding/contact`
**Componente**: `ContactPage.js`

**Campos**:
- Nome completo
- Email (unique, será usado para acesso)
- Telefone (formato internacional)

**Validações**:
- Nome: mín 3 chars, 2 palavras
- Email: formato válido
- Telefone: mín 10 dígitos

**Salva**: `full_name`, `email`, `phone`

---

### **Step 4: Chat Message** 🆕
**URL**: `/onboarding/chat`
**Componente**: `ChatPage.js`

**Campos**:
- Área de chat (readonly)
- Bot: "Apenas uma mensagem de teste"
- Input mensagem (textarea)
- Botão "Send"
- Link "Back to dashboard"

**Validações**:
- Não vazio, máx 500 chars

**Salva**: `messages` (JSONB array)
```json
[{
  "content": "Texto da mensagem",
  "timestamp": "2025-11-08T10:00:00Z",
  "sender": "user"
}]
```

---

### **Step 5: Personal Information** 🆕
**URL**: `/onboarding/personal-information`
**Componente**: `PersonalInfoPage.js`

**Campos**:
- Nome completo (preenchido auto)
- Data de nascimento (date)
- Cidade de nascimento (text)
- Nome da mãe (text)
- Sobrenome da mãe (text)
- Next of Kin - nome completo (text)
- Next of Kin - relacionamento (select)
- Telefone celular Next of Kin (tel)

**Validações**:
- Idade mínima: 18 anos
- Todos obrigatórios

**Salva**: `birth_date`, `birth_city`, `mother_name`, `mother_surname`, `next_of_kin_name`, `next_of_kin_relationship`, `next_of_kin_phone`

**Tooltip**: "Why do we need this information?" (KYC/compliance)

---

### **Step 6: Address History** 🆕
**URL**: `/onboarding/address`
**Componente**: `AddressHistoryPage.js`

**Campos**:
- "Forneça 7 anos de histórico de endereços"
- País (select, UK default)
- Linha 1 (text)
- Linha 2 (text, opcional)
- Cidade (text)
- Código Postal (text)
- Há quanto tempo mora? (text)
- Data de mudança (date)
- Botão "Adicionar Endereço"

**Validações**:
- Total 7 anos completos
- UK Postcode válido
- Datas não futuras
- Sem sobreposição de períodos

**Salva**: `address_history` (JSONB array)
```json
[{
  "country": "United Kingdom",
  "address_line_1": "123 Main St",
  "address_line_2": "Apt 4",
  "city": "London",
  "postal_code": "SW1A 1AA",
  "duration": "2 years",
  "move_in_date": "2023-01-15"
}]
```

---

### **Step 7: Additional Information** 🆕
**URL**: `/onboarding/additional-information`
**Componente**: `AdditionalInfoPage.js`

**Campos**:
- National Insurance Number (text)
  - Formato: `BH 123123 G`
- UTR Number (text, opcional)
  - Aviso: "Fornecer dentro de 4 semanas"
- Employment Status (radio):
  - "Sole trader (self-employed)"
  - "Limited company (self-employed)"
- VAT Number (text, opcional)

**Validações**:
- NI: formato UK `XX 999999 X`
- UTR: 10 dígitos (se fornecido)
- VAT: formato UK (se fornecido)
- Employment: obrigatório

**Salva**: `national_insurance_number`, `utr_number`, `employment_status`, `vat_number`

---

### **Step 8: Profile Photo Selfie** 🆕
**URL**: `/onboarding/badge-photo`
**Componente**: `ProfilePhotoPage.js`

**Campos**:
- Drag & drop upload
- Botão "Browse files"
- Botão "Camera" (captura direta)
- Guia visual (✅ approved / ❌ rejected)

**Validações**:
- Formato: JPG, PNG
- Máx 5MB
- Resolução mín: 800x800px

**Salva**: `profile_photo_url`, `profile_photo_uploaded_at`

**Storage**: Supabase Storage bucket `form-documents`

---

### **Step 9: Driving Licence Details** 🆕
**URL**: `/onboarding/driving-licence`
**Componente**: `DrivingLicencePage.js`

**Campos**:
- Upload CNH frente (com foto)
- Upload CNH verso (com categorias)
- Instruções: "Texto legível, não borrado"
- Drag & drop

**Validações**:
- Formato: JPG, PNG, PDF
- Máx 10MB cada
- 2 arquivos obrigatórios

**Salva**: `driving_licence_front_url`, `driving_licence_back_url`, `driving_licence_uploaded_at`

---

### **Step 10: Bank Details** 🆕
**URL**: `/onboarding/bank-details`
**Componente**: `BankDetailsPage.js`

**Campos**:
- Account Number (8 dígitos)
- Sort Code (XX-XX-XX)
- Payment Declaration (texto readonly)
- Checkbox obrigatório de termos

**Validações**:
- Account: exato 8 dígitos
- Sort Code: formato XX-XX-XX
- Checkbox marcado

**Salva**: `bank_account_number` (encrypted), `bank_sort_code` (encrypted), `payment_declaration_accepted`, `payment_declaration_accepted_at`

**Segurança**: Criptografia AES-256, HTTPS obrigatório

---

### **Step 11: Document Guide** 🆕
**URL**: `/onboarding/document-guide`
**Componente**: `DocumentGuidePage.js`

**Conteúdo**:
- GDPR/DPA compliance info
- Instruções de qualidade de foto
- Exemplos visuais (✅ approved / ❌ rejected)
- Botão "Salvar e Continuar"

**Não salva dados** (apenas informativo)

---

### **Step 12: Documents Upload** 🆕 (FINAL)
**URL**: `/onboarding/documents`
**Componente**: `DocumentsUploadPage.js`

**Documentos Obrigatórios**:
1. Direito ao Trabalho
2. Comprovante de endereço
3. Seguro Nacional
4. Extrato bancário
5. Certificado de IVA
6. Carta de Condução (já enviada no Step 9, status "Pendente")

**Validações**:
- Todos obrigatórios
- Formato: JPG, PNG, PDF
- Máx 10MB cada

**Salva**: `documents` (JSONB)
```json
{
  "right_to_work": {
    "url": "https://...",
    "uploaded_at": "2025-11-08T10:00:00Z",
    "status": "uploaded"
  },
  "proof_of_address": {...},
  "national_insurance": {...},
  "bank_statement": {...},
  "vat_certificate": {...}
}
```

**Conclusão**:
- Após todos uploads: `is_completed = true`, `completed_at = NOW()`
- Email confirmação
- Redirect para página sucesso

---

## 🗄️ Schema Supabase (Completo)

### Tabela: `form_submissions`

```sql
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificação
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),

  -- Step 1: Welcome
  language VARCHAR(10) DEFAULT 'pt-BR',

  -- Step 2: Depot
  selected_depot VARCHAR(255),
  depot_code VARCHAR(50),

  -- Step 3: Contact
  full_name VARCHAR(255),

  -- Step 4: Chat
  messages JSONB DEFAULT '[]'::jsonb,

  -- Step 5: Personal Information
  birth_date DATE,
  birth_city VARCHAR(100),
  mother_name VARCHAR(100),
  mother_surname VARCHAR(100),
  next_of_kin_name VARCHAR(255),
  next_of_kin_relationship VARCHAR(50),
  next_of_kin_phone VARCHAR(20),

  -- Step 6: Address History
  address_history JSONB DEFAULT '[]'::jsonb,

  -- Step 7: Additional Information
  national_insurance_number VARCHAR(20),
  utr_number VARCHAR(20),
  employment_status VARCHAR(100),
  vat_number VARCHAR(20),

  -- Step 8: Profile Photo
  profile_photo_url TEXT,
  profile_photo_uploaded_at TIMESTAMP,

  -- Step 9: Driving Licence
  driving_licence_front_url TEXT,
  driving_licence_back_url TEXT,
  driving_licence_uploaded_at TIMESTAMP,

  -- Step 10: Bank Details
  bank_account_number TEXT, -- encrypted AES-256
  bank_sort_code TEXT, -- encrypted AES-256
  payment_declaration_accepted BOOLEAN DEFAULT FALSE,
  payment_declaration_accepted_at TIMESTAMP,

  -- Step 12: Documents
  documents JSONB DEFAULT '{}'::jsonb,

  -- Progresso
  current_step INT DEFAULT 1,
  completed_steps INT[] DEFAULT ARRAY[],

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  abandoned_at TIMESTAMP,

  -- Rastreamento
  is_completed BOOLEAN DEFAULT FALSE,
  is_abandoned BOOLEAN DEFAULT FALSE,
  last_activity TIMESTAMP DEFAULT NOW(),

  -- Metadados
  user_agent TEXT,
  ip_address VARCHAR(45), -- anonymized for GDPR
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255)
);

-- Índices
CREATE INDEX idx_form_submissions_email ON form_submissions(email);
CREATE INDEX idx_form_submissions_created_at ON form_submissions(created_at);
CREATE INDEX idx_form_submissions_is_abandoned ON form_submissions(is_abandoned);
CREATE INDEX idx_form_submissions_current_step ON form_submissions(current_step);
CREATE INDEX idx_form_submissions_is_completed ON form_submissions(is_completed);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_form_submissions_updated_at
  BEFORE UPDATE ON form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Tabela: `form_abandonments`

```sql
CREATE TABLE form_abandonments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES form_submissions(id) ON DELETE CASCADE,

  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  full_name VARCHAR(255),

  abandoned_at_step INT,
  reason VARCHAR(255),

  followup_sent BOOLEAN DEFAULT FALSE,
  followup_sent_at TIMESTAMP,
  followup_type VARCHAR(50), -- 'email' ou 'whatsapp'

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_form_abandonments_email ON form_abandonments(email);
CREATE INDEX idx_form_abandonments_followup_sent ON form_abandonments(followup_sent);
```

### Supabase Storage

```sql
-- Criar bucket para documentos
INSERT INTO storage.buckets (id, name, public)
VALUES ('form-documents', 'form-documents', false);

-- RLS Policies
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'form-documents');

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'form-documents');

CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'form-documents');
```

---

## 🔌 Integração Supabase

### Credenciais (.env)

```env
VITE_SUPABASE_URL=https://seu-project.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
VITE_N8N_WEBHOOK_URL=https://seu-n8n.com/webhook/form-abandonment
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1...
```

### Funções Principais (supabaseService.js)

```javascript
// CRUD
await upsertFormSubmission(email, formData)
await getFormProgress(email)
await saveFormStep(email, stepNumber, stepData)

// Upload
await uploadFile(file, path)
await getFileUrl(path)

// Abandono
await markFormAsAbandoned(email, step)
await markFormAsCompleted(email)
```

---

## 🤖 Automação n8n (Follow-up)

### Webhook Payload

```json
{
  "email": "user@example.com",
  "abandonedAtStep": 6,
  "timestamp": "2025-11-08T10:00:00Z",
  "returnUrl": "https://sbl.zeritycloud.com/onboarding?resume=user@example.com",
  "formData": {
    "full_name": "João Silva",
    "phone": "+44 123 456 789"
  }
}
```

### Ações n8n

1. Receber webhook
2. Consultar dados no Supabase
3. Enviar email personalizado:
   - Assunto: "Você deixou seu formulário pela metade"
   - Conteúdo: Mencionar step atual
   - CTA: Link para retomar
4. Enviar WhatsApp (se phone disponível):
   - "Oi [Nome], você estava na Etapa X"
   - Link para retomar
5. Marcar followup como enviado

---

## 🎨 Mapbox Integration

### Configuração

```javascript
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-1.4, 51.1], // UK center
  zoom: 6
})
```

### Depósitos (exemplo)

```javascript
const depots = [
  {
    code: 'DSO2',
    name: 'Southampton',
    postcode: 'SO40 9LR',
    coordinates: [-1.404, 50.909]
  },
  {
    code: 'DLO1',
    name: 'London',
    postcode: 'E14 5AB',
    coordinates: [-0.021, 51.505]
  }
  // ... outros depósitos
]
```

---

## ⚠️ Regras de Código

### ✅ FAZER

- Validar TODOS os inputs antes de salvar
- Usar try/catch para operações Supabase
- Salvar cada step independentemente
- Criptografar dados bancários
- Adicionar timestamps para rastreamento
- Comentar em português
- Usar variáveis de ambiente para credenciais
- Implementar loading states
- Sanitizar inputs
- Validar tipo MIME de uploads

### ❌ NÃO FAZER

- Mudar estrutura de pastas sem discutir
- Misturar lógica de componentes
- Salvar dados sensíveis sem criptografia
- Fazer chamadas síncronas bloqueantes
- Adicionar dependências sem discutir
- Expor chaves de API no código
- Salvar documentos em base64 (usar Storage)
- Ignorar validações GDPR

---

## 🧪 Testes e Validação

### Checklist por Step

**Step 1**:
- [ ] 4 idiomas funcionando
- [ ] Idioma salvo no Supabase

**Step 2**:
- [ ] Mapa carrega corretamente
- [ ] Pins clicáveis
- [ ] Dropdown sincronizado

**Step 3**:
- [ ] Validações de email/telefone
- [ ] Dados salvos no Supabase

**Step 4**:
- [ ] Chat funcional
- [ ] Mensagens em JSONB

**Step 5**:
- [ ] Validação de idade (18+)
- [ ] Todos campos salvos

**Step 6**:
- [ ] Validação de 7 anos completos
- [ ] UK Postcode válido
- [ ] Lista de endereços

**Step 7**:
- [ ] Validação NI Number formato UK
- [ ] Employment status salvo

**Step 8**:
- [ ] Upload funciona
- [ ] Preview de imagem
- [ ] URL no Storage

**Step 9**:
- [ ] 2 uploads (frente + verso)
- [ ] URLs salvos

**Step 10**:
- [ ] Validação Sort Code
- [ ] Dados criptografados
- [ ] Checkbox obrigatório

**Step 11**:
- [ ] Conteúdo GDPR visível
- [ ] Botão funciona

**Step 12**:
- [ ] 5 uploads obrigatórios
- [ ] Progress bar atualiza
- [ ] Conclusão marca is_completed

---

## 📦 Dependências

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "mapbox-gl": "^3.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

---

## 📞 Contato

**Projeto**: SBL Onboarding Form
**Dev**: SinergIA (Kleber)
**Cliente**: Silva Brothers Logistics LTD

---

**Última atualização**: 2025-11-08 (Estrutura real de 12 steps descoberta via screenshots)
