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
    }
};
