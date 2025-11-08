# 🚀 Instruções de Execução - SBL Onboarding Form

## ✅ O que foi implementado (Step 1)

### Estrutura Completa do Projeto
```
Formulario-SBL/
├── src/
│   ├── config/
│   │   ├── supabase.js          ✅ Configuração Supabase
│   │   └── constants.js         ✅ Constantes e cores
│   ├── components/
│   │   ├── FormStep.js          ✅ Componente base
│   │   ├── Header.js            ✅ Header com logo
│   │   ├── LanguageSelector.js  ✅ Seletor de idioma
│   │   └── ProgressBar.js       ✅ Barra de progresso
│   ├── pages/
│   │   └── WelcomePage.js       ✅ Step 1 completo
│   ├── services/
│   │   └── supabaseService.js   ✅ Funções CRUD
│   ├── utils/
│   │   └── translations.js      ✅ i18n (4 idiomas)
│   ├── styles/
│   │   ├── global.css           ✅ Estilos globais
│   │   ├── components.css       ✅ Estilos componentes
│   │   └── responsive.css       ✅ Media queries
│   └── main.js                  ✅ Ponto de entrada
├── index.html                   ✅ HTML principal
├── package.json                 ✅ Dependências
├── vite.config.js               ✅ Config Vite
├── .env.example                 ✅ Template env vars
└── .gitignore                   ✅ Git ignore
```

### Funcionalidades do Step 1
- ✅ Logo SBL no header
- ✅ Seletor de idioma com 4 opções (🇧🇷 🇬🇧 🇧🇬 🇷🇴)
- ✅ Barra de progresso animada
- ✅ Botão "Continuar" com loading state
- ✅ Salvamento no localStorage (preparado para Supabase)
- ✅ Design responsivo (mobile-first)
- ✅ Cores do SBL (#17A798)

---

## 📋 Pré-requisitos

1. **Node.js** 18+ instalado
2. **Conta no Supabase** (criar em https://app.supabase.com)
3. **Git** instalado (opcional)

---

## 🔧 Setup Inicial

### 1. Instalar Dependências

```bash
cd "C:\Users\Dell\OneDrive\Área de Trabalho\Formulario-SBL"
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar template
cp .env.example .env

# Editar .env com suas credenciais Supabase
# VITE_SUPABASE_URL=https://seu-project.supabase.co
# VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 3. Configurar Supabase (Importante!)

Execute o SQL no Supabase SQL Editor:

```sql
-- Copie e execute o conteúdo completo de CLAUDE.md
-- (seção "Schema Supabase" com as tabelas form_submissions e form_abandonments)
```

### 4. Adicionar Logo SBL

```bash
# Adicione o logo em:
public/assets/logo-sbl.png

# Ou use um logo de fallback (aparecerá "SBL" em texto)
```

---

## ▶️ Executar o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

Abra: http://localhost:3000

### Build para Produção

```bash
npm run build
npm run preview
```

---

## 🧪 Testando o Step 1

### Checklist de Testes

1. **Visual**
   - [ ] Logo SBL aparece corretamente
   - [ ] Título em português: "Bem-vindo à Silva Brothers Logistics"
   - [ ] 4 botões de idioma visíveis

2. **Funcionalidade**
   - [ ] Clicar em cada idioma altera os textos
   - [ ] Botão "Continuar" mostra loading spinner
   - [ ] Idioma é salvo no localStorage
   - [ ] Console não mostra erros

3. **Responsividade**
   - [ ] Mobile (320px): Layout em coluna
   - [ ] Tablet (768px): Layout adequado
   - [ ] Desktop (1024px+): Layout centralizado

4. **Integração Supabase**
   - [ ] Abrir console (F12)
   - [ ] Ver mensagem: "Idioma salvo localmente"
   - [ ] Verificar localStorage tem `sbl_form_data`

---

## 🔍 Debugging

### Console do Navegador

Abra F12 e veja:

```javascript
// Ver estado da aplicação
window.SBL.appState

// Forçar próximo step (para testar)
window.SBL.goToNextStep()

// Forçar step anterior
window.SBL.goToPreviousStep()

// Re-renderizar app
window.SBL.renderApp()
```

### Verificar LocalStorage

```javascript
// No console
localStorage.getItem('sbl_form_data')
localStorage.getItem('sbl_language')
localStorage.getItem('sbl_session_id')
```

---

## 🎨 Cores do Projeto

```css
--color-primary: #17A798       /* Teal/Turquesa */
--color-primary-hover: #148882 /* Teal mais escuro */
--color-secondary: #FFFFFF     /* Branco */
--color-text: #333333          /* Cinza escuro */
--color-input-bg: #F5F5F5      /* Cinza claro */
```

---

## 📱 Breakpoints Responsivos

```css
Mobile:  320px - 767px   (1 coluna de idiomas)
Tablet:  768px - 1023px  (2 colunas de idiomas)
Desktop: 1024px+         (4 colunas de idiomas)
```

---

## 🐛 Problemas Comuns

### 1. "Cannot find module"
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### 2. "Supabase não configurado"
```bash
# Verificar .env tem as credenciais corretas
cat .env
```

### 3. "Logo não aparece"
```bash
# Verificar se arquivo existe
ls public/assets/logo-sbl.png

# Se não existir, aparecerá "SBL" em texto (fallback)
```

### 4. Porta 3000 já em uso
```bash
# Editar vite.config.js e mudar porta
server: { port: 5000 }
```

---

## 📊 Próximos Steps (TODO)

### Step 2 - Contact (Próximo)
- [ ] Criar ContactPage.js
- [ ] Campos: nome, email, telefone
- [ ] Validação de campos
- [ ] Salvar no Supabase (primeira gravação real)

### Step 3 - Chat
- [ ] Criar ChatPage.js
- [ ] Input de mensagem
- [ ] Salvar mensagens no Supabase (JSONB)

### Step 4 - Depot
- [ ] Criar DepotPage.js
- [ ] Integrar Mapbox ou Google Maps
- [ ] Dropdown de depósitos
- [ ] Salvar seleção no Supabase

### Step 5 - Completion
- [ ] Criar CompletionPage.js
- [ ] Mensagem de sucesso
- [ ] Marcar formulário como completo
- [ ] Salvar timestamp de conclusão

---

## 🎯 Métricas de Sucesso

- ✅ Step 1 funciona corretamente
- ⏳ Tempo de carregamento < 2s
- ⏳ Sem erros no console
- ⏳ Responsivo em todos os breakpoints
- ⏳ Idioma salvo corretamente

---

## 📞 Contato

**Projeto**: SBL Onboarding Form
**Dev**: SinergIA (Kleber)
**Cliente**: Silva Brothers Logistics LTD

---

## 🎉 Parabéns!

Se você chegou até aqui e o Step 1 está funcionando, você tem:

✅ Estrutura completa do projeto
✅ Sistema de componentes reutilizáveis
✅ Internacionalização (i18n) com 4 idiomas
✅ Design system com cores SBL
✅ Responsividade mobile-first
✅ Base para integração Supabase

**Próximo passo**: Implementar Step 2 (ContactPage) com validação e salvamento real no Supabase!

---

**Última atualização**: 2025-11-07
