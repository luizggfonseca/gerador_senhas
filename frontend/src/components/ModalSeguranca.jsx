import { createPortal } from 'react-dom';
import { useEffect } from 'react';

/**
 * ModalSeguranca — Exibe a senha gerada com foco total na segurança e anotação manual.
 * Metadados detalhados foram movidos para o Manual Técnico (botão AJUDA).
 */
export default function ModalSeguranca({ result, metadata, onClose, onGenerate }) {
    useEffect(() => {
        if (!result) return;

        // Bloqueio de eventos de cópia e menu sensível
        const preventCopy = (e) => {
            e.preventDefault();
            return false;
        };

        const handleKeyDown = (e) => {
            // Bloqueia Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+U (ver código fonte)
            if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'u' || e.key === 'i')) {
                e.preventDefault();
                return false;
            }
        };

        // Adiciona os listeners
        document.addEventListener('copy', preventCopy);
        document.addEventListener('cut', preventCopy);
        document.addEventListener('contextmenu', preventCopy);
        document.addEventListener('keydown', handleKeyDown);

        // Cleanup ao fechar
        return () => {
            document.removeEventListener('copy', preventCopy);
            document.removeEventListener('cut', preventCopy);
            document.removeEventListener('contextmenu', preventCopy);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [result]);

    if (!result || !metadata) return null;

    const getEntropyColor = (label) => {
        const colors = {
            'Baixíssima': '#f21404ff',
            'Baixa': '#b4ab00ff',
            'Média': '#6502c8ff',
            'Alta': '#3a9608ff',
            'Altíssima': '#c201a5ff',
            'Impossível': '#e400c4ff'
        };
        return colors[label] || 'var(--accent)';
    };

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
                        <span className="modal-info-label">Entropia (força da senha)</span>
                        <p style={{ color: getEntropyColor(result.entropy_label), fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>
                            {result.entropy_label} ({result.entropy.toFixed(1)} bits)
                        </p>
                    </div>
                </div>

                <div className="modal-warning" style={{ background: 'rgba(114, 47, 55, 0.15)', borderColor: 'var(--accent)' }}>
                    <svg style={{ width: '24px', flexShrink: 0, marginTop: '2px', color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                        <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--accent)', fontSize: '0.9rem' }}>📍 INFORMAÇÃO:</strong>
                        Por segurança essa senha deve ser anotada em papel e guardada. O sistema não permite cópia para evitar rastros. Não nos responsabilizamos pela insegurança do item.
                    </p>
                </div>


                <div className="modal-footer" style={{ marginTop: '1.5rem', flexDirection: 'column', gap: '0.75rem' }}>
                    <button
                        onClick={onGenerate}
                        className="btn btn-secondary"
                        style={{ width: '100%', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    >
                        Gerar outra senha
                    </button>
                    <button
                        onClick={onClose}
                        className="btn btn-generate"
                        style={{ width: '100%', padding: '0.8rem' }}
                    >
                        Concluído e anotado
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
