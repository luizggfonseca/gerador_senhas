# 🔐 SecureGen — Gerador de Senhas / Password Generator

[Português](#português) | [English](#english)

---

<a name="português"></a>

# 🇧🇷 Português

Aplicação web para geração de senhas fortes e seguras, diretamente no navegador. Nenhum dado sai do seu dispositivo.

> **Acesse online:** [GitHub Pages](https://luizggfonseca.github.io/gerador_senhas/)

## ✨ Funcionalidades

| Gerador | Descrição |
|---------|-----------|
| **Diceware Puro** | Passphrase com palavras aleatórias de listas em 7 idiomas |
| **Diceware Modificado** | Passphrase com capitalização, números e símbolos configuráveis |
| **Aleatório Clássico** | Senha com pool customizável (maiúsculas, minúsculas, números, símbolos) |
| **Token Hex** | String hexadecimal de comprimento configurável |
| **Token URL-Safe** | String Base64 segura para URLs |
| **UUID v4** | Identificador universalmente único (122 bits de entropia) |

### Recursos adicionais

- 🎲 **7 wordlists Diceware** — Português, Inglês, Espanhol, Francês, Italiano, Latim e Catalão
- 🌍 **Modo "Todos (Mistura)"** — Combina todas as wordlists em uma única lista
- 📊 **Cálculo de entropia** — Mostra a força real da senha em bits
- 🎨 **Interface dark premium** — Design moderno com glassmorphism e micro-animações
- 📖 **Manual de uso integrado** — Guia colapsável explicando cada gerador
- 📱 **Responsivo** — Funciona em desktop e dispositivos móveis
- 🔒 **100% local** — Toda geração usa `crypto.getRandomValues()` (CSPRNG)

## 🏗️ Arquitetura do Projeto

O SecureGen utiliza uma arquitetura híbrida otimizada:

1.  **Modo Standalone (Produção):** Localizado na pasta `docs/`, executa inteiramente no client-side (JS puro).
2.  **Modo Dev (Client-Server):** Backend em **FastAPI (Python)** e Frontend em **React 19 (Vite 7)**.

Para detalhes técnicos profundos, consulte a [Documentação de Arquitetura](./DOCUMENTACAO_ARQUITETURA.md).

## 🚀 Como Usar

### Opção 1: Online (recomendado)
Acesse diretamente: **https://luizggfonseca.github.io/gerador_senhas/**

### Opção 2: Localmente (Backend + React)
```bash
# Backend
pip install -r requirements.txt
python3 -m uvicorn backend.main:app --port 8000

# Frontend
cd frontend && npm install && npm run dev
```

## 🔒 Segurança
- Geração local via `crypto.getRandomValues()` ou módulo `secrets` (Python).
- Nenhuma senha é enviada para servidores externos.
- CORS restrito a localhost em ambiente de desenvolvimento.

---

<a name="english"></a>

# 🇺🇸 English

Web application for generating strong and secure passwords, directly in your browser. No data leaves your device.

> **Access online:** [GitHub Pages](https://luizggfonseca.github.io/gerador_senhas/)

## ✨ Features

| Generator | Description |
|-----------|-------------|
| **Pure Diceware** | Passphrase with random words from lists in 7 languages |
| **Modified Diceware** | Passphrase with configurable capitalization, numbers, and symbols |
| **Classic Random** | Password with customizable pool (uppercase, lowercase, numbers, symbols) |
| **Hex Token** | Hexadecimal string of configurable length |
| **URL-Safe Token** | URL-safe Base64 string |
| **UUID v4** | Universally Unique Identifier (122 bits of entropy) |

### Additional Resources

- 🎲 **7 Diceware wordlists** — Portuguese, English, Spanish, French, Italian, Latin, and Catalan
- 🌍 **"All (Mix)" Mode** — Combines all wordlists into a single list
- 📊 **Entropy Calculation** — Shows the real password strength in bits
- 🎨 **Premium Dark Interface** — Modern design with glassmorphism and micro-animations
- 📖 **Integrated User Manual** — Collapsible guide explaining each generator
- 📱 **Responsive** — Works on desktop and mobile devices
- 🔒 **100% Local** — All generation uses `crypto.getRandomValues()` (CSPRNG)

## 🏗️ Project Architecture

SecureGen uses an optimized hybrid architecture:

1.  **Standalone Mode (Production):** Located in the `docs/` folder, runs entirely client-side (Vanilla JS).
2.  **Dev Mode (Client-Server):** Backend in **FastAPI (Python)** and Frontend in **React 19 (Vite 7)**.

For deep technical details, see the [Architecture Documentation](./DOCUMENTACAO_ARQUITETURA.md).

## 🚀 How to Use

### Option 1: Online (Recommended)
Access directly: **https://luizggfonseca.github.io/gerador_senhas/**

### Option 2: Locally (Backend + React)
```bash
# Backend
pip install -r requirements.txt
python3 -m uvicorn backend.main:app --port 8000

# Frontend
cd frontend && npm install && npm run dev
```

## 🔒 Security
- Local generation via `crypto.getRandomValues()` or Python's `secrets` module.
- No passwords are sent to external servers.
- CORS restricted to localhost in development environments.

---

© 2026 SecureGen. No passwords leave your device.
