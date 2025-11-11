-- ============================================
-- ADICIONAR COLUNAS FALTANTES NA TABELA CANDIDATES
-- Script gerado após análise do teste E2E
-- Data: 2025-11-11
-- ============================================

-- Step 2: Depot
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS depot_code VARCHAR(50);

-- Step 4: Personal Information
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS birth_city VARCHAR(100);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS birth_country VARCHAR(100) DEFAULT 'United Kingdom';
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS mother_name VARCHAR(100);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS mother_surname VARCHAR(100);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS next_of_kin_name VARCHAR(255);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS next_of_kin_relationship VARCHAR(50);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS next_of_kin_phone VARCHAR(20);

-- Step 5: Address History (JSONB para armazenar array de endereços)
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS address_history JSONB DEFAULT '[]'::jsonb;

-- Step 6: Additional Information
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS national_insurance_number VARCHAR(20);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS utr_number VARCHAR(20);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS employment_status VARCHAR(100);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS vat_number VARCHAR(20);

-- Step 9: Bank Details (devem ser criptografados no futuro)
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS bank_account_number TEXT;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS bank_sort_code TEXT;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS payment_declaration_accepted BOOLEAN DEFAULT false;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS payment_declaration_accepted_at TIMESTAMP WITH TIME ZONE;

-- Step 12: Completion
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT false;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Comentários
COMMENT ON COLUMN candidates.depot_code IS 'Código do depósito selecionado (ex: DSO2)';
COMMENT ON COLUMN candidates.birth_date IS 'Data de nascimento do candidato';
COMMENT ON COLUMN candidates.birth_city IS 'Cidade de nascimento';
COMMENT ON COLUMN candidates.birth_country IS 'País de nascimento';
COMMENT ON COLUMN candidates.mother_name IS 'Nome da mãe';
COMMENT ON COLUMN candidates.mother_surname IS 'Sobrenome da mãe';
COMMENT ON COLUMN candidates.next_of_kin_name IS 'Nome completo do Next of Kin';
COMMENT ON COLUMN candidates.next_of_kin_relationship IS 'Relacionamento com o Next of Kin (spouse, parent, sibling, etc)';
COMMENT ON COLUMN candidates.next_of_kin_phone IS 'Telefone do Next of Kin';
COMMENT ON COLUMN candidates.address_history IS 'Histórico de 7 anos de endereços (JSONB array)';
COMMENT ON COLUMN candidates.national_insurance_number IS 'National Insurance Number (UK)';
COMMENT ON COLUMN candidates.utr_number IS 'Unique Taxpayer Reference (opcional)';
COMMENT ON COLUMN candidates.employment_status IS 'Sole trader ou Limited company';
COMMENT ON COLUMN candidates.vat_number IS 'VAT Number (opcional)';
COMMENT ON COLUMN candidates.bank_account_number IS 'Número da conta bancária (deve ser criptografado)';
COMMENT ON COLUMN candidates.bank_sort_code IS 'Sort Code bancário (deve ser criptografado)';
COMMENT ON COLUMN candidates.payment_declaration_accepted IS 'Declaração de pagamento aceita (checkbox Step 9)';
COMMENT ON COLUMN candidates.payment_declaration_accepted_at IS 'Timestamp de quando aceitou a declaração';
COMMENT ON COLUMN candidates.is_completed IS 'Formulário completo (Step 12)';
COMMENT ON COLUMN candidates.completed_at IS 'Data/hora de conclusão do formulário';

-- Criar índices úteis
CREATE INDEX IF NOT EXISTS idx_candidates_is_completed ON candidates(is_completed);
CREATE INDEX IF NOT EXISTS idx_candidates_completed_at ON candidates(completed_at);
CREATE INDEX IF NOT EXISTS idx_candidates_depot_code ON candidates(depot_code);
CREATE INDEX IF NOT EXISTS idx_candidates_national_insurance ON candidates(national_insurance_number);

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- Execute esta query para verificar se todas as colunas foram criadas:
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'candidates'
-- ORDER BY ordinal_position;
