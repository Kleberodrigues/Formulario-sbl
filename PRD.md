# 📋 PRD - SBL Onboarding Form

**Versão**: 2.0 (Atualizado com estrutura real)
**Data**: Novembro 2025
**Status**: Em Desenvolvimento
**Cliente**: Silva Brothers Logistics LTD
**Desenvolvedor**: SinergIA (Kleber)

---

## 1. Objetivo

Criar um formulário multi-etapa (onboarding) completo para Silva Brothers Logistics LTD que:
- Implemente **12 steps progressivos** conforme design atual (sbl.zeritycloud.com/onboarding)
- Salve cada step automaticamente no Supabase
- Permita upload de documentos e fotos
- Rastreie usuários que abandonam o processo
- Dispare follow-up automático via n8n (email/WhatsApp)
- Esteja em conformidade com GDPR/DPA

---

## 2. Fluxo Completo do Formulário (12 Steps)

### **Step 1: Welcome / Language Selection** ✅ IMPLEMENTADO
**URL**: `/onboarding`

**Campos**:
- Seletor de idioma (dropdown)
  - Português (pt-BR)
  - English (en)
  - Български (bg)
  - Română (ro)
- Link para privacy policy
- Botão "Continuar"

**Validações**:
- Idioma selecionado (obrigatório)

**Salva no Supabase**:
- `language`

---

### **Step 2: Depot Selection** 🆕 A IMPLEMENTAR
**URL**: `/onboarding/depot`

**Campos**:
- Mapa interativo (Mapbox) mostrando todos os depósitos
- Dropdown: "Onde você gostaria de se candidatar?"
- Lista de depósitos com códigos (ex: "DSO2 (Southampton - SO40 9LR)")

**Validações**:
- Depósito selecionado (obrigatório)

**Salva no Supabase**:
- `selected_depot`
- `depot_code`

**Integração**:
- Mapbox GL JS para mapa interativo
- Pins clicáveis nos depósitos

---

### **Step 3: Contact Information** ✅ IMPLEMENTADO
**URL**: `/onboarding/contact`

**Campos**:
- Nome completo (text)
- Email (email)
- Telefone (tel, formato internacional)

**Validações**:
- Nome: mínimo 3 caracteres, 2 palavras
- Email: formato válido
- Telefone: mínimo 10 dígitos

**Salva no Supabase**:
- `full_name`
- `email` (unique key)
- `phone`

**Nota**: Email é usado como identificador único e para acesso à plataforma

---

### **Step 4: Chat Message** 🆕 A IMPLEMENTAR
**URL**: `/onboarding/chat`

**Campos**:
- Área de chat (readonly)
- Mensagem bot: "Apenas uma mensagem de teste"
- Input de mensagem (textarea)
- Botão "Send"
- Link: "Back to dashboard"

**Validações**:
- Mensagem não vazia
- Máximo 500 caracteres

**Salva no Supabase**:
- `messages` (JSONB array com timestamp e conteúdo)

**Funcionalidades**:
- Histórico de mensagens salvo
- Timestamp de cada mensagem

---

### **Step 5: Personal Information** 🆕 A IMPLEMENTAR
**URL**: `/onboarding/personal-information`

**Campos**:
- Nome completo (text) - preenchido automaticamente
- Data de nascimento (date)
- Cidade de nascimento (text)
- Nome da mãe (text)
- Sobrenome da mãe (text)
- Próximo de Kin - nome completo (text)
- Próximo de Kin - relacionamento (select: Casado, Solteiro, etc)
- Número de telefone celular (tel)

**Validações**:
- Data de nascimento: idade mínima 18 anos
- Todos os campos obrigatórios
- Telefone: formato internacional

**Salva no Supabase**:
- `birth_date`
- `birth_city`
- `mother_name`
- `mother_surname`
- `next_of_kin_name`
- `next_of_kin_relationship`
- `next_of_kin_phone`

**Tooltip**: "Why do we need this information?" - explicação de KYC/compliance

---

### **Step 6: Address History** 🆕 A IMPLEMENTAR
**URL**: `/onboarding/address`

**Campos**:
- Forneça 7 anos de histórico de endereços
- País (select - United Kingdom padrão)
- Linha de Endereço 1 (text)
- Linha de Endereço 2 (text, opcional)
- Cidade (text)
- Código Postal (text)
- Há quanto tempo você mora neste endereço? (text)
- Quando você se mudou para este endereço? (date)
- Botão "Adicionar Endereço"

