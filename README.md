# 🔐 SecureGen — Dashboard de Gerenciamento de Senhas

[Português](#português) | [English](#english)

---

<a name="português"></a>

# 🇧🇷 Português

**SecureGen** é uma plataforma avançada e minimalista para a criação de segredos criptográficos de alta resistência. Reformulado com uma interface de **Página Única (Dashboard)**, o projeto foca em transparência, segurança matemática e privacidade absoluta.

> **🛡️ Filosofia Zero Knowledge:** Diferente de outros geradores, o SecureGen **não salva, não loga e não armazena** nenhuma senha gerada. O sistema é completamente *stateless*: a senha existe apenas na sua tela enquanto você a anota. Ao fechar o modal, ela desaparece para sempre.

---

## 🚀 Interface Dashboard (Página Única)
A nova arquitetura permite acessar todos os métodos de geração simultaneamente. A interface conta com uma **Legenda Visual de Entropia** que indica instantaneamente a força da sua senha:
- 🔴 **Baixíssima** | 🟠 **Baixa** | 🟡 **Média** | 🟢 **Alta** | 🔵 **Altíssima** | 🟣 **Impossível**

### 🛠️ Métodos de Geração Disponíveis

1.  **🎲 Diceware** (Estatístico): Frases de segurança memoráveis.
2.  **⚡ Senha Clássica**: Aleatoriedade total (Alfanumérica + Símbolos).
3.  **🔗 Tokens**: Hexadecimal, URL-Safe e UUID v4.

---

## ✨ Recursos Premium

-   **📊 Cálculo Dinâmico de Entropia:** Defina a força desejada (bits) e o sistema calcula o comprimento exato necessário, evitando senhas desnecessariamente longas.
-   **📜 Modal de Visualização Segura:** Exibição isolada focada em anotação offline.
-   **🛡️ CSPRNG:** Uso estrito de geradores criptograficamente seguros no Python (`secrets`) e no navegador (`crypto`).
-   **🎨 Design System Pro:** Interface Glassmorphism com suporte nativo a **Modo Escuro** e **Modo Claro**.

---

## 🏗️ Arquitetura Técnica

O projeto utiliza uma estrutura modular preparada para nuvem:
-   **Backend:** FastAPI (Python 3.10+) residente na pasta `/api` (padrão Serverless).
-   **Frontend:** React 19 + Vite 7 — Interface de alta performance.
-   **Deploy:** Configurado para **Vercel** via `vercel.json`.

---

## 📦 Como Instalar e Rodar

### Modo Local (Desenvolvimento)
Utilize o script automatizado:
```bash
./run_app.sh
```

### Modo Produção (Vercel)
O projeto está pronto para o deploy na Vercel:
1. Conecte seu repositório à Vercel.
2. Framework Preset: `Vite`.
3. Build Command: `cd frontend && npm install && npm run build`.
4. Output Directory: `frontend/dist`.
5. Install Command (Python): `pip install -r requirements.txt`.

---

<a name="english"></a>

# 🇺🇸 English

**SecureGen** is an advanced, minimalist platform for creating high-resistance cryptographic secrets. Redesigned with a **Single-Page Dashboard** interface, the project focuses on transparency, mathematical security, and absolute privacy.

> **🛡️ Zero Knowledge Philosophy:** Unlike other generators, SecureGen **does not save, log, or store** any generated password. The system is completely *stateless*: the password exists only on your screen while you write it down. Once the modal is closed, it's gone forever.

---

## 🚀 Dashboard Interface (Single Page)
The new architecture allows accessing all generation methods simultaneously. The interface features a **Visual Entropy Legend** that instantly indicates your password strength:
- 🔴 **Very Low** | 🟠 **Low** | 🟡 **Medium** | 🟢 **High** | 🔵 **Very High** | 🟣 **Impossible**

### 🛠️ Available Generation Methods

1.  **🎲 Diceware**: Memorable passphrases.
2.  **⚡ Classic Password**: Total randomness (Alphanumeric + Symbols).
3.  **🔗 Tokens**: Hexadecimal, URL-Safe, and UUID v4.

---

## ✨ Premium Features

-   **📊 Dynamic Entropy Calculation:** Set the desired strength (bits) and the system calculates the exact length needed.
-   **🎨 Pro Design System:** Glassmorphism UI with native **Dark Mode** and **Light Mode** support.
-   **🏗️ Serverless Ready:** Structured for seamless deployment on Vercel.

---

© 2026 SecureGen. 🔒 No passwords leave your device.
