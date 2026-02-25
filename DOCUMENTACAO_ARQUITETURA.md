# 🏗️ Documentação de Arquitetura — SecureGen

Esta documentação detalha a arquitetura do projeto **SecureGen**, um gerador de senhas focado em privacidade, segurança e versatilidade. O sistema foi projetado para operar tanto como uma aplicação web standalone (client-side) quanto em um modelo cliente-servidor para desenvolvimento e funcionalidades avançadas.

---

## 1. Visão Geral do Sistema

O SecureGen possui uma arquitetura híbrida que permite a execução em dois modos distintos:

1.  **Modo Standalone (Produção/GitHub Pages):** Uma aplicação "Single-File" (ou quase) que reside na pasta `docs/`. Toda a lógica de geração de senhas e cálculo de entropia é executada diretamente no navegador do usuário via JavaScript.
2.  **Modo Client-Server (Desenvolvimento):** Composto por um backend em **FastAPI (Python)** e um frontend em **React (Vite 7)**. Este modo permite uma modularização mais profunda e facilita a expansão de funcionalidades como armazenamento criptografado (Vault).

### Diagrama de Arquitetura

```mermaid
graph TD
    subgraph "Ambiente do Usuário (Navegador)"
        A[Interface React / HTML5] --> B{Modo de Execução}
        B -- "Standalone (docs/)" --> C[Geradores em JS]
        B -- "Client-Server" --> D[API REST (FastAPI)]
    end

    subgraph "Backend (Python)"
        D --> E[Módulo Diceware]
        D --> F[Password Generators]
        D --> G[Core - Entropia]
        E --> H[Wordlists / TXT]
    end

    subgraph "Segurança"
        C --> I[Web Crypto API]
        D --> J[Python secrets module]
    end
```

---

## 2. Tecnologias Utilizadas

### Frontend
-   **React 19 + Vite 7:** Framework para a interface principal de desenvolvimento.
-   **Vanilla CSS:** Estilização semântica e moderna com suporte a temas (dark/light) e responsividade mobile.
-   **JavaScript (ES2020+):** Lógica standalone e integração com API.

### Backend (Python 3.10+)
-   **FastAPI:** Framework web moderno e de alta performance.
-   **Pydantic:** Validação de dados e esquemas de API.
-   **Uvicorn:** Servidor ASGI para execução do backend.

### Segurança e RNG (Random Number Generation)
-   **Client-side:** `window.crypto.getRandomValues()` — CSPRNG (Cryptographically Secure Pseudo-Random Number Generator).
-   **Server-side:** Módulo `secrets` do Python — interface para fontes de entropia do sistema operacional (`/dev/urandom`).

---

## 3. Estrutura de Módulos

O projeto é organizado de forma modular para garantir que a lógica de geração de senhas seja independente da interface de exibição.

### A. Módulo `core/`
Contém a lógica compartilhada, como o cálculo de entropia (`entropy.py`). O cálculo utiliza o logaritmo da base 2 do tamanho do espaço de busca elevado ao comprimento da senha ($log_2(pool^{length})$).

### B. Módulo `diceware/`
Responsável pelo gerenciamento de passphrases baseadas em palavras.
-   **Loader:** Carrega as wordlists filtrando comentários e formatando pares índice-palavra.
-   **Generator:** Seleciona palavras aleatórias garantindo unicidade e segurança.

### C. Módulo `vault/` (Em desenvolvimento)
Sistema de armazenamento criptografado utilizando AES-256-GCM com derivação de chave PBKDF2.

---

## 4. Fluxo de Dados

### Geração de Senha (Modo API)
1.  O usuário altera um parâmetro na interface (ex: incluir símbolos).
2.  O Frontend dispara uma requisição POST para o backend com o esquema de configuração.
3.  O Backend valida os dados com Pydantic e chama o gerador correspondente em `password_generators/`.
4.  O gerador utiliza o módulo `secrets` para obter bytes aleatórios.
5.  A senha e o cálculo de entropia são retornados como JSON.

### Geração de Senha (Modo Standalone)
1.  O usuário clica em "Gerar".
2.  A lógica JS em `docs/script.js` lê os estados dos inputs.
3.  Utiliza `fetch` para carregar wordlists (se necessário) e armazena em cache na memória.
4.  Inicia o loop de geração usando `crypto.getRandomValues()`.
5.  Calcula a entropia localmente e atualiza o DOM.

---

## 5. Modelo de Segurança

O SecureGen segue o princípio de **Confiança Zero (Zero Trust)** em relação a servidores externos:
-   **Isolamento Local:** Nenhuma senha gerada é enviada para servidores externos ou logs de telemetria.
-   **Gerenciamento de Memória:** As senhas permanecem na memória volátil e no histórico local (opcional) do navegador/backend.
-   **CORS Restrito:** No modo backend, as políticas de CORS são rigidamente definidas para aceitar apenas requisições do localhost.

---

## 6. Estrutura de Diretórios Detalhada

```bash
/
├── backend/            # Servidor FastAPI e rotas da API
├── banco_dados/        # Wordlists Diceware em formato bruto (.txt)
├── core/               # Lógica de negócio (entropia, utilitários)
├── diceware/           # Lógica específica para o método Diceware
├── docs/               # Versão STANDALONE para hospedagem web
│   ├── index.html      # UI principal (HTML/CSS/JS)
│   ├── wordlists/      # Listas otimizadas para carregamento web
│   └── manual.html     # Documentação de ajuda ao usuário
├── frontend/           # Aplicação principal em React
│   ├── src/
│   │   ├── components/ # Sidebar, ConfigPanel, ResultPanel
│   │   ├── hooks/      # usePasswordGenerator (Lógica de API)
│   │   └── App.jsx     # Orquestrador da Interface
├── password_generators/# Implementações dos variados geradores
├── vault/              # Módulo de criptografia para histórico seguro
├── run_app.sh          # Script automatizado para rodar dev environment
└── config.py           # Definições globais de ambiente
```

---

## 7. Decisões de Design

-   **Glassmorphism:** Escolhido para dar um aspecto premium e moderno, utilizando transparências e borrões (`backdrop-filter`).
-   **Responsividade Adaptativa:** A interface muda de um layout de sidebar (Desktop) para um layout de abas/dropdowns (Mobile).
-   **Performance Standalone:** A versão em `docs/` foi otimizada para ser extremamente rápida, carregando wordlists sob demanda para economizar largura de banda.

---
*Documento gerado automaticamente pelo assistente Antigravity em 24/02/2026.*
