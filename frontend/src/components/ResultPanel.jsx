/**
 * ResultPanel — exibição da senha gerada com indicador de entropia.
 */
export default function ResultPanel({ result, loading, error, copied, onGenerate, onCopy }) {
    const entropyClass = result
        ? result.entropy > 80
            ? 'entropy--high'
            : result.entropy > 50
                ? 'entropy--medium'
                : 'entropy--low'
        : '';

    return (
        <div className="result-panel">
            {/* Linha de gradiente no topo */}
            <div className="result-gradient-line" />

            {/* Conteúdo Central */}
            <div className="result-content">
                {error && <div className="result-error">{error}</div>}

                <div className="result-password">
                    {result ? (
                        result.password
                    ) : (
                        <span className="result-placeholder">Clique em Gerar...</span>
                    )}
                </div>

                {result && (
                    <div className="result-entropy animate-scale-in">
                        <span className={`entropy-badge ${entropyClass}`}>
                            {result.entropy_label} ({result.entropy.toFixed(1)} bits)
                        </span>
                    </div>
                )}
            </div>

            {/* Barra de Ações */}
            <div className="result-actions">
                <button onClick={onGenerate} disabled={loading} className="btn btn-generate">
                    {loading ? (
                        <span className="btn-loading">
                            <svg className="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Gerando...
                        </span>
                    ) : (
                        'Gerar Senha'
                    )}
                </button>

                <button onClick={onCopy} disabled={!result} className="btn-copy">
                    {copied ? (
                        <>
                            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Copiado!
                        </>
                    ) : (
                        <>
                            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                />
                            </svg>
                            Copiar
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
