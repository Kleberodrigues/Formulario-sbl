# 🚀 Guia de Instalação - SBL Onboarding Form

## 📋 Pré-requisitos

- Node.js 16+ instalado
- Git instalado
- Conta no Supabase (https://app.supabase.com)
- ~~Conta no Mapbox~~ ✅ NÃO É MAIS NECESSÁRIO! (usamos MapLibre gratuito)

---

## 🔧 Instalação no seu PC

### **Passo 1: Clone o repositório**

```bash
# Clone o projeto
git clone https://github.com/Kleberodrigues/Formulario-sbl.git

# Entre na pasta
cd Formulario-sbl
```

---

### **Passo 2: Configuração Automática (Recomendado)**

#### **Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

#### **Windows (PowerShell):**
```powershell
# Instalar dependências
npm install

# Copiar template
copy .env.example .env.local

# Editar com suas credenciais
notepad .env.local
```

---

### **Passo 3: Configuração Manual (Alternativa)**

#### **3.1 - Instalar dependências:**
```bash
npm install
```

#### **3.2 - Criar arquivo .env.local:**
```bash
cp .env.example .env.local
```

#### **3.3 - Editar .env.local com suas credenciais:**

```env
# SUPABASE (OBRIGATÓRIO)
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...sua-chave-aqui...

# MAPBOX/MAPLIBRE (NÃO É MAIS NECESSÁRIO - MapLibre é gratuito!)
# VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ...seu-token-aqui... (OPCIONAL)

# N8N (OPCIONAL)
VITE_N8N_WEBHOOK_URL=https://seu-n8n.com/webhook/sbl
```

---

## 🗄️ Configuração do Supabase

### **Passo 1: Criar Projeto**
1. Acesse https://app.supabase.com
2. Clique em "New Project"
3. Escolha nome e senha

### **Passo 2: Executar Migrations**
1. No Supabase, vá em: **SQL Editor**
2. Clique em "New query"
3. Copie todo o conteúdo do arquivo `migrations.sql`
4. Cole no editor
5. Clique em "Run" (ou F5)

### **Passo 3: Criar Bucket de Storage**
1. No Supabase, vá em: **Storage**
2. Clique em "Create bucket"
3. Nome: `form-documents`
4. Público: **Não** (private)
5. Clique em "Create bucket"

### **Passo 4: Configurar Políticas RLS**
As políticas já estão no `migrations.sql`, mas verifique:
1. Vá em: **Authentication > Policies**
2. Certifique-se de que as tabelas `form_submissions` e `form_abandonments` têm políticas ativas

### **Passo 5: Obter Credenciais**
1. Vá em: **Settings > API**
2. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

---

## 🗺️ ~~Configuração do Mapbox~~ ✅ NÃO É MAIS NECESSÁRIO!

**Boa notícia!** O projeto agora usa **MapLibre GL JS** com tiles gratuitos do OpenStreetMap.

**Você NÃO precisa mais:**
- ❌ Criar conta no Mapbox
- ❌ Obter token de API
- ❌ Configurar credenciais

**O mapa funciona 100% gratuito sem configuração!** 🎉

---

## 🤖 Configuração do n8n (Opcional)

Se quiser automação de follow-up de abandono:

### **Passo 1: Criar Workflow no n8n**
1. Crie um workflow
2. Adicione um nó "Webhook"
3. Copie a URL do webhook

### **Passo 2: Adicionar ao .env.local**
```env
VITE_N8N_WEBHOOK_URL=https://seu-n8n.com/webhook/sbl-onboarding
```

---

## ▶️ Executar o Projeto

### **Desenvolvimento:**
```bash
npm run dev
```
Acesse: http://localhost:3000

### **Build para Produção:**
```bash
npm run build
npm run preview
```

---

## ✅ Checklist de Instalação

- [ ] Node.js instalado
- [ ] Repositório clonado
- [ ] Dependências instaladas (`npm install`)
- [ ] `.env.local` criado
- [ ] Credenciais Supabase configuradas
- [x] ~~Token Mapbox~~ ✅ NÃO É MAIS NECESSÁRIO (MapLibre é gratuito!)
- [ ] `migrations.sql` executado no Supabase
- [ ] Bucket `form-documents` criado no Supabase Storage
- [ ] Servidor rodando (`npm run dev`)

---

## 🐛 Problemas Comuns

### **Erro: "Supabase não configurado"**
- Verifique se o `.env.local` existe
- Verifique se as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão corretas
- Reinicie o servidor (`npm run dev`)

### **~~Erro: "Mapbox access token not configured"~~**
✅ **NÃO OCORRE MAIS!** MapLibre não precisa de token.

### **Erro: "MapLibre GL JS not loaded"**
- Execute: `npm install` para instalar `maplibre-gl`
- Verifique se o arquivo `package.json` tem `maplibre-gl` nas dependências
- Reinicie o servidor (`npm run dev`)

### **Erro: "No matching export uploadFile"**
- Execute: `npm install` novamente
- Verifique se o arquivo `src/services/supabaseService.js` tem a função `uploadFile` exportada

### **Erro: "Cannot find module maplibre-gl"**
- Execute: `npm install maplibre-gl`

---

## 📞 Suporte

- **Documentação completa:** `CLAUDE.md`
- **Requisitos:** `PRD.md`
- **Issues:** https://github.com/Kleberodrigues/Formulario-sbl/issues

---

## 📊 Estrutura do Projeto

```
Formulario-sbl/
├── .env.local              ← SUAS CREDENCIAIS (NÃO COMMITAR)
├── .env.example            ← Template público
├── setup.sh                ← Script de instalação automática
├── migrations.sql          ← Execute no Supabase SQL Editor
├── package.json
├── vite.config.js
├── index.html
├── src/
│   ├── components/         ← 9 componentes reutilizáveis
│   ├── pages/              ← 12 steps + conclusão
│   ├── services/           ← Supabase, n8n, helpers
│   ├── utils/              ← Validações, traduções
│   └── config/             ← Configurações
└── public/
    └── assets/             ← Logos
```

---

**Última atualização:** 2025-11-08
