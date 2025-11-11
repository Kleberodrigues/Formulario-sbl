-- ============================================
-- CORRIGIR TIPOS DE DOCUMENTOS DA CNH
-- Separar em frente e verso para permitir uploads separados
-- Data: 2025-11-11
-- ============================================

-- Remover o tipo genérico 'driver_license' (se existir e não houver documentos associados)
-- DELETE FROM document_types WHERE code = 'driver_license' AND id NOT IN (SELECT DISTINCT document_type_id FROM candidate_documents);

-- Adicionar tipos separados para frente e verso da CNH
INSERT INTO document_types (code, name, description, is_required, display_order) VALUES
('driving_licence_front', 'Carteira de Motorista (Frente)', 'Frente da CNH/Driver License com foto', true, 6),
('driving_licence_back', 'Carteira de Motorista (Verso)', 'Verso da CNH/Driver License com categorias', true, 7)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_required = EXCLUDED.is_required,
    display_order = EXCLUDED.display_order;

-- Atualizar display_order dos tipos posteriores (deslocar +1)
UPDATE document_types
SET display_order = display_order + 1
WHERE display_order >= 7 AND code NOT IN ('driving_licence_front', 'driving_licence_back');

-- Comentários
COMMENT ON COLUMN document_types.code IS 'Código único para identificar o tipo de documento (usado no código)';

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- Execute esta query para verificar os tipos de documentos:
-- SELECT id, code, name, is_required, display_order
-- FROM document_types
-- WHERE code LIKE '%driv%'
-- ORDER BY display_order;
