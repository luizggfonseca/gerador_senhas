import { createPortal } from 'react-dom';

/**
 * ModalSeguranca — Exibe a senha gerada com foco total na segurança e anotação manual.
 * Metadados detalhados foram movidos para o Manual Técnico (botão AJUDA).
 */
export default function ModalSeguranca({ result, metadata, onClose, onGenerate }) {
    if (!result || !metadata) return null;

    return createPortal(
        <div className="modal-overlay animate-fade-in">
            <div className="modal-content animate-scale-in">
                <div className="modal-header">
                    <h3 className="modal-title">{metadata.title}</h3>
                </div>

                <div className="modal-password-box">
                    <p className="modal-password-text" style={{ color: 'var(--text-primary)' }}>
                        {result.password}
                    </p>
                </div>

                <div className="modal-info-grid" style={{ marginBottom: '1.5rem' }}>
                    <div className="modal-info-item">
                        <span className="modal-info-label">Força da Senha (Entropia)</span>
                        <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>
                            {result.entropy_label} ({result.entropy.toFixed(1)} bits)
                        </p>
                    </div>
                </div>

                <div className="modal-warning" style={{ background: 'rgba(114, 47, 55, 0.15)', borderColor: 'var(--accent)' }}>
                    <svg style={{ width: '24px', flexShrink: 0, marginTop: '2px', color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                        <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--accent)', fontSize: '0.9rem' }}>📍 AÇÃO NECESSÁRIA:</strong>
                        Por segurança, esta senha <strong>deve ser anotada manualmente</strong> em um papel ou cofre físico.
                        Cópia desabilitada para evitar rastros.
                    </p>
                </div>

                <p style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '1rem', opacity: 0.7 }}>
                    Para mais detalhes técnicos, consulte o <a href="/manual.html" target="_blank" style={{ color: 'var(--accent)', fontWeight: 600 }}>Manual de Ajuda</a>.
                </p>

                <div className="modal-footer" style={{ marginTop: '1.5rem', flexDirection: 'column', gap: '0.75rem' }}>
                    <button
                        onClick={onGenerate}
                        className="btn btn-secondary"
                        style={{ width: '100%', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    >
                        Gerar Outra Senha
                    </button>
                    <button
                        onClick={onClose}
                        className="btn btn-generate"
                        style={{ width: '100%', padding: '0.8rem' }}
                    >
                        Concluído e Anotado
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
