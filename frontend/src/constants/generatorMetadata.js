/**
 * Metadados detalhados para cada tipo de geração, incluindo justificativas e indicações.
 */
export const GENERATOR_METADATA = {
    'diceware_modified': {
        title: 'Diceware',
        use_case: 'Logins corporativos (Active Directory), sistemas bancários ou formulários web antigos que você precisa digitar manualmente com frequência.',
        justification: 'Ideal para contornar políticas de senha engessadas ou obsoletas que exigem caracteres especiais obrigatórios, mantendo a base memorizável do método Diceware.'
    },
    'random_classic:classic': {
        title: 'Senha aleatória',
        use_case: 'Todas as contas online rotineiras delegadas a um gerenciador de senhas, credenciais de acesso a bancos de dados e senhas de administração de roteadores.',
        justification: 'Projetada exclusivamente para leitura e armazenamento por máquinas. Possui a maior densidade de entropia por caractere, sendo virtualmente imune a ataques de dicionário, mas impossível de ser memorizada em larga escala.'
    },
    'random_classic:token:hex': {
        title: 'Token/API Key Hexadecimal',
        use_case: 'Salts criptográficos, chaves de API internas, hashes (como SHA-256), identificadores de transação e chaves de criptografia simétrica (AES).',
        justification: 'Composto apenas por 0-9 e a-f, evita caracteres visivelmente ambíguos (como O e 0, l e I) e não requer encoding especial em requisições. É à prova de falhas de formatação entre diferentes linguagens de programação.'
    },
    'random_classic:token:urlsafe': {
        title: 'URL (base64)',
        use_case: 'Tokens de sessão HTTP, magic links (links de redefinição de senha ou login sem senha), tokens CSRF e componentes de JWT (JSON Web Tokens).',
        justification: 'Oculta caracteres problemáticos em URLs (como +, / e =). Permite o tráfego seguro de alta densidade de bytes via métodos GET ou em cabeçalhos HTTP sem o risco de o servidor quebrar ou corromper a string.'
    },
    'random_classic:token:uuid': {
        title: 'UUID (v4)',
        use_case: 'Chaves primárias (PK) em bancos de dados distribuídos (NoSQL e SQL), identificadores únicos de recursos em APIs (ex: api/v1/users/{uuid}), correlação de logs e identificação de sessões anônimas de usuários.',
        justification: 'Gera identificadores com risco de colisão matematicamente desprezível sem depender de um servidor central para controle de incremento. Nota de segurança: Não deve ser usado como token de autenticação ou segredo criptográfico, pois sua aleatoriedade (dependendo da implementação) pode não ser criptograficamente segura.'
    },
    'advanced:proton': {
        title: 'ProtonPass Style',
        use_case: 'Senhas de uso frequente que precisam equilibrar segurança alta com facilidade de digitação manual (ex: logins rápidos).',
        justification: 'Intercala blocos de caracteres e números com hifens, tornando a leitura e digitação muito mais amigável ao olho humano do que uma sequência aleatória contínua.'
    },
    'advanced:nanoid': {
        title: 'NanoID',
        use_case: 'Identificadores para Objetos na Web (links curtos, IDs de postagens) que precisam ser extremamente compactos e seguros.',
        justification: 'Mais curto, mais rápido e mais seguro que o UUID v4. Usa um alfabeto maior e um algoritmo melhor distribuído, sendo o padrão atual para desenvolvimento web moderno.'
    },
};
