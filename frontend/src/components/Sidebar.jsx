/**
 * Sidebar — seleção do método de geração.
 */
export default function Sidebar({ generators, selectedGenId, onSelect, generatorsConfig }) {
    return (
        <aside className="generator-sidebar">
            <h3 className="sidebar-header">Método</h3>
            <div className="sidebar-list">
                {generators.map((g) => {
                    const config = generatorsConfig[g.id];
                    return (
                        <button
                            key={g.id}
                            onClick={() => onSelect(g.id)}
                            className={`sidebar-btn ${selectedGenId === g.id ? 'active' : ''}`}
                        >
                            {config?.icon && (
                                <svg className="sidebar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={config.icon} />
                                </svg>
                            )}
                            {g.name.replace('Generator', '').trim()}
                        </button>
                    );
                })}
            </div>

            {/* Dica de Segurança */}
            <div className="sidebar-tip">
                <h4 className="sidebar-tip-title">Dica de Segurança</h4>
                <p className="sidebar-tip-text">
                    Senhas Diceware são fáceis de lembrar e difíceis de quebrar. Use pelo menos 4 palavras.
                </p>
            </div>
        </aside>
    );
}
