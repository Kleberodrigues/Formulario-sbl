-- ============================================
-- SBL ONBOARDING - SUPABASE MIGRATION SCRIPT
-- ============================================
-- Data: 2025-11-10
-- Descrição: Migração de estrutura monolítica para normalizada
-- Autor: SinergIA (Kleber)
-- ============================================

-- ============================================
-- 1. CRIAR TABELA: candidates
-- ============================================
-- Dados básicos dos candidatos
CREATE TABLE IF NOT EXISTS candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Dados pessoais
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),

    -- Configurações
    preferred_language VARCHAR(10) DEFAULT 'en',
    depot_location VARCHAR(100),

    -- Status geral
    status VARCHAR(50) DEFAULT 'pending', -- pending, active, inactive, rejected

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON candidates(created_at);

-- Comentários
COMMENT ON TABLE candidates IS 'Dados básicos dos candidatos do onboarding SBL';
COMMENT ON COLUMN candidates.status IS 'Status: pending (aguardando), active (ativo), inactive (inativo), rejected (rejeitado)';


-- ============================================
-- 2. CRIAR TABELA: document_types
-- ============================================
-- Tipos de documentos aceitos no sistema (configurável)
CREATE TABLE IF NOT EXISTS document_types (
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
('proof_of_address', 'Comprovante de Endereço', 'Conta de água, luz, gás ou telefone (últimos 3 meses)', true, 3),
('right_to_work', 'Direito ao Trabalho', 'Documento que comprova elegibilidade para trabalho no Reino Unido', true, 4),
('caf_certificate', 'Certificado CAF', 'Certificate of Application Form', true, 5),
('driver_license', 'Carteira de Motorista', 'CNH ou Driver License válida', true, 6),
('vehicle_insurance', 'Seguro do Veículo', 'Apólice de seguro do veículo', false, 7),
('vehicle_mot', 'MOT do Veículo', 'Certificado de inspeção técnica do veículo', false, 8),
('bank_statement', 'Extrato Bancário', 'Extrato bancário recente (últimos 3 meses)', false, 9),
('national_insurance', 'National Insurance', 'Número de National Insurance', true, 10),
('passport', 'Passaporte', 'Cópia do passaporte válido', false, 11),
('visa', 'Visto', 'Visto de trabalho (se aplicável)', false, 12),
('profile_photo', 'Foto de Perfil', 'Foto para o perfil do candidato', false, 13)
ON CONFLICT (code) DO NOTHING;

-- Comentários
COMMENT ON TABLE document_types IS 'Tipos de documentos aceitos no sistema (configurável sem alterar código)';
COMMENT ON COLUMN document_types.is_required IS 'Define se o documento é obrigatório para aprovação';


-- ============================================
-- 3. CRIAR TABELA: candidate_documents
-- ============================================
-- Relacionamento entre candidatos e documentos
CREATE TABLE IF NOT EXISTS candidate_documents (
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

    -- Status e validação
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID, -- admin que revisou
    review_notes TEXT, -- motivo da aprovação/rejeição

    -- Evitar duplicatas (1 candidato = 1 documento por tipo)
    UNIQUE(candidate_id, document_type_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_candidate_documents_candidate ON candidate_documents(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_documents_type ON candidate_documents(document_type_id);
CREATE INDEX IF NOT EXISTS idx_candidate_documents_status ON candidate_documents(status);
CREATE INDEX IF NOT EXISTS idx_candidate_documents_uploaded_at ON candidate_documents(uploaded_at);

-- Comentários
COMMENT ON TABLE candidate_documents IS 'Documentos enviados pelos candidatos com status de aprovação';
COMMENT ON COLUMN candidate_documents.status IS 'Status: pending (aguardando), approved (aprovado), rejected (rejeitado)';


-- ============================================
-- 4. CRIAR VIEW: candidate_documents_view
-- ============================================
-- View otimizada para facilitar queries
CREATE OR REPLACE VIEW candidate_documents_view AS
SELECT
    c.id as candidate_id,
    c.full_name,
    c.email,
    c.phone_number,
    c.depot_location,
    c.status as candidate_status,
    c.created_at as candidate_created_at,

    dt.id as document_type_id,
    dt.code as document_code,
    dt.name as document_name,
    dt.is_required,
    dt.display_order,

    cd.id as document_id,
    cd.storage_path,
    cd.storage_bucket,
    cd.original_filename,
    cd.file_size,
    cd.mime_type,
    cd.status as document_status,
    cd.uploaded_at,
    cd.reviewed_at,
    cd.reviewed_by,
    cd.review_notes
FROM candidates c
LEFT JOIN candidate_documents cd ON c.id = cd.candidate_id
LEFT JOIN document_types dt ON cd.document_type_id = dt.id
ORDER BY c.created_at DESC, dt.display_order;

COMMENT ON VIEW candidate_documents_view IS 'View otimizada para consultar candidatos e seus documentos';


-- ============================================
-- 5. CRIAR FUNCTION: get_candidate_documents
-- ============================================
-- Função para buscar todos os documentos de um candidato
CREATE OR REPLACE FUNCTION get_candidate_documents(p_candidate_id UUID)
RETURNS TABLE (
    document_code VARCHAR,
    document_name VARCHAR,
    is_required BOOLEAN,
    storage_path TEXT,
    storage_bucket VARCHAR,
    status VARCHAR,
    uploaded_at TIMESTAMP WITH TIME ZONE,
    file_size INTEGER,
    mime_type VARCHAR,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        dt.code,
        dt.name,
        dt.is_required,
        cd.storage_path,
        cd.storage_bucket,
        cd.status,
        cd.uploaded_at,
        cd.file_size,
        cd.mime_type,
        cd.reviewed_at,
        cd.review_notes
    FROM document_types dt
    LEFT JOIN candidate_documents cd
        ON dt.id = cd.document_type_id
        AND cd.candidate_id = p_candidate_id
    ORDER BY dt.display_order;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_candidate_documents IS 'Retorna todos os documentos de um candidato (enviados ou pendentes)';


-- ============================================
-- 6. CRIAR FUNCTION: get_candidate_completion_status
-- ============================================
-- Função para verificar status de conclusão do candidato
CREATE OR REPLACE FUNCTION get_candidate_completion_status(p_candidate_id UUID)
RETURNS TABLE (
    total_required INTEGER,
    total_uploaded INTEGER,
    total_approved INTEGER,
    total_rejected INTEGER,
    total_pending INTEGER,
    is_complete BOOLEAN,
    missing_documents TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(dt.id)::INTEGER as total_required,
        COUNT(CASE WHEN cd.id IS NOT NULL THEN 1 END)::INTEGER as total_uploaded,
        COUNT(CASE WHEN cd.status = 'approved' THEN 1 END)::INTEGER as total_approved,
        COUNT(CASE WHEN cd.status = 'rejected' THEN 1 END)::INTEGER as total_rejected,
        COUNT(CASE WHEN cd.status = 'pending' THEN 1 END)::INTEGER as total_pending,
        (COUNT(CASE WHEN dt.is_required AND cd.id IS NULL THEN 1 END) = 0) as is_complete,
        ARRAY_AGG(dt.name) FILTER (WHERE dt.is_required AND cd.id IS NULL) as missing_documents
    FROM document_types dt
    LEFT JOIN candidate_documents cd
        ON dt.id = cd.document_type_id
        AND cd.candidate_id = p_candidate_id
    WHERE dt.is_required = true;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_candidate_completion_status IS 'Retorna estatísticas de conclusão dos documentos do candidato';


-- ============================================
-- 7. CRIAR TRIGGER: update_updated_at
-- ============================================
-- Trigger para atualizar automaticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger na tabela candidates
DROP TRIGGER IF EXISTS update_candidates_updated_at ON candidates;
CREATE TRIGGER update_candidates_updated_at
    BEFORE UPDATE ON candidates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- 8. STORAGE: Criar bucket e políticas RLS
-- ============================================
-- Nota: Este código deve ser executado no Supabase Dashboard > Storage

-- Criar bucket (se não existir)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('form-documents', 'form-documents', false)
-- ON CONFLICT (id) DO NOTHING;

-- RLS Policy: Usuários podem fazer upload de seus próprios documentos
-- CREATE POLICY "Users can upload their own documents"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (bucket_id = 'form-documents');

-- RLS Policy: Usuários podem visualizar seus próprios documentos
-- CREATE POLICY "Users can view their own documents"
-- ON storage.objects FOR SELECT
-- TO authenticated
-- USING (bucket_id = 'form-documents');

-- RLS Policy: Usuários podem deletar seus próprios documentos
-- CREATE POLICY "Users can delete their own documents"
-- ON storage.objects FOR DELETE
-- TO authenticated
-- USING (bucket_id = 'form-documents');


-- ============================================
-- 9. FUNÇÃO DE MIGRAÇÃO: form_submissions → candidates
-- ============================================
-- Migra dados de form_submissions para a nova estrutura
CREATE OR REPLACE FUNCTION migrate_form_submission_to_candidate(p_submission_id UUID)
RETURNS UUID AS $$
DECLARE
    v_candidate_id UUID;
    v_submission RECORD;
    v_document_type_id INTEGER;
    v_storage_path TEXT;
BEGIN
    -- Buscar dados do form_submissions
    SELECT * INTO v_submission
    FROM form_submissions
    WHERE id = p_submission_id
    AND is_completed = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Form submission não encontrado ou não completado: %', p_submission_id;
    END IF;

    -- Inserir ou atualizar candidato
    INSERT INTO candidates (
        id,
        full_name,
        email,
        phone_number,
        preferred_language,
        depot_location,
        status,
        created_at,
        updated_at
    ) VALUES (
        v_submission.id,
        v_submission.full_name,
        v_submission.email,
        v_submission.phone,
        v_submission.language,
        v_submission.selected_depot,
        'pending',
        v_submission.created_at,
        v_submission.updated_at
    )
    ON CONFLICT (email) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone_number = EXCLUDED.phone_number,
        preferred_language = EXCLUDED.preferred_language,
        depot_location = EXCLUDED.depot_location,
        updated_at = NOW()
    RETURNING id INTO v_candidate_id;

    -- Migrar profile_photo
    IF v_submission.profile_photo_url IS NOT NULL THEN
        SELECT id INTO v_document_type_id FROM document_types WHERE code = 'profile_photo';
        INSERT INTO candidate_documents (
            candidate_id,
            document_type_id,
            storage_path,
            original_filename,
            status,
            uploaded_at
        ) VALUES (
            v_candidate_id,
            v_document_type_id,
            v_submission.profile_photo_url,
            'profile_photo',
            'pending',
            v_submission.profile_photo_uploaded_at
        )
        ON CONFLICT (candidate_id, document_type_id) DO NOTHING;
    END IF;

    -- Migrar driving_licence_front
    IF v_submission.driving_licence_front_url IS NOT NULL THEN
        SELECT id INTO v_document_type_id FROM document_types WHERE code = 'driver_license';
        INSERT INTO candidate_documents (
            candidate_id,
            document_type_id,
            storage_path,
            original_filename,
            status,
            uploaded_at
        ) VALUES (
            v_candidate_id,
            v_document_type_id,
            v_submission.driving_licence_front_url,
            'driving_licence_front',
            'pending',
            v_submission.driving_licence_uploaded_at
        )
        ON CONFLICT (candidate_id, document_type_id) DO NOTHING;
    END IF;

    -- Migrar documentos do JSONB
    IF v_submission.documents IS NOT NULL THEN
        -- right_to_work
        IF v_submission.documents->>'right_to_work_url' IS NOT NULL THEN
            SELECT id INTO v_document_type_id FROM document_types WHERE code = 'right_to_work';
            INSERT INTO candidate_documents (
                candidate_id,
                document_type_id,
                storage_path,
                original_filename,
                status,
                uploaded_at
            ) VALUES (
                v_candidate_id,
                v_document_type_id,
                v_submission.documents->>'right_to_work_url',
                'right_to_work',
                'pending',
                COALESCE((v_submission.documents->>'right_to_work_uploaded_at')::TIMESTAMP, NOW())
            )
            ON CONFLICT (candidate_id, document_type_id) DO NOTHING;
        END IF;

        -- proof_of_address
        IF v_submission.documents->>'proof_of_address_url' IS NOT NULL THEN
            SELECT id INTO v_document_type_id FROM document_types WHERE code = 'proof_of_address';
            INSERT INTO candidate_documents (
                candidate_id,
                document_type_id,
                storage_path,
                original_filename,
                status,
                uploaded_at
            ) VALUES (
                v_candidate_id,
                v_document_type_id,
                v_submission.documents->>'proof_of_address_url',
                'proof_of_address',
                'pending',
                COALESCE((v_submission.documents->>'proof_of_address_uploaded_at')::TIMESTAMP, NOW())
            )
            ON CONFLICT (candidate_id, document_type_id) DO NOTHING;
        END IF;

        -- national_insurance
        IF v_submission.documents->>'national_insurance_url' IS NOT NULL THEN
            SELECT id INTO v_document_type_id FROM document_types WHERE code = 'national_insurance';
            INSERT INTO candidate_documents (
                candidate_id,
                document_type_id,
                storage_path,
                original_filename,
                status,
                uploaded_at
            ) VALUES (
                v_candidate_id,
                v_document_type_id,
                v_submission.documents->>'national_insurance_url',
                'national_insurance',
                'pending',
                COALESCE((v_submission.documents->>'national_insurance_uploaded_at')::TIMESTAMP, NOW())
            )
            ON CONFLICT (candidate_id, document_type_id) DO NOTHING;
        END IF;

        -- bank_statement
        IF v_submission.documents->>'bank_statement_url' IS NOT NULL THEN
            SELECT id INTO v_document_type_id FROM document_types WHERE code = 'bank_statement';
            INSERT INTO candidate_documents (
                candidate_id,
                document_type_id,
                storage_path,
                original_filename,
                status,
                uploaded_at
            ) VALUES (
                v_candidate_id,
                v_document_type_id,
                v_submission.documents->>'bank_statement_url',
                'bank_statement',
                'pending',
                COALESCE((v_submission.documents->>'bank_statement_uploaded_at')::TIMESTAMP, NOW())
            )
            ON CONFLICT (candidate_id, document_type_id) DO NOTHING;
        END IF;

        -- vat_certificate
        IF v_submission.documents->>'vat_certificate_url' IS NOT NULL THEN
            SELECT id INTO v_document_type_id FROM document_types WHERE code = 'vat_certificate';
            INSERT INTO candidate_documents (
                candidate_id,
                document_type_id,
                storage_path,
                original_filename,
                status,
                uploaded_at
            ) VALUES (
                v_candidate_id,
                v_document_type_id,
                v_submission.documents->>'vat_certificate_url',
                'vat_certificate',
                'pending',
                COALESCE((v_submission.documents->>'vat_certificate_uploaded_at')::TIMESTAMP, NOW())
            )
            ON CONFLICT (candidate_id, document_type_id) DO NOTHING;
        END IF;
    END IF;

    RETURN v_candidate_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION migrate_form_submission_to_candidate IS 'Migra um form_submission completado para a estrutura normalizada';


-- ============================================
-- 10. FUNÇÃO: Migrar todos os formulários completados
-- ============================================
CREATE OR REPLACE FUNCTION migrate_all_completed_submissions()
RETURNS TABLE (
    submission_id UUID,
    candidate_id UUID,
    email VARCHAR,
    success BOOLEAN,
    error_message TEXT
) AS $$
DECLARE
    v_submission RECORD;
    v_candidate_id UUID;
BEGIN
    FOR v_submission IN
        SELECT id, email
        FROM form_submissions
        WHERE is_completed = true
        ORDER BY completed_at
    LOOP
        BEGIN
            v_candidate_id := migrate_form_submission_to_candidate(v_submission.id);

            submission_id := v_submission.id;
            candidate_id := v_candidate_id;
            email := v_submission.email;
            success := true;
            error_message := NULL;
            RETURN NEXT;

        EXCEPTION WHEN OTHERS THEN
            submission_id := v_submission.id;
            candidate_id := NULL;
            email := v_submission.email;
            success := false;
            error_message := SQLERRM;
            RETURN NEXT;
        END;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION migrate_all_completed_submissions IS 'Migra todos os formulários completados para a nova estrutura';


-- ============================================
-- FIM DO SCRIPT DE MIGRAÇÃO
-- ============================================

-- Para executar a migração:
-- 1. Execute este script no SQL Editor do Supabase
-- 2. Verifique se as tabelas foram criadas: SELECT * FROM candidates LIMIT 1;
-- 3. Execute a migração: SELECT * FROM migrate_all_completed_submissions();
-- 4. Verifique os resultados: SELECT * FROM candidate_documents_view;
