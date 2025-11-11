-- ============================================
-- FIX: FUNCTION get_candidate_completion_status
-- ============================================
-- Corrige o erro de estrutura de retorno

DROP FUNCTION IF EXISTS get_candidate_completion_status(UUID);

CREATE OR REPLACE FUNCTION get_candidate_completion_status(p_candidate_id UUID)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
BEGIN
    SELECT json_build_object(
        'total_required', COUNT(dt.id)::INTEGER,
        'total_uploaded', COUNT(CASE WHEN cd.id IS NOT NULL THEN 1 END)::INTEGER,
        'total_approved', COUNT(CASE WHEN cd.status = 'approved' THEN 1 END)::INTEGER,
        'total_rejected', COUNT(CASE WHEN cd.status = 'rejected' THEN 1 END)::INTEGER,
        'total_pending', COUNT(CASE WHEN cd.status = 'pending' THEN 1 END)::INTEGER,
        'is_complete', (COUNT(CASE WHEN dt.is_required AND cd.id IS NULL THEN 1 END) = 0),
        'missing_documents', COALESCE(
            json_agg(dt.name) FILTER (WHERE dt.is_required AND cd.id IS NULL),
            '[]'::json
        )
    ) INTO v_result
    FROM document_types dt
    LEFT JOIN candidate_documents cd
        ON dt.id = cd.document_type_id
        AND cd.candidate_id = p_candidate_id
    WHERE dt.is_required = true;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_candidate_completion_status IS 'Retorna estatísticas de conclusão dos documentos do candidato como JSON';

-- Teste a função
SELECT get_candidate_completion_status('00000000-0000-0000-0000-000000000000'::UUID);