**Validações**:
- Total de 7 anos de histórico requerido
- Código postal UK: formato válido
- Datas não podem ser futuras
- Períodos não podem se sobrepor

**Salva no Supabase**:
- `address_history` (JSONB array)
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

**Funcionalidades**:
- Lista de endereços adicionados
- Editar/remover endereços
- Validação automática de 7 anos completos

---

### **Step 7: Additional Information** 🆕 A IMPLEMENTAR
**URL**: `/onboarding/additional-information`

**Campos**:
- National Insurance Number (text)
  - Formato: BH 123123 G
  - Placeholder: "BH 123123 G"
- Your UTR Number (text, opcional)
  - Aviso: "Você precisará fornecer seu número UTR ou inscrição dentro de 4 semanas"
- Employment Status (radio buttons):
  - "I am a sole trader (self-employed)"
  - "I have my own limited company (self-employed)"
- Your VAT Number (text, opcional)
  - "Leave blank if not registered"

**Validações**:
- NI Number: formato UK válido (XX 999999 X)
- UTR Number: 10 dígitos (se fornecido)
- VAT Number: formato UK válido (se fornecido)
- Employment status: obrigatório

**Salva no Supabase**:
- `national_insurance_number`
- `utr_number`
- `employment_status`
- `vat_number`

**Tooltip**: "Why do we need this information?" - explicação de compliance fiscal

---

### **Step 8: Profile Photo Selfie** 🆕 A IMPLEMENTAR
**URL**: `/onboarding/badge-photo`

**Campos**:
- Área de drag & drop para upload
- Botão "Browse files"
- Opção "Camera" para captura direta
- Exemplos visuais de fotos aprovadas (✅) vs rejeitadas (❌)

**Validações**:
- Formato: JPG, PNG
- Tamanho máximo: 5MB
- Resolução mínima: 800x800px
- Rosto visível e centrado (detecção facial básica)

**Salva no Supabase**:
- `profile_photo_url` (URL do Supabase Storage)
- `profile_photo_uploaded_at`

**Funcionalidades**:
- Preview da imagem antes de upload
- Upload direto para Supabase Storage
- Feedback visual de progresso

**Guia de Qualidade**:
- ✅ Foto frontal, rosto visível, fundo neutro
- ❌ Foto de lado, rosto coberto, fundo complexo

---

### **Step 9: Driving Licence Details** 🆕 A IMPLEMENTAR
**URL**: `/onboarding/driving-licence`

**Campos**:
- Upload de carteira de motorista (frente e verso)
- Instruções detalhadas:
  - "Frente primeiro (com sua foto)"
  - "Verso ao lado (com categorias)"
  - "Certifique-se de que todo o texto esteja legível e que a imagem não esteja desfocada"
- Área de drag & drop para upload
- Botão "Arrastesolte arquivos para fazer upload"

**Validações**:
- Formato: JPG, PNG, PDF
- Tamanho máximo: 10MB por arquivo
- 2 arquivos obrigatórios (frente + verso)
- Texto legível (validação básica de qualidade)

**Salva no Supabase**:
- `driving_licence_front_url`
- `driving_licence_back_url`
- `driving_licence_uploaded_at`

**Funcionalidades**:
- Preview de ambas as imagens
- Zoom para verificar qualidade
- Feedback de qualidade de imagem

---

### **Step 10: Bank Details** 🆕 A IMPLEMENTAR
**URL**: `/onboarding/bank-details`

**Campos**:
- Account Number (text, 8 dígitos)
- Sort Code (text, formato: XX-XX-XX)
- Payment Declaration (texto legal readonly)
  - "I declare that any and all payments received for the self-employed services I provide to Silva Brothers Logistics LTD will be a gross payment and I understand and acknowledge that I am personally liable in respect of any and all payments due for income tax and national insurance."
- Checkbox obrigatório: "By clicking submit button I agree to the terms and conditions"

**Validações**:
- Account Number: exatamente 8 dígitos
- Sort Code: formato XX-XX-XX (6 dígitos)
- Checkbox marcado (obrigatório)

**Salva no Supabase**:
- `bank_account_number` (encrypted)
- `bank_sort_code` (encrypted)
- `payment_declaration_accepted`
- `payment_declaration_accepted_at`

**Segurança**:
- Dados bancários criptografados no Supabase
- HTTPS obrigatório
- Validação de Modulus 11 para Sort Code (opcional)

---

