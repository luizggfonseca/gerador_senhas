# 🔐 SecureGen — Dashboard de Gerenciamento de Senhas

[Português](#português) | [English](#english)

---

<a name="português"></a>

# 🇧🇷 Português

**SecureGen** é uma plataforma avançada e minimalista para a criação de segredos criptográficos de alta resistência. Reformulado com uma interface de **Página Única (Dashboard)**, o projeto foca em transparência, segurança matemática e experiência de usuário premium.

> **💡 O Diferencial:** Diferente de geradores comuns, o SecureGen permite que você defina a força desejada em **bits de entropia**, calculando automaticamente o comprimento necessário para garantir que sua senha seja virtualmente impossível de quebrar.

---

## 🚀 Interface Dashboard (Página Única)
A nova arquitetura permite acessar todos os métodos de geração simultaneamente. Chega de navegar por abas: todas as ferramentas estão ao alcance de um scroll rápido ou dos links de navegação superior.

### 🛠️ Métodos de Geração Disponíveis

1.  **🎲 Diceware Tradicional**
    *   **O que é:** Cria frases de segurança (passphrases) usando palavras aleatórias.
    *   **Idiomas:** Português e Inglês.
    *   **Foco:** Memorabilidade absoluta para senhas mestras.

2.  **⚙️ Diceware Modificado**
    *   **O que é:** A base do Diceware fortalecida com injeção de caracteres especiais e números.
    *   **Customização:** Escolha o separador, quantos símbolos incluir, quantas palavras capitalizar e o idioma (7 disponíveis).
    *   **Idiomas extras:** Espanhol, Francês, Italiano, Latim e Catalão.

3.  **⚡ Senha Clássica Aleatória**
    *   **O que é:** O padrão ouro de aleatoriedade total (maiúsculas, minúsculas, números e símbolos).
    *   **Modo Inteligente:** Defina a **Entropia Desejada** e o sistema ajustará o tamanho da senha para atingir esse nível de segurança.
    *   **Customização total:** Escolha exatamente quais símbolos usar e exclua caracteres ambíguos.

4.  **🔗 Identificadores & Chaves (Tokens)**
    *   **Hexadecimal:** Perfeito para chaves de API e segredos de sistema.
    *   **URL-Safe (Base64):** Identificadores seguros para serem passados em links.
    *   **UUID v4:** O padrão universal de identificadores únicos aleatórios (RFC 4122).

---

## ✨ Recursos de Segurança Premium

-   **📊 Cálculo de Entropia em Tempo Real:** Saiba exatamente quão forte é sua senha antes mesmo de usá-la.
-   **📜 Modal de Visualização Segura:** As senhas geradas são exibidas em um ambiente isolado com orientações de anotação offline.
-   **🛡️ CSPRNG:** Uso estrito de geradores de números aleatórios criptograficamente seguros (`secrets` no Python e `crypto.getRandomValues()` no JS).
-   **🎨 Design System Pro:** Interface construída com Glassmorphism, paleta de cores HSL harmonizada e suporte nativo a **Modo Escuro (Dark)** e **Modo Claro (Light)** com alto contraste.

---

## 🏗️ Arquitetura Técnica

O projeto utiliza uma estrutura modular e moderna:
-   **Backend:** FastAPI (Python 3.10+) — Responsável pelos algoritmos de entropia e geração via servidor.
-   **Frontend:** React 19 + Vite 7 — Interface responsiva de alta performance.
-   **Estilização:** CSS Vanilla Puro (Design System Próprio).

---

## 📦 Como Instalar e Rodar

### Pré-requisitos
- Python 3.10 ou superior.
- Node.js 18 ou superior.

### Rodando o Dashboard (Modo Completo)
Utilize o script automatizado na raiz do projeto:
```bash
./run_app.sh
```
*Este script cuidará de iniciar o backend e o frontend simultaneamente, garantindo que as portas 8000 e 5173 estejam sincronizadas.*

---

<a name="english"></a>

# 🇺🇸 English

**SecureGen** is an advanced, minimalist platform for creating high-resistance cryptographic secrets. Redesigned with a **Single-Page Dashboard** interface, the project focuses on transparency, mathematical security, and a premium user experience.

> **💡 The Difference:** Unlike common generators, SecureGen allows you to define the desired strength in **entropy bits**, automatically calculating the necessary length to ensure your password is virtually impossible to crack.

---

## 🚀 Dashboard Interface (Single Page)
The new architecture allows accessing all generation methods simultaneously. No more navigating through tabs: all tools are within reach of a quick scroll or the top navigation links.

### 🛠️ Available Generation Methods

1.  **🎲 Traditional Diceware**
    *   **What it is:** Creates passphrases using random words.
    *   **Languages:** Portuguese and English.
    *   **Focus:** Absolute memorability for master passwords.

2.  **⚙️ Modified Diceware**
    *   **What it is:** The Diceware base strengthened with special characters and number injection.
    *   **Customization:** Choose the separator, how many symbols to include, how many words to capitalize, and the language (7 available).
    *   **Extra Languages:** Spanish, French, Italian, Latin, and Catalan.

3.  **⚡ Classic Random Password**
    *   **What it is:** The gold standard of total randomness (uppercase, lowercase, numbers, and symbols).
    *   **Smart Mode:** Set the **Desired Entropy** and the system will adjust the password size to reach that security level.
    *   **Total Customization:** Choose exactly which symbols to use and exclude ambiguous characters.

4.  **🔗 Identifiers & Keys (Tokens)**
    *   **Hexadecimal:** Perfect for API keys and system secrets.
    *   **URL-Safe (Base64):** Identifiers safe to be passed in links.
    *   **UUID v4:** The universal standard for random unique identifiers (RFC 4122).

---

## ✨ Premium Security Features

-   **📊 Real-time Entropy Calculation:** Know exactly how strong your password is before you even use it.
-   **📜 Secure View Modal:** Generated passwords are displayed in an isolated environment with offline annotation guidance.
-   **🛡️ CSPRNG:** Strict use of cryptographically secure random number generators (`secrets` in Python and `crypto.getRandomValues()` in JS).
-   **🎨 Pro Design System:** Interface built with Glassmorphism, harmonized HSL color palette, and native support for **Dark Mode** and **Light Mode** with high contrast.

---

## 🏗️ Technical Architecture

The project uses a modular and modern structure:
-   **Backend:** FastAPI (Python 3.10+) — Responsible for entropy and server-side generation algorithms.
-   **Frontend:** React 19 + Vite 7 — High-performance responsive interface.
-   **Styling:** Pure Vanilla CSS (Proprietary Design System).

---

## 📦 How to Install and Run

### Prerequisites
- Python 3.10 or higher.
- Node.js 18 or higher.

### Running the Dashboard (Full Mode)
Use the automated script in the project root:
```bash
./run_app.sh
```
*This script will handle starting the backend and the frontend simultaneously, ensuring ports 8000 and 5173 are synchronized.*

---

© 2026 SecureGen. 🔒 No passwords leave your device.
