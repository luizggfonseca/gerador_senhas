# 📝 Walkthrough do Projeto — SecureGen

Este documento detalha o passo a passo do desenvolvimento do projeto **SecureGen**, consolidando o histórico de alterações, decisões de arquitetura e soluções para problemas encontrados.

---

## 🏗️ 1. Visão Geral da Arquitetura

O SecureGen utiliza uma arquitetura modular unificada, projetada para ser _stateless_ e _zero-knowledge_.

### Componentes Principais:

1.  **Backend (API Serverless):** Implementado em **FastAPI (Python)** na pasta `/api`. Processa gerações de forma volátil, sem persistência em disco.
2.  **Frontend (Dashboard):** Aplicação **React (Vite)** que gerencia a interface com estética _Glassmorphism_ e telas flutuantes (acordeão).

### Tecnologias:

- **Frontend:** React 19, Vite 7, Vanilla CSS (Design System próprio).
- **Backend:** FastAPI, Python 3.10+, Módulo `secrets` (segurança nível kernel).
- **Infraestrutura:** Preparado para Vercel Serverless.

---

## 📅 2. Histórico de Desenvolvimento

### Fase Inicial (Jan/2026)

- Estrutura básica com FastAPI e React.
- Implementação dos primeiros geradores: Diceware Puro, Diceware Modificado e Aleatório Clássico.
- Módulo de entropia (`core/entropy.py`).
- Listas Diceware em 7 idiomas.

### Refatoração Geral (17/02/2026)

- **Segurança:** CORS restringido, remoção de arquivos de debug, expurgo de senhas em texto plano.
- **Backend:** Reescrita do `main.py` (movido para `api/index.py` posteriormente), tratamento de erros melhorado.
- **Frontend:** Componentização do `Generator.jsx` (Sidebar, ConfigPanel, ResultPanel) e criação do hook `usePasswordGenerator.js`.

### Versão Standalone & Web (GitHub Pages) (17/02/2026)

- Criação de uma versão 100% client-side em JavaScript puro (antiga pasta `docs/`, agora removida).

### Melhorias de UI e UX (Fev/2026)

- Implementação de Temas (Claro/Escuro) e Modo Mobile.
- Estrutura hierárquica na Sidebar.
- Transição para o esquema de cores Bordeaux (#722F37).
- Criação do **Modal de Segurança** com React Portals para evitar cortes de interface.
- Implementação de bloqueio de cópia e menu de contexto no modal.

### Expansão e Refinamento (25/02/2026 - 26/02/2026)

- Adição de novos algoritmos: **ProtonPass Style, ULID, NanoID, FIPS-181 (Fonética), HEA, PIN Numérico**.
- Cálculo dinâmico de entropia em tempo real.
- Sistema de **Acordeão Inteligente** para o Dashboard (Floating Screens).
- Padronização de rótulos em MAIÚSCULAS e aumento de escala visual.

### Refinamento e Simplificação (06/03/2026)

- **Remoção de Geradores:** Exclusão dos modelos **Diceware Clássico (Puro)**, **Senha Fonética (FIPS-181)**, **ULID**, **Alta Entropia (HEA)**, **Apenas Consoantes** e **PIN Numérico** para focar em métodos mais modernos e seguros.
- **Dashboard Simplificado:** Remoção de legendas de entropia e botões redundantes para foco total na geração.

### Refinamento e Simplificação (Março 2026)

- **Remoção de Geradores específicos**: Para focar na experiência premium e utilitária, removemos os geradores: Diceware Clássico (Puro), Senha Fonética (FIPS-181), ULID, Alta Entropia (HEA), Apenas Consoantes e PIN Numérico.
- **Layout Fluido e Premium**: Aumento da largura máxima da aplicação para 1800px e ajuste de paddings dinâmicos (2vw) para melhor aproveitamento do espaço em telas grandes.
- **Remoção de Scrollbars**: Ajustado o comportamento do conteúdo para crescer organicamente, eliminando barras de rolagem internas desnecessárias e elevando o título.
- **Melhorias no Diceware Personalizado**: Restauração dos controles de quantidade de números e símbolos para maior flexibilidade.
- **GhostPass Rebranding**: Identidade visual consolidada com o novo nome **GhostPass** no cabeçalho e rodapé.
- **Paleta Oxford & Gold**: Design ultra-premium com fundo Oxford Blue (#002147) e tipografia/detalhes em Champagne Gold (#EAD292).
- **Tema Único**: Remoção do seletor de modo claro/escuro para garantir a consistência da marca e foco na estética premium exclusiva.
- **Limpeza de Código:** Exclusão de classes de geradores obsoletas e arquivos de documentação antigos em favor deste Walkthrough unificado.

---

## 🏗️ 3. Problemas e Soluções

| Problema                                                                                    | Solução                                                                                      |
| :------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------- |
| **CORS/Conflito de Portas:** Frontend abria na 5174 e o backend esperava na 5173.           | Script `run_app.sh` atualizado para limpar processos antigos e forçar portas `--strictPort`. |
| **Corte de Modal:** O modal de senha era cortado pelo container pai com `overflow: hidden`. | Uso de **React Portals** para renderizar o modal diretamente no `<body>`.                    |
| **Vazamento de Dados:** Histórico de senhas salvo em `.json`.                               | Removido o sistema de histórico; arquitetura **Zero Knowledge** implementada.                |
| **Cálculo de Entropia Impreciso:** Overshoots no comprimento ao pedir bits específicos.     | Implementado cálculo dinâmico baseado no pool real (Upper/Lower/Numbers/Symbols).            |

---

## 🧹 4. Limpeza e Otimização atual (06–07/03/2026)

### Ação de 06/03:

Verificação e remoção de arquivos obsoletos e desnecessários para manter o projeto limpo e eficiente.

**Arquivos identificados para exclusão:**

- `HISTORICO_PROJETO.txt` (Consolidado neste walkthrough)
- `DOCUMENTACAO_ARQUITETURA.md` (Consolidado neste walkthrough)
- `frontend/README.md` (Template padrão do Vite)
- `frontend/src/assets/react.svg` (Asset padrão do Vite não utilizado)
- `frontend/public/vite.svg` (Asset padrão do Vite não utilizado)

### Ação de 07/03 — Refatoração CSS e layout fluido:

- **CSS reescrito do zero**: O `index.css` foi completamente reescrito para eliminar duplicatas (a propriedade `body` estava definida duas vezes), regras de tema claro (`light-theme`) obsoletas, e seletores mortos.
- **Layout 100% fluido**: Removidos todos os `max-width` fixos do wrapper principal. A aplicação agora ocupa 100% da largura disponível em qualquer monitor, sem limitações de tamanho de tela.
- **Responsividade consolidada**: Media queries reorganizadas em único bloco ao final do arquivo, cobrindo desktop e mobile sem conflitos.
- **Redução de tamanho**: CSS passou de ~1512 linhas para ~430 linhas (redução de ~70%), sem perda de funcionalidade ou arquitetura.

---

_Este documento é mantido automaticamente como parte das diretrizes de desenvolvimento do projeto._
