# 🔐 Configuração de Credenciais

## ⚠️ IMPORTANTE - Segurança

Este arquivo **NÃO contém credenciais reais** por motivos de segurança.

Suas credenciais estão configuradas localmente no arquivo `.env.local` (que não é versionado no Git).

---

## 📝 Como usar no seu PC:

### **Passo 1: Clone o repositório**
```bash
git clone https://github.com/Kleberodrigues/Formulario-sbl.git
cd Formulario-sbl
```

### **Passo 2: Instale dependências**
```bash
npm install
```

### **Passo 3: Crie o arquivo .env.local**

Copie o template:
```bash
cp .env.example .env.local
```

### **Passo 4: Configure suas credenciais**

Edite o arquivo `.env.local` e adicione suas credenciais:

```env
# SUPABASE (suas credenciais já configuradas)
VITE_SUPABASE_URL=https://lebmfeekwgcfbirzkuel.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-do-supabase

# MAPBOX (obtenha em: https://account.mapbox.com)
VITE_MAPBOX_ACCESS_TOKEN=pk.seu-token-mapbox

# N8N (suas credenciais já configuradas)
VITE_N8N_WEBHOOK_URL=https://heavydragonfly-n8n.cloudfy.cloud/webhook/formulario-sbl
```

---

## 🗺️ Obter Token Mapbox (OBRIGATÓRIO)

O único que você precisa criar:

1. Acesse: https://account.mapbox.com
2. Crie conta gratuita (leva 2 minutos)
3. Copie o token (começa com `pk.`)
4. Cole no `.env.local`

---

## 🗄️ Configurar Supabase

### **Executar Migrations:**
1. Acesse: https://app.supabase.com
2. Vá em: **SQL Editor**
3. Copie e execute o arquivo: `migrations.sql`

### **Criar Bucket Storage:**
1. No Supabase, vá em: **Storage**
2. Crie bucket: `form-documents` (private)

---

## ▶️ Executar o Projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## 📋 Checklist

- [ ] Repositório clonado
- [ ] `npm install` executado
- [ ] `.env.local` criado
- [ ] Token Mapbox configurado
- [ ] `migrations.sql` executado no Supabase
- [ ] Bucket `form-documents` criado
- [ ] Servidor rodando

---

## 🆘 Precisa de Ajuda?

Consulte o arquivo `INSTALACAO.md` para instruções detalhadas.
