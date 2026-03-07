import { useEffect } from 'react';

/**
 * ResultDisplay — Exibe a senha gerada e dados técnicos na área central.
 * Agora como um modal glassmorphism sobre a tela de configuração.
 */
export default function ResultDisplay({ result, metadata, onGenerate, onClose }) {
    useEffect(() => {
        if (!result) return;

        // Bloqueio de eventos de cópia e menu sensível
        const preventCopy = (e) => {
            e.preventDefault();
            return false;
        };

        const handleKeyDown = (e) => {
            if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'u' || e.key === 'i')) {
                e.preventDefault();
                return false;
            }
        };

        document.addEventListener('copy', preventCopy);
        document.addEventListener('cut', preventCopy);
        document.addEventListener('contextmenu', preventCopy);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('copy', preventCopy);
            document.removeEventListener('cut', preventCopy);
            document.removeEventListener('contextmenu', preventCopy);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [result]);

    if (!result || !metadata) return null;

    return (
        <div className="modal-overlay animate-fade-in" onClick={onClose}>
            <div className="modal-content animate-slide-up" onClick={(e) => e.stopPropagation()} style={{ width: '90%', padding: '2.5rem' }}>
                <div className="section-header" style={{ marginBottom: '2rem' }}>
                    <h3 className="section-title" style={{ fontSize: '1.25rem' }}>{metadata.title}</h3>
                </div>

                <div className="modal-password-box" style={{ margin: '1.5rem 0', padding: '2rem' }}>
                    <p className="modal-password-text" style={{ color: 'var(--text-primary)', fontSize: '1.75rem', textAlign: 'center', letterSpacing: '0.05em' }}>
                        {result.password}
                    </p>
                </div>

                <div className="modal-info-grid" style={{ marginBottom: '2rem' }}>
                    <div className="modal-info-item">
                        <span className="modal-info-label" style={{ fontSize: '0.9rem' }}>Entropia (força da senha)</span>
                        <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.1rem', margin: '0.5rem 0 0' }}>
                            {result.entropy_label} ({result.entropy.toFixed(1)} bits)
                        </p>
                    </div>
                </div>

                <div className="modal-warning" style={{ background: 'rgba(234, 210, 146, 0.05)', borderColor: 'var(--accent)', marginBottom: '2rem', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <svg style={{ width: '24px', height: '24px', flexShrink: 0, color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                            <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--accent)', fontSize: '1rem' }}>📌 INFORMAÇÃO IMPORTANTE:</strong>
                            Por segurança esta senha deve ser anotada e guardada fora do ambiente digital. O GhostPass não armazena dados e bloqueia cópias para sua proteção total.
                        </p>
                    </div>
                </div>

                <div className="section-actions" style={{ gap: '1.25rem', padding: 0, border: 'none', background: 'transparent' }}>
                    <button
                        onClick={onGenerate}
                        className="btn"
                        style={{ flex: 1, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '1rem' }}
                    >
                        Gerar outra
                    </button>
                    <button
                        onClick={onClose}
                        className="btn btn-generate"
                        style={{ flex: 1, padding: '1rem' }}
                    >
                        Concluído
                    </button>
                </div>
            </div>
        </div>
    );
}
