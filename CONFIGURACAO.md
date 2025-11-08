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

# MAPLIBRE/MAPA - NÃO É MAIS NECESSÁRIO! 🎉
# O projeto usa MapLibre GL JS com tiles gratuitos do OpenStreetMap
# VITE_MAPBOX_ACCESS_TOKEN=pk.seu-token-mapbox (OPCIONAL)

# N8N (suas credenciais já configuradas)
VITE_N8N_WEBHOOK_URL=https://heavydragonfly-n8n.cloudfy.cloud/webhook/formulario-sbl
```

---

## 🗺️ ~~Obter Token Mapbox~~ ✅ NÃO É MAIS NECESSÁRIO!

**Boa notícia!** O projeto agora usa **MapLibre GL JS** gratuito.

**Você NÃO precisa mais:**
- ❌ Criar conta no Mapbox
- ❌ Obter token de API
- ❌ Configurar credenciais de mapa

**O mapa funciona 100% gratuito sem configuração!** 🎉

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
- [x] ~~Token Mapbox~~ ✅ NÃO É MAIS NECESSÁRIO (MapLibre é gratuito!)
- [ ] `migrations.sql` executado no Supabase
- [ ] Bucket `form-documents` criado
- [ ] Servidor rodando

---

## 🆘 Precisa de Ajuda?

Consulte o arquivo `INSTALACAO.md` para instruções detalhadas.
