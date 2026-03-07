import { createPortal } from 'react-dom';

/**
 * ModalManual — Exibe o manual técnico e de segurança em um popup.
 */
export default function ModalManual({ isOpen, onClose }) {
    if (!isOpen) return null;

    const manualData = [
        {
            title: "Diceware Modificado",
            usage: "Logins corporativos (Active Directory), sistemas bancários ou formulários web antigos que você precisa digitar manualmente com frequência.",
            justification: "Ideal para contornar políticas de senha engessadas ou obsoletas que exigem caracteres especiais obrigatórios, mantendo a base memorizável do método Diceware."
        },
        {
            title: "Senha Clássica Aleatória",
            usage: "Todas as contas online rotineiras delegadas a um gerenciador de senhas, credenciais de acesso a bancos de dados e senhas de administração de roteadores.",
            justification: "Projetada exclusivamente para leitura e armazenamento por máquinas. Possui a maior densidade de entropia por caractere, sendo virtualmente imune a ataques de dicionário, mas impossível de ser memorizada em larga escala."
        },
        {
            title: "Token Hexadecimal (Base16)",
            usage: "Salts criptográficos, chaves de API internas, hashes (como SHA-256), identificadores de transação e chaves de criptografia simétrica (AES).",
            justification: "Composto apenas por 0-9 e a-f, evita caracteres visivelmente ambíguos (como O e 0, l e I) e não requer encoding especial em requisições. É à prova de falhas de formatação entre diferentes linguagens de programação."
        },
        {
            title: "Token URL (Base64 URL-safe)",
            usage: "Tokens de sessão HTTP, magic links (links de redefinição de senha ou login sem senha), tokens CSRF e componentes de JWT (JSON Web Tokens).",
            justification: "Oculta caracteres problemáticos em URLs (como +, / e =). Permite o tráfego seguro de alta densidade de bytes via métodos GET ou em cabeçalhos HTTP sem o risco de o servidor quebrar ou corromper a string."
        },
        {
            title: "UUID (v4)",
            usage: "Chaves primárias (PK) em bancos de dados distribuídos (NoSQL e SQL), identificadores únicos de recursos em APIs (ex: api/v1/users/{uuid}), correlação de logs e identificação de sessões anônimas de usuários.",
            justification: "Gera identificadores com risco de colisão matematicamente desprezível sem depender de um servidor central para controle de incremento. Nota de segurança: Não deve ser usado como token de autenticação ou segredo criptográfico."
        }
    ];

    return createPortal(
        <div className="modal-overlay animate-fade-in" onClick={onClose}>
            <div className="modal-content animate-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '90vh' }}>
                <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="modal-title">Manual de Segurança</h3>
                    <button onClick={onClose} className="btn-close" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                </div>

                <div className="modal-body" style={{ overflowY: 'auto', paddingRight: '0.5rem' }}>
                    <p className="app-subtitle" style={{ marginBottom: '1.5rem' }}>Entenda os métodos de geração e suas aplicações ideais.</p>

                    {manualData.map((item, index) => (
                        <div key={index} className="manual-item" style={{ marginBottom: '2rem', borderBottom: index !== manualData.length - 1 ? '1px solid var(--border)' : 'none', paddingBottom: '1rem' }}>
                            <h4 style={{ color: 'var(--accent)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>{item.title}</h4>

                            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Indicação de Uso</span>
                            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{item.usage}</p>

                            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Justificativa Técnica</span>
                            <p style={{ fontStyle: 'italic', fontSize: '0.85rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid var(--accent)' }}>
                                {item.justification}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="modal-footer" style={{ marginTop: '1rem' }}>
                    <button onClick={onClose} className="btn btn-secondary" style={{ width: '100%' }}>Fechar Manual</button>
                </div>
            </div>
        </div>,
        document.body
    );
}
