-- ====================================
-- SBL Onboarding Form - Migrations
-- ====================================
-- Execute estes scripts no Supabase SQL Editor
-- Acesse: https://app.supabase.com > SQL Editor

-- ====================================
-- TABELA: form_submissions
-- ====================================

CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificação
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  
  -- Step 1: Welcome / Language
  language VARCHAR(10) DEFAULT 'pt-BR',

  -- Step 2: Depot Selection
  selected_depot VARCHAR(255),
  depot_code VARCHAR(50),

  -- Step 3: Contact Information
  full_name VARCHAR(255),

  -- Step 4: Chat Message
  messages JSONB DEFAULT '[]'::jsonb,

  -- Step 5: Personal Information
  birth_date DATE,
  birth_city VARCHAR(100),
  mother_name VARCHAR(100),
  mother_surname VARCHAR(100),
  next_of_kin_name VARCHAR(255),
  next_of_kin_relationship VARCHAR(50),
  next_of_kin_phone VARCHAR(20),

  -- Step 6: Address History (7 anos)
  address_history JSONB DEFAULT '[]'::jsonb,

  -- Step 7: Additional Information
  national_insurance_number VARCHAR(20),
  utr_number VARCHAR(20),
  employment_status VARCHAR(100),
  vat_number VARCHAR(20),

  -- Step 8: Profile Photo Selfie
  profile_photo_url TEXT,
  profile_photo_uploaded_at TIMESTAMP WITH TIME ZONE,

  -- Step 9: Driving Licence Details
  driving_licence_front_url TEXT,
  driving_licence_back_url TEXT,
  driving_licence_uploaded_at TIMESTAMP WITH TIME ZONE,

  -- Step 10: Bank Details (encrypted)
  bank_account_number TEXT,
  bank_sort_code TEXT,
  payment_declaration_accepted BOOLEAN DEFAULT FALSE,
  payment_declaration_accepted_at TIMESTAMP WITH TIME ZONE,

  -- Step 11: Document Guide (sem dados salvos)

  -- Step 12: Documents Upload
  documents JSONB DEFAULT '{}'::jsonb,

  -- Progresso
  current_step INT DEFAULT 1,
  completed_steps INT[] DEFAULT ARRAY[]::INT[],
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  abandoned_at TIMESTAMP WITH TIME ZONE,
  
  -- Rastreamento
  is_completed BOOLEAN DEFAULT FALSE,
  is_abandoned BOOLEAN DEFAULT FALSE,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metadados
  user_agent TEXT,
  ip_address VARCHAR(45),
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_form_submissions_email 
  ON form_submissions(email);

CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at 
  ON form_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_form_submissions_is_abandoned 
  ON form_submissions(is_abandoned);

CREATE INDEX IF NOT EXISTS idx_form_submissions_current_step 
  ON form_submissions(current_step);

CREATE INDEX IF NOT EXISTS idx_form_submissions_updated_at 
  ON form_submissions(updated_at DESC);

-- ====================================
-- TABELA: form_abandonments
-- ====================================

CREATE TABLE IF NOT EXISTS form_abandonments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES form_submissions(id) ON DELETE CASCADE,
  
  abandoned_at_step INT NOT NULL,
  reason VARCHAR(255),
  
  -- Dados para follow-up
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  full_name VARCHAR(255),
  
  -- Automação n8n
  followup_sent BOOLEAN DEFAULT FALSE,
  followup_sent_at TIMESTAMP WITH TIME ZONE,
  followup_type VARCHAR(50), -- 'email' ou 'whatsapp'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_form_abandonments_email 
  ON form_abandonments(email);

CREATE INDEX IF NOT EXISTS idx_form_abandonments_followup_sent 
  ON form_abandonments(followup_sent);

CREATE INDEX IF NOT EXISTS idx_form_abandonments_created_at 
  ON form_abandonments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_form_abandonments_submission_id 
  ON form_abandonments(submission_id);

-- ====================================
-- RLS (ROW LEVEL SECURITY) POLICIES
-- ====================================

-- Ativar RLS
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_abandonments ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ler apenas seus próprios dados
CREATE POLICY "users_can_read_own_submissions"
  ON form_submissions FOR SELECT
  USING (auth.jwt() ->> 'email' = email OR email IS NOT NULL);

-- Policy: Usuários podem atualizar apenas seus próprios dados
CREATE POLICY "users_can_update_own_submissions"
  ON form_submissions FOR UPDATE
  USING (auth.jwt() ->> 'email' = email);

-- Policy: Usuários podem inserir submissions
CREATE POLICY "users_can_insert_submissions"
  ON form_submissions FOR INSERT
  WITH CHECK (email IS NOT NULL);

