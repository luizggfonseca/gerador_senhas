# 🔐 SecureGen — Gerador de Senhas

Aplicação web para geração de senhas fortes e seguras, diretamente no navegador. Nenhum dado sai do seu dispositivo.

> **Acesse online:** [GitHub Pages](https://luizggfonseca.github.io/gerador_senhas/)

---

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

---

## 🚀 Como Usar

### Opção 1: Online (recomendado)

Acesse diretamente pelo GitHub Pages — sem instalação:

🔗 **https://luizggfonseca.github.io/gerador_senhas/**

### Opção 2: Localmente com servidor

```bash
# Clonar o repositório
git clone https://github.com/luizggfonseca/gerador_senhas.git
cd gerador_senhas

# Servir localmente (qualquer servidor HTTP)
npx -y serve docs
# ou
python3 -m http.server 8000 -d docs
```

> ⚠️ **Nota:** Abrir o `index.html` diretamente via `file://` não carrega as wordlists Diceware (limitação de CORS do navegador). Use um servidor HTTP local ou acesse via GitHub Pages.

### Opção 3: Backend + Frontend React (desenvolvimento)

```bash
# Ambiente virtual Python
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Backend
PYTHONPATH=. .venv/bin/uvicorn backend.main:app --port 8000

# Frontend (em outro terminal)
cd frontend && npm install && npm run dev
```

---

## 🏗️ Estrutura do Projeto

```
senhas/
├── docs/                 → Versão web standalone (GitHub Pages)
│   ├── index.html        → Aplicação completa (HTML + CSS + JS)
│   └── wordlists/        → 7 listas Diceware
├── backend/              → API FastAPI (endpoints REST)
├── banco_dados/          → Listas Diceware originais
├── core/                 → Cálculo de entropia e utilitários
├── diceware/             → Loader, gerador e formatador Diceware
├── frontend/             → App React 19 + Vite 7 (dark theme)
├── password_generators/  → Geradores: Diceware Puro, Modificado, Aleatório
├── config.py             → Configurações globais
├── run_app.sh            → Script de inicialização (backend + frontend)
└── requirements.txt      → Dependências Python
```

---

## 🔒 Segurança

- Todas as senhas são geradas **localmente** no navegador
- Nenhum dado trafega para servidores externos
- Fonte de aleatoriedade: `crypto.getRandomValues()` (CSPRNG do sistema operacional)
- Versão Python usa `secrets` (`/dev/urandom` via `os.urandom`)

---

## 📋 Wordlists Diceware

| Arquivo         | Idioma     | Formato |
|-----------------|------------|---------|
| `portugues.txt` | Português  | `12345 palavra` |
| `ingles.txt`    | Inglês     | `12345 palavra` |
| `espanhol.txt`  | Espanhol   | `12345 palavra` |
| `frances.txt`   | Francês    | `12345 palavra` |
| `italiano.txt`  | Italiano   | `12345 palavra` |
| `latim.txt`     | Latim      | `12345 palavra` |
| `catalao.txt`   | Catalão    | `12345 palavra` |

---

## ⚙️ Tecnologias

| Camada         | Stack                                    |
|----------------|------------------------------------------|
| Web Standalone | HTML5, Vanilla CSS, JavaScript (ES2020+) |
| Frontend Dev   | React 19, Vite 7, Vanilla CSS            |
| Backend Dev    | FastAPI, Uvicorn, Pydantic               |
| RNG            | crypto.getRandomValues() / secrets       |

---

## 📄 Licença

Projeto pessoal de uso educacional.

© 2026 SecureGen. Nenhuma senha sai do seu dispositivo.
