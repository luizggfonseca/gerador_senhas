# 🔐 SecureGen — Advanced Cryptographic Password Dashboard

[Português](#português) | [English](#english)

---

<a name="português"></a>

# 🇧🇷 Português

**SecureGen** é um ecossistema de engenharia criptográfica projetado para gerar segredos de alta resistência com precisão matemática. Diferente de geradores convencionais, o SecureGen utiliza uma arquitetura **stateless** e **zero-knowledge**, operando sob o princípio de que a segurança máxima reside naquilo que nunca é armazenado.

## 🚀 Interface de Telas Flutuantes (Floating Screens)
O dashboard utiliza um sistema de **Acordeão Inteligente** com estética *Glassmorphism*. Cada método de geração funciona como uma tela isolada que se expande para personalização técnica, mantendo o ambiente limpo e focado.
- **Design de Alta Fidelidade:** Uso de *Layering Shadows* (sombras em camadas) e *Inner Glow* para profundidade visual.
- **Legenda de Força Automatizada:** Feedback instântaneo baseado em bits de entropia.
  - 🔴 **Baixíssima** (< 28 bits) | 🟠 **Baixa** | 🟡 **Média** | 🟢 **Alta** | 🔵 **Altíssima** | 🟣 **Impossível** (> 128 bits)

## 🛠️ Modelos de Geração e Algoritmos

O SecureGen implementa 12 modelos especializados para diferentes necessidades de segurança:

1.  **🎲 Diceware (Clássico & Personalizado):** Utiliza a lógica de dados físicos para selecionar palavras de listas auditadas (7.776 palavras). Suporta múltiplos idiomas e inserção de símbolos/números.
2.  **⚡ Senha Aleatória Clássica:** Aleatoriedade pura via CSPRNG (Cryptographically Secure Pseudo-Random Number Generator). Permite exclusão de caracteres ambíguos.
3.  **🔑 Tokens Estruturados:** API Keys em **Hexadecimal**, **URL-Safe (Base64)** e o padrão **UUID v4** (padrão RFC 4122).
4.  **🛡️ ProtonPass Style:** Gera senhas seguindo o padrão de blocos intercalados (Letras-Números-Letras), otimizando a memorização sem sacrificar a entropia.
5.  **🆔 Identificadores Modernos:**
    - **ULID:** Identificadores de 128 bits ordenáveis por tempo (Crockford's Base32).
    - **NanoID:** Compacto e mais seguro que o UUID para ambientes web.
6.  **🗣️ Senha Fonética (FIPS-181):** Gera sequências pronunciáveis baseadas em regras fonéticas militares, ideal para senhas ditadas.
7.  **🏗️ Alta Entropia Alfanumérica (HEA):** Otimizado para Master Passwords, garantindo distribuição estatística perfeita.
8.  **🔢 PIN Numérico:** Sequências de dígitos de alta resistência (4 até 50 dígitos).

## 📊 Matemática da Entropia
O SecureGen não utiliza apenas "comprimento". Ele calcula a **Entropia de Shannon**:
> $E = L \cdot \log_2(R)$
> Onde **L** é o comprimento e **R** é o tamanho do pool de caracteres.
O sistema permite que você defina a entropia desejada (ex: 128 bits para nível bancário) e ele calcula automaticamente o comprimento necessário baseado no pool selecionado.

## 🏗️ Arquitetura de Software
- **Isolamento de Estado:** O Backend instancias os geradores "sob demanda" a cada requisição HTTP. Isso elimina vazamentos de memória e garante que configurações de uma senha (ex: símbolos) nunca persistam para a próxima.
- **Backend:** Flask/Python 3.10+ utilizando a biblioteca `secrets` (segurança nível kernel).
- **Frontend:** React 19 + Vite 7, garantindo renderização ultra-rápida.
- **Segurança:** CSP (Content Security Policy) estrito e ausência de logs no servidor.

---

<a name="english"></a>

# 🇺🇸 English

**SecureGen** is a cryptographic engineering ecosystem designed to generate high-resistance secrets with mathematical precision. Unlike conventional generators, SecureGen uses a **stateless** and **zero-knowledge** architecture, operating under the principle that maximum security lies in what is never stored.

## 🚀 Floating Screens Interface
The dashboard utilizes an **Intelligent Accordion System** with *Glassmorphism* aesthetics. Each generation method acts as an isolated screen that expands for technical customization, keeping the environment clean and focused.
- **High-Fidelity Design:** Use of *Layering Shadows* and *Inner Glow* for visual depth.
- **Automated Strength Legend:** Instant feedback based on entropy bits.
  - 🔴 **Very Low** | 🟠 **Low** | 🟡 **Medium** | 🟢 **High** | 🔵 **Very High** | 🟣 **Impossible**

## 🛠️ Generation Models & Algorithms

SecureGen implements 12 specialized models for different security needs:

1.  **🎲 Diceware (Classic & Custom):** Uses dice-roll logic to select words from audited lists (7,776 words). Supports multiple languages and symbol/number injection.
2.  **⚡ Classic Random:** Pure randomness via CSPRNG (Cryptographically Secure Pseudo-Random Number Generator). Allows exclusion of ambiguous characters.
3.  **🔑 Structured Tokens:** API Keys in **Hexadecimal**, **URL-Safe (Base64)**, and **UUID v4** (RFC 4122 standard).
4.  **🛡️ ProtonPass Style:** Generates passwords following an interleaved block pattern (Letters-Numbers-Letters), optimizing memorability without sacrificing entropy.
5.  **🆔 Modern Identifiers:**
    - **ULID:** 128-bit time-sortable identifiers (Crockford's Base32).
    - **NanoID:** Compact and more secure than UUID for web environments.
6.  **🗣️ Phonetic Password (FIPS-181):** Generates pronounceable sequences based on military phonetic rules, ideal for dictated passwords.
7.  **🏗️ High-Entropy Alphanumeric (HEA):** Optimized for Master Passwords, ensuring perfect statistical distribution.
8.  **🔢 Numeric PIN:** High-resistance digit sequences (from 4 up to 50 digits).

## 📊 Entropy Mathematics
SecureGen doesn't just use "length." It calculates **Shannon Entropy**:
> $E = L \cdot \log_2(R)$
> Where **L** is the sequence length and **R** is the character pool size.
The system allows you to set the desired entropy (e.g., 128 bits for banking-grade security), and it automatically calculates the necessary length based on the selected pool.

## 🏗️ Software Architecture
- **State Isolation:** The Backend instantiates generators "on-demand" for every HTTP request. This eliminates memory leaks and ensures that settings from one password (e.g., custom symbols) never persist to the next.
- **Backend:** Flask/Python 3.10+ using the `secrets` library (kernel-level security).
- **Frontend:** React 19 + Vite 7, ensuring ultra-fast rendering.
- **Security:** Strict CSP (Content Security Policy) and zero server-side logging.

---

© 2026 SecureGen. 🔒 *Mathematical security for the modern age.*
