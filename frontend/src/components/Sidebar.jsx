/**
 * Sidebar — seleção do método de geração.
 * No modo Desktop exibe botões laterais.
 * No modo Mobile exibe um dropdown (lista suspensa) para economizar espaço.
 */
export default function Sidebar({ selectedPath, onSelectPath }) {
    const menuItems = [
        { id: 'diceware_pure', name: 'Diceware' },
        { id: 'diceware_modified', name: 'Diceware modificado' },
        { id: 'random_classic:classic', name: 'Senha clássica aleatória' },
        { id: 'random_classic:token:hex', name: 'Token hexadecimal' },
        { id: 'random_classic:token:urlsafe', name: 'Token URL (base64)' },
        { id: 'random_classic:token:uuid', name: 'UUID (v4)' },
        { id: 'divider', isDivider: true },
        { id: 'entropy_based', name: 'Gerar por Entropia' },
    ];

    return (
        <aside className="generator-sidebar">
            {/* Desktop: Lista de botões */}
            <div className="sidebar-list desktop-only">
                {menuItems.map((item) => {
                    if (item.isDivider) {
                        return <div key={item.id} className="sidebar-divider" style={{
                            height: '1px',
                            background: 'var(--border)',
                            margin: '0.75rem 0.5rem',
                            opacity: 0.5
                        }} />;
                    }
                    const isActive = selectedPath === item.id;
                    const isSpecial = item.id === 'entropy_based';
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelectPath(item.id)}
                            className={`sidebar-btn level-1 ${isActive ? 'active' : ''} ${isSpecial ? 'btn-entropy' : ''}`}
                            style={isSpecial ? { borderLeft: '3px solid var(--accent)', background: 'rgba(var(--accent-rgb, 114, 47, 55), 0.05)' } : {}}
                        >
                            {item.name}
                        </button>
                    );
                })}
            </div>

            {/* Mobile: Lista suspensa (Select) */}
            <div className="mobile-only sidebar-dropdown-container">
                <select
                    className="input-field sidebar-select"
                    value={selectedPath}
                    onChange={(e) => onSelectPath(e.target.value)}
                >
                    {menuItems.filter(i => !i.isDivider).map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
                <div className="sidebar-select-icon">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </aside>
    );
}
