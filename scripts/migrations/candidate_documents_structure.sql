-- ============================================
-- ESTRUTURA DE BANCO DE DADOS PARA DOCUMENTOS
-- Sistema de Onboarding - Silva Brothers Logistics LTD
-- ============================================

-- 1. TABELA PRINCIPAL DE CANDIDATOS
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    preferred_language VARCHAR(10) DEFAULT 'English',
    depot_location VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA DE TIPOS DE DOCUMENTOS
CREATE TABLE document_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_required BOOLEAN DEFAULT false,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE DOCUMENTOS DOS CANDIDATOS
CREATE TABLE candidate_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    document_type_id INTEGER NOT NULL REFERENCES document_types(id),
    
    -- Caminho no Supabase Storage
    storage_bucket VARCHAR(100) DEFAULT 'form-documents',
    storage_path TEXT NOT NULL,
    
    -- Metadados do arquivo
    original_filename VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(100),
    
    -- Status e validação
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID, -- referência ao usuário que revisou
    review_notes TEXT,
    
    UNIQUE(candidate_id, document_type_id)
);

-- 4. INSERIR TIPOS DE DOCUMENTOS
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

-- 5. ÍNDICES PARA MELHOR PERFORMANCE
CREATE INDEX idx_candidates_email ON candidates(email);
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidate_documents_candidate ON candidate_documents(candidate_id);
CREATE INDEX idx_candidate_documents_type ON candidate_documents(document_type_id);
CREATE INDEX idx_candidate_documents_status ON candidate_documents(status);

-- 6. FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. TRIGGER PARA ATUALIZAR updated_at
CREATE TRIGGER update_candidates_updated_at 
    BEFORE UPDATE ON candidates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 8. VIEW PARA FACILITAR CONSULTAS
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

-- 9. FUNÇÃO PARA BUSCAR DOCUMENTOS DE UM CANDIDATO
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

-- 10. COMENTÁRIOS NAS TABELAS
COMMENT ON TABLE candidates IS 'Tabela principal com dados dos candidatos';
COMMENT ON TABLE document_types IS 'Tipos de documentos aceitos no sistema';
COMMENT ON TABLE candidate_documents IS 'Documentos enviados pelos candidatos, armazenados no Supabase Storage';
COMMENT ON COLUMN candidate_documents.storage_path IS 'Caminho completo do arquivo no bucket do Supabase Storage';
COMMENT ON COLUMN candidate_documents.status IS 'Status do documento: pending, approved, rejected';

-- ============================================
-- EXEMPLO DE USO
-- ============================================

-- Inserir um novo candidato
-- INSERT INTO candidates (full_name, email, phone_number, preferred_language, depot_location)
-- VALUES ('João Silva', 'joao.silva@email.com', '+44 7700 900123', 'Português', 'DSO2 (Southampton - SO40 9LR)');

-- Registrar upload de documento
-- INSERT INTO candidate_documents (candidate_id, document_type_id, storage_path, original_filename, file_size, mime_type)
-- VALUES (
--     'uuid-do-candidato',
--     (SELECT id FROM document_types WHERE code = 'proof_of_address'),
--     'form-documents/proof_of_address_uuid-123456.pdf',
--     'comprovante_endereco.pdf',
--     245678,
--     'application/pdf'
-- );

-- Buscar todos os documentos de um candidato
-- SELECT * FROM get_candidate_documents('uuid-do-candidato');

-- Ver relatório completo de documentos
-- SELECT * FROM candidate_documents_view WHERE candidate_id = 'uuid-do-candidato';
