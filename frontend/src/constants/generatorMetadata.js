/**
 * Metadados detalhados para cada tipo de geração, incluindo justificativas e indicações.
 */
export const GENERATOR_METADATA = {
    'diceware_pure': {
        title: 'Diceware Puro (Lista Padrão)',
        use_case: 'Senhas mestras de gerenciadores de senhas (como Bitwarden, KeePass), chaves de criptografia de disco (LUKS, FileVault, BitLocker) e chaves privadas PGP/SSH.',
        justification: 'É projetado para o cérebro humano. Oferece altíssima entropia matemática (usando 5 a 7 palavras) e resistência contra ataques de força bruta, mantendo uma curva de memorização e digitação fluida para acessos diários.'
    },
    'diceware_modified': {
        title: 'Diceware Modificado (Com maiúsculas, símbolos e números)',
        use_case: 'Logins corporativos (Active Directory), sistemas bancários ou formulários web antigos que você precisa digitar manualmente com frequência.',
        justification: 'Ideal para contornar políticas de senha engessadas ou obsoletas que exigem caracteres especiais obrigatórios, mantendo a base memorizável do método Diceware.'
    },
    'random_classic:classic': {
        title: 'Senha Clássica Aleatória (Símbolos, números, maiúsculas)',
        use_case: 'Todas as contas online rotineiras delegadas a um gerenciador de senhas, credenciais de acesso a bancos de dados e senhas de administração de roteadores.',
        justification: 'Projetada exclusivamente para leitura e armazenamento por máquinas. Possui a maior densidade de entropia por caractere, sendo virtualmente imune a ataques de dicionário, mas impossível de ser memorizada em larga escala.'
    },
    'random_classic:token:hex': {
        title: 'Token Hexadecimal (Base16)',
        use_case: 'Salts criptográficos, chaves de API internas, hashes (como SHA-256), identificadores de transação e chaves de criptografia simétrica (AES).',
        justification: 'Composto apenas por 0-9 e a-f, evita caracteres visivelmente ambíguos (como O e 0, l e I) e não requer encoding especial em requisições. É à prova de falhas de formatação entre diferentes linguagens de programação.'
    },
    'random_classic:token:urlsafe': {
        title: 'Token URL (Base64 URL-safe)',
        use_case: 'Tokens de sessão HTTP, magic links (links de redefinição de senha ou login sem senha), tokens CSRF e componentes de JWT (JSON Web Tokens).',
        justification: 'Oculta caracteres problemáticos em URLs (como +, / e =). Permite o tráfego seguro de alta densidade de bytes via métodos GET ou em cabeçalhos HTTP sem o risco de o servidor quebrar ou corromper a string.'
    },
    'random_classic:token:uuid': {
        title: 'UUID (v4)',
        use_case: 'Chaves primárias (PK) em bancos de dados distribuídos (NoSQL e SQL), identificadores únicos de recursos em APIs (ex: api/v1/users/{uuid}), correlação de logs e identificação de sessões anônimas de usuários.',
        justification: 'Gera identificadores com risco de colisão matematicamente desprezível sem depender de um servidor central para controle de incremento. Nota de segurança: Não deve ser usado como token de autenticação ou segredo criptográfico, pois sua aleatoriedade (dependendo da implementação) pode não ser criptograficamente segura.'
    },
    'advanced:high_entropy': {
        title: 'Alfanumérica High-Entropy',
        use_case: 'Sistemas que exigem segurança máxima contra força bruta mas não aceitam símbolos (ex: terminais mainframe, sistemas bancários legados).',
        justification: 'Focada em entropia máxima usando apenas caracteres alfanuméricos (letras e números), garantindo que cada caractere contribua significativamente para a segurança sem quebrar formulários sensíveis a símbolos.'
    },
    'advanced:consonants': {
        title: 'Apenas Consoantes',
        use_case: 'Identificadores de sistema ou códigos de cupom onde se deseja evitar a formação acidental de palavras reais ou ofensivas.',
        justification: 'Ao remover vogais, a probabilidade de gerar sequências que soem como palavras existentes cai drasticamente, sendo ideal para códigos públicos ou de atendimento.'
    },
    'advanced:proton': {
        title: 'ProtonPass Style',
        use_case: 'Senhas de uso frequente que precisam equilibrar segurança alta com facilidade de digitação manual (ex: logins rápidos).',
        justification: 'Intercala blocos de caracteres e números com hifens, tornando a leitura e digitação muito mais amigável ao olho humano do que uma sequência aleatória contínua.'
    },
    'advanced:pin': {
        title: 'PIN Numérico',
        use_case: 'Códigos de acesso de 4, 6 ou 8 dígitos para cartões bancários, travas de tela de dispositivos móveis ou cofres físicos.',
        justification: 'Gerador puramente numérico com distribuição aleatória uniforme, garantindo que o seu PIN não seja uma data de aniversário ou sequência óbvia.'
    },
    'advanced:ulid': {
        title: 'ULID (Universally Unique Lexicographically Sortable Identifier)',
        use_case: 'Substituto moderno para o UUID em bancos de dados onde a ordem de inserção (tempo) é importante para performance e indexação.',
        justification: 'Combina timestamp (48 bits) com aleatoriedade (80 bits). Diferentemente do UUID, os ULIDs são ordenáveis por tempo, o que evita a fragmentação de índices em bancos como PostgreSQL ou MySQL.'
    },
    'advanced:nanoid': {
        title: 'NanoID',
        use_case: 'Identificadores para Objetos na Web (links curtos, IDs de postagens) que precisam ser extremamente compactos e seguros.',
        justification: 'Mais curto, mais rápido e mais seguro que o UUID v4. Usa um alfabeto maior e um algoritmo melhor distribuído, sendo o padrão atual para desenvolvimento web moderno.'
    },
    'advanced:fips181': {
        title: 'Algoritmo FIPS-181 (Phonetic)',
        use_case: 'Senhas temporárias que precisam ser ditas por voz (suporte técnico) ou memorizadas rapidamente por um curto período.',
        justification: 'Usa um algoritmo baseado em silabação fonética. As senhas parecem palavras de "outro idioma", sendo fáceis de pronunciar e ouvir, mas sem significado real.'
    },
    'advanced:bubble_babble': {
        title: 'Bubble Babble Encoding',
        use_case: 'Representação legível de impressões digitais (fingerprints) de chaves SSH ou hashes de arquivos que precisam ser verificadas visualmente.',
        justification: 'Transforma dados binários em uma sequência de sons "borbulhantes" fáceis de comparar visualmente. É muito mais amigável ao olho humano do que comparar longas strings hexadecimais.'
    }
};
