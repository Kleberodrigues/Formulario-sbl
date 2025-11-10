# 🚀 Instruções de Setup - Supabase

**Guia passo a passo para configurar a estrutura normalizada do banco de dados**

---

## ✅ Status Atual

O script detectou que as tabelas ainda não foram criadas no Supabase.

**Projeto Supabase:** `lebmfeekwgcfbirzkuel`
**URL:** https://lebmfeekwgcfbirzkuel.supabase.co

---

## 📋 Passo a Passo

### **1. Abrir SQL Editor do Supabase** 📝

Clique no link abaixo para abrir o SQL Editor:

**🔗 [Abrir SQL Editor](https://supabase.com/dashboard/project/lebmfeekwgcfbirzkuel/sql/new)**

Ou manualmente:
1. Acesse: https://supabase.com/dashboard
2. Selecione o projeto: `lebmfeekwgcfbirzkuel`
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New query**

---

### **2. Copiar o SQL** 📄

Abra o arquivo `supabase-migration.sql` (está na raiz do projeto) e **copie TODO o conteúdo**.

O arquivo contém:
- ✅ Criação de 3 tabelas (candidates, document_types, candidate_documents)
- ✅ Índices para performance
- ✅ VIEW otimizada (candidate_documents_view)
- ✅ 4 FUNCTIONs PostgreSQL
- ✅ 1 TRIGGER
- ✅ 13 tipos de documentos

**Total:** 696 linhas de SQL

---

### **3. Colar e Executar** ▶️

1. **Cole** todo o conteúdo do arquivo no SQL Editor
2. Clique em **Run** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)
3. **Aguarde** a execução completar (pode levar 10-30 segundos)

**Resultado esperado:**
```
Success. No rows returned
```

---

### **4. Verificar Criação** ✅

Após executar, verifique se as tabelas foram criadas:

```sql
-- Cole e execute este SQL para verificar
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('candidates', 'document_types', 'candidate_documents')
ORDER BY table_name;
```

**Resultado esperado:**
```
candidate_documents
candidates
document_types
```

---

### **5. Verificar Tipos de Documentos** 📋

```sql
-- Verificar se os 13 tipos foram inseridos
SELECT COUNT(*) as total FROM document_types;
```

**Resultado esperado:**
```
total: 13
```

Para listar todos:
```sql
SELECT * FROM document_types ORDER BY display_order;
```

---

### **6. Executar Testes** 🧪

Volte ao terminal e execute:

```bash
npm run test:supabase
```

**Resultado esperado:**
```
========================================
📊 RELATÓRIO DE TESTES
========================================

Total de testes: 16
✅ Passou: 16
❌ Falhou: 0
📈 Taxa de sucesso: 100.00%

✅ Todos os testes passaram! Estrutura 100% funcional! 🎉
```

---

## 🎯 Próximos Passos

Após testes passarem:

1. **Testar funções JavaScript:**
   ```bash
   # O script migrate:dry-run agora deve funcionar
   npm run migrate:dry-run
   ```

2. **Iniciar desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Commit das alterações:**
   ```bash
   git add .
   git commit -m "feat: configurar estrutura Supabase normalizada"
   git push
   ```

---

## 🚨 Problemas Comuns

### **Erro: "permission denied"**
**Solução:** Verifique se está usando a chave `SUPABASE_SERVICE_KEY` correta no `.env`

### **Erro: "relation already exists"**
**Solução:** As tabelas já existem. Execute apenas:
```bash
npm run test:supabase
```

### **Erro: "function does not exist"**
**Solução:** Execute o SQL novamente, certificando-se de colar TODO o conteúdo

### **Tipos de documentos não aparecem**
**Solução:** Execute este SQL no Dashboard:
```sql
INSERT INTO document_types (code, name, description, is_required, display_order) VALUES
('form_enderecos', 'Formulário de Endereços', 'Formulário completo com dados de endereço', true, 1),
('contract_recorrente', 'Contrato Recorrente', 'Contrato de prestação de serviços recorrente', true, 2),
('proof_of_address', 'Comprovante de Endereço', 'Conta de água, luz, gás ou telefone', true, 3),
('right_to_work', 'Direito ao Trabalho', 'Documento que comprova elegibilidade para trabalho no Reino Unido', true, 4),
('caf_certificate', 'Certificado CAF', 'Certificate of Application Form', true, 5),
('driver_license', 'Carteira de Motorista', 'CNH ou Driver License válida', true, 6),
('vehicle_insurance', 'Seguro do Veículo', 'Apólice de seguro do veículo', false, 7),
('vehicle_mot', 'MOT do Veículo', 'Certificado de inspeção técnica do veículo', false, 8),
('bank_statement', 'Extrato Bancário', 'Extrato bancário recente', false, 9),
('national_insurance', 'National Insurance', 'Número de National Insurance', true, 10),
('passport', 'Passaporte', 'Cópia do passaporte válido', false, 11),
('visa', 'Visto', 'Visto de trabalho (se aplicável)', false, 12),
('profile_photo', 'Foto de Perfil', 'Foto para o perfil do candidato', false, 13)
ON CONFLICT (code) DO NOTHING;
```

---

## 📞 Suporte

**Arquivos de referência:**
- `supabase-migration.sql` - SQL completo
- `SUPABASE-MIGRATION-PLAN.md` - Análise detalhada
- `MIGRATION-GUIDE.md` - Guia completo
- `README-MIGRATION.md` - Documentação API

**Comandos úteis:**
```bash
npm run setup-supabase    # Verificar estrutura
npm run test:supabase      # Testar estrutura
npm run migrate:dry-run    # Testar migração
npm run migrate            # Migrar dados reais
```

---

**Desenvolvido por:** SinergIA (Kleber)
**Data:** 2025-11-10
**Projeto:** SBL Onboarding Form
