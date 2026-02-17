# 🔐 Gerador de Senhas

Aplicação local para geração de senhas seguras com múltiplos algoritmos (Diceware e Aleatório), interface web moderna e API REST.

## ✨ Funcionalidades

- **Diceware Puro** — Passphrase com palavras de listas em 7 idiomas
- **Diceware Modificado** — Passphrase com capitalização, números e símbolos inseridos
- **Aleatório/Token** — Senhas clássicas, tokens hexadecimais, URL-safe e UUID
- **Cálculo de Entropia** — Exibição da força da senha em bits
- **Cofre Criptografado** — Módulo vault com AES-256-GCM + PBKDF2 (200k iterações)
- **Histórico** — Últimas senhas geradas com suporte a tags

## 🏗️ Arquitetura

```
senhas/
├── backend/              → API FastAPI (endpoints REST)
├── banco_dados/          → 7 listas Diceware (pt, en, es, fr, it, la, ca)
├── core/                 → Cálculo de entropia e utilitários criptográficos
├── diceware/             → Loader, gerador e formatador Diceware
├── frontend/             → App React 19 + Vite 7 (dark theme)
├── password_generators/  → Geradores: Diceware Puro, Modificado, Aleatório
├── vault/                → Cofre criptografado (AES-GCM)
├── config.py             → Configurações globais
├── run_app.sh            → Script de inicialização
└── requirements.txt      → Dependências Python
```

## 🚀 Como Rodar

### Pré-requisitos

- Python 3.10+
- Node.js 18+
- npm

### Instalação

```bash
# 1. Clonar / entrar na pasta
cd senhas

# 2. Ambiente virtual Python
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# 3. Frontend
cd frontend
npm install
cd ..
```

### Executar

```bash
# Opção 1: Script automático
chmod +x run_app.sh
./run_app.sh

# Opção 2: Manual
# Terminal 1 (Backend)
PYTHONPATH=. .venv/bin/uvicorn backend.main:app --port 8000

# Terminal 2 (Frontend)
cd frontend && npm run dev
```

Acesse: **http://localhost:5173**

## 🔒 Segurança

- Todas as senhas são geradas localmente usando `secrets` (CSPRNG)
- Nenhum dado trafega para servidores externos
- O módulo vault usa AES-256-GCM com derivação de chave PBKDF2 (200k iterações SHA-256)
- Fonte de aleatoriedade: `/dev/urandom` (via `os.urandom`)

## 📋 Listas Diceware

Coloque os arquivos de listas em `./banco_dados/`:

| Arquivo         | Idioma     |
|-----------------|------------|
| `portugues.txt` | Português  |
| `espanhol.txt`  | Espanhol   |
| `italiano.txt`  | Italiano   |
| `frances.txt`   | Francês    |
| `latim.txt`     | Latim      |
| `ingles.txt`    | Inglês     |
| `catalao.txt`   | Catalão    |

Formato: uma linha por entrada no formato `12345 palavra`

## ⚙️ Tecnologias

| Camada    | Stack                               |
|-----------|-------------------------------------|
| Frontend  | React 19, Vite 7, Vanilla CSS      |
| Backend   | FastAPI, Uvicorn, Pydantic          |
| Crypto    | cryptography (AES-256-GCM, PBKDF2) |
| RNG       | secrets (CSPRNG)                    |