### **Step 11: Document Guide** 🆕 A IMPLEMENTAR
**URL**: `/onboarding/document-guide`

**Conteúdo**:
- Informações sobre GDPR/DPA
- Texto: "Todos as suas informações pessoais são protegidas pelo Regulamento Geral de Proteção de Dados (RGPD). Seus dados serão usados de acordo com a Lei de Proteção de Dados e as informações não serão divulgadas aos principais com sua inscrição."
- Instruções de upload de documentos:
  - "Tire a imagem com boa iluminação e evite flashs no fundo"
  - "Todos os detalhes devem estar no quadro"
  - "Imagens borradas ou cortadas não serão aceitas"
- Exemplos visuais:
  - ✅ **Approved**: Documento claro, bem iluminado, todos os detalhes visíveis
  - ❌ **Rejected**: Documento borrado, parcialmente visível, flash/sombras

**Funcionalidade**:
- Botão "Salvar e Continuar"
- Não salva dados (apenas informativo)

---

### **Step 12: Documents Upload** 🆕 A IMPLEMENTAR (FINAL)
**URL**: `/onboarding/documents`

**Campos**:
- Lista de documentos obrigatórios/opcionais:

1. **Direito ao Trabalho** (Obrigatório)
   - Status: "Obrigatório" badge
   - Botão: "Carregar agora"

2. **Comprovante de endereço** (Obrigatório)
   - Status: "Obrigatório" badge
   - Botão: "Carregar agora"

3. **Seguro Nacional** (Obrigatório)
   - Status: "Obrigatório" badge
   - Botão: "Carregar agora"

4. **Extrato bancário** (Obrigatório)
   - Status: "Obrigatório" badge
   - Botão: "Carregar agora"

5. **Certificado de IVA** (Obrigatório)
   - Status: "Obrigatório" badge
   - Botão: "Carregar agora"

6. **Carta de Condução** (Obrigatório)
   - Status: "Pendente" (já enviado no Step 9)

**Validações**:
- Todos os documentos obrigatórios devem ser enviados
- Formato: JPG, PNG, PDF
- Tamanho máximo: 10MB por arquivo
- Qualidade mínima de imagem

**Salva no Supabase**:
- `documents` (JSONB)
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

**Funcionalidades**:
- Upload individual por documento
- Preview de documentos enviados
- Botão "Carregar aqui" para reenviar/substituir
- Barra de progresso total: "Faltam apenas alguns passos para concluir sua inscrição"
- Contador: "X de 5 documentos enviados"

**Conclusão**:
- Após todos os uploads: `is_completed = true`
- Timestamp: `completed_at`
- Enviar confirmação por email
- Redirecionar para página de sucesso

---

## 3. Requisitos Não-Funcionais

### 3.1 - Design & UX
- Design clonado do sbl.zeritycloud.com/onboarding
- Cores: Teal/turquesa #17A798
- Responsive design (mobile-first)
- Loading states para operações assíncronas
- Mensagens de erro amigáveis em 4 idiomas
- Botão "Back to dashboard" em cada página

### 3.2 - Performance
- Salvamento assíncrono não-bloqueante
- Lazy loading de componentes pesados (Mapbox, FileUpload)
- Otimização de queries Supabase
- Cache de dados do usuário no localStorage
- Upload de arquivos com progress bar

### 3.3 - Segurança
- RLS (Row Level Security) no Supabase
- Email único como identificador
- Dados bancários criptografados (AES-256)
- Upload de arquivos validado por tipo MIME
- Sanitização de inputs
- Rate limiting (prevenir spam)
- HTTPS obrigatório

### 3.4 - GDPR/DPA Compliance
- Privacy policy visível no Step 1
- Consent explícito para processamento de dados
- Right to access/delete personal data
- Data retention policy
- Secure file storage com acesso controlado

### 3.5 - Rastreamento & Analytics
- Capturar user agent
- Registrar IP (anonymizado para GDPR)
- UTM parameters (source, medium, campaign)
- Timeline completa de eventos
- Tracking de abandono por step

---

## 4. Schema Supabase (Atualizado)

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
  bank_account_number TEXT, -- encrypted
  bank_sort_code TEXT, -- encrypted
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
  ip_address VARCHAR(45),
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

