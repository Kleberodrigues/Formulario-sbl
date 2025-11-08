#!/bin/bash
# ====================================
# SBL Onboarding Form - Setup Script
# ====================================
# Este script configura o projeto no seu PC
# ====================================

echo "🚀 Configurando SBL Onboarding Form..."
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está na pasta correta
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto Formulario-sbl${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Pasta correta detectada${NC}"
echo ""

# Instalar dependências
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependências...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependências instaladas${NC}"
    echo ""
else
    echo -e "${GREEN}✅ Dependências já instaladas${NC}"
    echo ""
fi

# Criar .env.local
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}📝 Criando arquivo .env.local...${NC}"
    echo ""

    # Solicitar credenciais Supabase
    echo -e "${YELLOW}🔑 Configure suas credenciais do Supabase:${NC}"
    echo "   Acesse: https://app.supabase.com > Seu Projeto > Settings > API"
    echo ""

    read -p "   SUPABASE_URL (https://????.supabase.co): " SUPABASE_URL
    read -p "   SUPABASE_ANON_KEY (eyJ...): " SUPABASE_KEY
    echo ""

    # Solicitar token Mapbox
    echo -e "${YELLOW}🗺️  Configure seu token do Mapbox:${NC}"
    echo "   Acesse: https://account.mapbox.com/access-tokens/"
    echo ""

    read -p "   MAPBOX_TOKEN (pk.eyJ...): " MAPBOX_TOKEN
    echo ""

    # Solicitar webhook n8n (opcional)
    echo -e "${YELLOW}🤖 Configure webhook n8n (opcional, pressione Enter para pular):${NC}"
    read -p "   N8N_WEBHOOK_URL: " N8N_WEBHOOK
    echo ""

    # Criar arquivo .env.local
    cat > .env.local << EOF
# ====================================
# SBL Onboarding Form - Configuração Local
# ====================================
# Gerado automaticamente em $(date)
# ====================================

# ====================================
# SUPABASE (OBRIGATÓRIO)
# ====================================

VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${SUPABASE_KEY}


# ====================================
# MAPBOX (OBRIGATÓRIO PARA STEP 2)
# ====================================

VITE_MAPBOX_ACCESS_TOKEN=${MAPBOX_TOKEN}


# ====================================
# N8N WEBHOOK (OPCIONAL)
# ====================================

VITE_N8N_WEBHOOK_URL=${N8N_WEBHOOK}


# ====================================
# APP CONFIGURATION
# ====================================

VITE_APP_URL=http://localhost:3000
VITE_APP_NAME=SBL Onboarding Form
VITE_APP_ENV=development


# ====================================
# FEATURE FLAGS
# ====================================

VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ABANDONMENT_TRACKING=true
VITE_ENABLE_AUTO_SAVE=true
VITE_ENABLE_DEBUG_LOGS=true


# ====================================
# STORAGE
# ====================================

VITE_STORAGE_BUCKET=form-documents
VITE_MAX_FILE_SIZE=10485760
VITE_MAX_IMAGE_SIZE=5242880
EOF

    echo -e "${GREEN}✅ Arquivo .env.local criado com sucesso!${NC}"
    echo ""
else
    echo -e "${GREEN}✅ Arquivo .env.local já existe${NC}"
    echo ""
fi

# Verificar se migrations.sql existe
if [ -f "migrations.sql" ]; then
    echo -e "${YELLOW}📊 IMPORTANTE: Configure o Supabase${NC}"
    echo ""
    echo "   1. Acesse: https://app.supabase.com"
    echo "   2. Vá em: SQL Editor"
    echo "   3. Execute o arquivo: migrations.sql"
    echo "   4. Crie o bucket: form-documents em Storage"
    echo ""
else
    echo -e "${RED}⚠️  Arquivo migrations.sql não encontrado${NC}"
    echo ""
fi

# Finalizar
echo -e "${GREEN}🎉 Setup completo!${NC}"
echo ""
echo -e "${YELLOW}Para iniciar o projeto:${NC}"
echo "   npm run dev"
echo ""
echo -e "${YELLOW}Para fazer build:${NC}"
echo "   npm run build"
echo ""
echo -e "${GREEN}Acesse: http://localhost:3000${NC}"
echo ""
