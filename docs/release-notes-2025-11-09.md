## Release Notes — 2025-11-09

### Overview
Atualiza páginas e estilos, melhora integrações e adiciona novo componente de seleção de depósito.

### Changes
- Pages: Welcome, Contact, AddressHistory, Depot, DocumentGuide, ProfilePhoto, Completion
- Styles: `src/styles/components.css`, `src/styles/global.css`, `src/styles/responsive.css`
- Components: Atualiza `src/components/DocumentStatus.js`; adiciona `src/components/DepotDropdown.js`
- Config: Ajustes em `src/config/supabase.js`
- Infra: Remove `.env.example` (verificar se remoção é intencional)

### Notes
- Adicionado `nul` ao `.gitignore` para evitar artefatos do Windows.
- Recomenda-se manter um `.env.example` com variáveis dummy para onboarding caso necessário.