-- Policy: Abandonments (apenas leitura para usuários)
CREATE POLICY "users_can_read_abandonments"
  ON form_abandonments FOR SELECT
  USING (auth.jwt() ->> 'email' = email OR email IS NOT NULL);

-- ====================================
-- FUNÇÃO: Atualizar updated_at
-- ====================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para form_submissions
CREATE TRIGGER update_form_submissions_updated_at
  BEFORE UPDATE ON form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ====================================
-- FUNÇÃO: Rastrear Abandonment
-- ====================================

CREATE OR REPLACE FUNCTION track_form_abandonment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_abandoned = TRUE AND OLD.is_abandoned = FALSE THEN
    INSERT INTO form_abandonments (
      submission_id,
      email,
      phone,
      full_name,
      abandoned_at_step
    ) VALUES (
      NEW.id,
      NEW.email,
      NEW.phone,
      NEW.full_name,
      NEW.current_step
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para rastrear abandonments
CREATE TRIGGER on_form_abandoned
  AFTER UPDATE ON form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION track_form_abandonment();

-- ====================================
-- VIEW: Estatísticas de Formulário
-- ====================================

CREATE OR REPLACE VIEW form_statistics AS
SELECT 
  COUNT(*) as total_submissions,
  SUM(CASE WHEN is_completed THEN 1 ELSE 0 END) as completed,
  SUM(CASE WHEN is_abandoned THEN 1 ELSE 0 END) as abandoned,
  SUM(CASE WHEN NOT is_completed AND NOT is_abandoned THEN 1 ELSE 0 END) as in_progress,
  
  -- Taxa de conclusão
  ROUND(
    (SUM(CASE WHEN is_completed THEN 1 ELSE 0 END)::NUMERIC / 
     COUNT(*)::NUMERIC * 100), 2
  ) as completion_rate,
  
  -- Taxa de abandono
  ROUND(
    (SUM(CASE WHEN is_abandoned THEN 1 ELSE 0 END)::NUMERIC / 
     COUNT(*)::NUMERIC * 100), 2
  ) as abandonment_rate,
  
  -- Tempo médio
  AVG(EXTRACT(EPOCH FROM (COALESCE(completed_at, abandoned_at, NOW()) - created_at))) as avg_duration_seconds,
  
  MIN(created_at) as first_submission,
  MAX(created_at) as last_submission
FROM form_submissions;

-- ====================================
-- VIEW: Abandonments Pendentes (sem follow-up)
-- ====================================

CREATE OR REPLACE VIEW pending_followups AS
SELECT 
  fa.id,
  fa.email,
  fa.phone,
  fa.full_name,
  fa.abandoned_at_step,
  fs.current_step,
  fs.created_at as form_started_at,
  fa.created_at as abandoned_at,
  EXTRACT(EPOCH FROM (NOW() - fa.created_at)) / 3600 as hours_since_abandonment
FROM form_abandonments fa
LEFT JOIN form_submissions fs ON fa.submission_id = fs.id
WHERE fa.followup_sent = FALSE
ORDER BY fa.created_at DESC;

-- ====================================
-- SEED DATA (OPCIONAL - Para Testes)
-- ====================================

-- Descomente para adicionar dados de teste:

-- INSERT INTO form_submissions (
--   email, phone, language, full_name, current_step, completed_steps
-- ) VALUES
--   ('test1@example.com', '+55 11 99999-8888', 'pt-BR', 'João Silva', 2, ARRAY[1]),
--   ('test2@example.com', '+55 11 99999-7777', 'en', 'John Smith', 3, ARRAY[1, 2]),
--   ('test3@example.com', '+55 11 99999-6666', 'pt-BR', 'Maria Santos', 1, ARRAY[])
-- ON CONFLICT (email) DO NOTHING;

-- ====================================
-- GRANT PERMISSIONS (Para Aplicação)
-- ====================================

-- Seu aplicativo precisa de permissões
-- Acesse: https://app.supabase.com > Project Settings > Database > Roles

-- Grant básico (você pode refinar depois):
-- GRANT USAGE ON SCHEMA public TO anon, authenticated;
-- GRANT SELECT, INSERT, UPDATE ON form_submissions TO anon, authenticated;
-- GRANT SELECT, INSERT ON form_abandonments TO anon, authenticated;

-- ====================================
-- NOTAS IMPORTANTES
-- ====================================
--
-- 1. Execute este script no SQL Editor do Supabase
-- 2. Verifique as políticas de RLS (Row Level Security)
-- 3. Teste as queries antes de usar em produção
-- 4. Faça backup regularmente
-- 5. Monitore performance dos índices
--
-- ====================================
