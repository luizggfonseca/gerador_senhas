/**
 * ResultPanel — botão de geração e Placeholder central.
 * A senha gerada agora abre um Modal de Segurança.
 */
export default function ResultPanel({ loading, onGenerate }) {
    return (
        <div className="result-panel">
            {/* Linha de gradiente no topo */}
            <div className="result-gradient-line" />

            {/* Removemos o conteúdo central em branco para um design mais compacto */}

            {/* Barra de Ações (Apenas Gerar) */}
            <div className="result-actions" style={{ justifyContent: 'center' }}>
                <button onClick={onGenerate} disabled={loading} className="btn btn-generate" style={{ width: '100%', maxWidth: '300px' }}>
                    {loading ? (
                        <span className="btn-loading">
                            <svg className="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Gerando...
                        </span>
                    ) : (
                        'Gerar Senha Segura'
                    )}
                </button>
            </div>
        </div>
    );
}