-- Trigger para atualizar updated_at
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

  -- Dados do usuário
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  full_name VARCHAR(255),

  -- Abandono
  abandoned_at_step INT,
  reason VARCHAR(255),

  -- Follow-up
  followup_sent BOOLEAN DEFAULT FALSE,
  followup_sent_at TIMESTAMP,
  followup_type VARCHAR(50), -- 'email' ou 'whatsapp'

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_form_abandonments_email ON form_abandonments(email);
CREATE INDEX idx_form_abandonments_followup_sent ON form_abandonments(followup_sent);
```

### Supabase Storage Buckets

```sql
-- Bucket para uploads de documentos
INSERT INTO storage.buckets (id, name, public)
VALUES ('form-documents', 'form-documents', false);

-- Políticas RLS para storage
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'form-documents');

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'form-documents');
```

---

## 5. Integrações

### 5.1 - Supabase
- **Operação**: CRUD de formulários + Storage de arquivos
- **Tabelas**: form_submissions, form_abandonments
- **Storage**: Bucket 'form-documents' para uploads
- **Auth**: RLS policy por email

### 5.2 - Mapbox
- **Operação**: Exibir mapa interativo com depósitos
- **API**: Mapbox GL JS
- **Dados**: Coordenadas (lat, lng) dos depósitos SBL

### 5.3 - n8n
- **Webhook**: POST /webhook/form-abandonment
- **Payload**: email, step, timestamp, formData
- **Ações**: Email + WhatsApp follow-up

---

## 6. MVP vs Fases Futuras

### MVP (v1.0) - Prioridade ALTA
- ✅ Steps 1-3 funcionando (Welcome, Depot, Contact)
- ✅ Salvamento Supabase básico
- ✅ Validações essenciais
- ⏳ Steps 4-12 (implementação progressiva)
- ⏳ Upload de arquivos funcional
- ⏳ Detecção de abandono
- ⏳ Webhook básico para n8n

### Fase 2 (v1.1) - Melhorias
- OCR básico para validação de documentos
- Detecção facial para profile photo
- Validação automática de NI Number/UTR via API
- Dashboard administrativo para revisar submissions
- Analytics detalhado de abandono
- A/B testing de steps

### Fase 3 (v1.2) - Otimizações
- Dark mode
- Offline support (PWA)
- Multi-step navigation avançada
- Auto-save a cada 30 segundos
- Compression de imagens antes de upload

---

## 7. Métricas de Sucesso

- **Taxa de conclusão**: > 60% (12 steps é longo)
- **Tempo médio de preenchimento**: < 15 min
- **Taxa de abandono por step**: < 10% por step
- **Taxa de follow-up de abandono**: > 80%
- **Re-engajamento pós-follow-up**: > 15%
- **Uploads com qualidade aceitável**: > 95%

---

## 8. Timeline Atualizado

| Fase | Tarefa | Prazo |
|------|--------|-------|
| Setup | Configurar Supabase + Storage + n8n | 1 dia |
| Docs | Atualizar PRD, CLAUDE.md, constants | 0.5 dia |
| Infra | Validadores + Translations + Components | 1 dia |
| Dev | Steps 1-3 (já feitos) | ✅ |
| Dev | Steps 4-6 | 3 dias |
| Dev | Steps 7-9 | 3 dias |
| Dev | Steps 10-12 | 3 dias |
| Integração | Mapbox + Uploads + Follow-up | 2 dias |
| QA | Testes + Deploy | 2 dias |
| **Total** | | **15-18 dias** |

---

## 9. Riscos & Mitigação

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Falha Supabase Storage | Alto | Implementar retry logic + fallback para local storage temporário |
| Upload de arquivos muito grandes | Médio | Implementar compressão de imagens no client-side |
| Mapbox API custos | Médio | Cachear mapa, limitar zoom/pan |
| Validação de NI Number complexa | Baixo | Validar formato básico, revisão manual admin |
| 12 steps = alta taxa de abandono | Alto | Follow-up automático agressivo, permitir salvar e retomar |
| GDPR compliance issues | Alto | Auditoria legal, implement right to delete/access |

---

## 10. Definições de Pronto

- [ ] Todos os 12 steps implementados e funcionais
- [ ] Código revisado e testado (manual + E2E)
- [ ] Sem console errors/warnings
- [ ] Responsivo em mobile/tablet/desktop
- [ ] Performance: < 3s para salvar cada step
- [ ] Upload de arquivos < 10s para 5MB
- [ ] Todos os idiomas funcionando (4 idiomas)
- [ ] Follow-up automático testado
- [ ] GDPR compliance verificado
- [ ] Documentação atualizada (README + API docs)

---

**Última atualização**: 2025-11-08 (Estrutura real com 12 steps descoberta)
