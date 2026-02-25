/**
 * ConfigPanel — formulário de personalização por tipo de gerador.
 */
export default function ConfigPanel({ selectedGenId, options, onOptionChange, generatorsConfig }) {
    const type = generatorsConfig[selectedGenId]?.type;
    const isUuid = options.mode === 'token' && options.token_type === 'uuid';

    // Se for UUID, não renderizamos nada para evitar a "barra" vazia
    if (isUuid) return null;

    return (
        <div className="config-panel">
            {type === 'random' && <RandomForm options={options} onChange={onOptionChange} />}
            {type === 'entropy' && <EntropyForm options={options} onChange={onOptionChange} />}
            {(type === 'diceware' || type === 'diceware_mod') && (
                <DicewareForm type={type} options={options} onChange={onOptionChange} />
            )}
        </div>
    );
}

/* ============================== Entropy Form ============================== */

function EntropyForm({ options, onChange }) {
    const getLevelInfo = (bits) => {
        if (bits >= 120) return { label: 'Crítica / Altíssima', color: '#10b981' };
        if (bits >= 80) return { label: 'Alta', color: '#3b82f6' };
        if (bits >= 60) return { label: 'Razoável', color: '#f59e0b' };
        if (bits >= 40) return { label: 'Média', color: '#6366f1' };
        return { label: 'Baixa', color: '#ef4444' };
    };

    const info = getLevelInfo(options.custom_bits || 78);

    return (
        <div className="animate-fade-in config-form">
            <div className="config-grid">
                <div>
                    <label className="label">Entropia Desejada (Bits)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input
                            type="number"
                            min="16"
                            max="512"
                            value={options.custom_bits || 78}
                            onChange={(e) => {
                                const v = parseInt(e.target.value);
                                if (!isNaN(v)) onChange('custom_bits', Math.min(512, Math.max(16, v)));
                            }}
                            className="input-field input-mono"
                            style={{ width: '100px' }}
                        />
                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: info.color,
                            background: `${info.color}15`,
                            padding: '4px 8px',
                            borderRadius: '4px',
                            textTransform: 'uppercase'
                        }}>
                            {info.label}
                        </span>
                    </div>
                </div>
                <div>
                    <label className="label">Modelo de Senha</label>
                    <select
                        className="input-field"
                        value={options.model}
                        onChange={(e) => onChange('model', e.target.value)}
                    >
                        <option value="random_classic">Senha Aleatória Clássica</option>
                        <option value="token_hex">Token Hexadecimal</option>
                        <option value="diceware_pure">Diceware (Memorizável)</option>
                    </select>
                </div>
            </div>

            <div className="entropy-info" style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(var(--accent-rgb, 114, 47, 55), 0.05)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                border: '1px solid var(--border)'
            }}>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    <strong style={{ color: 'var(--accent)', display: 'block', marginBottom: '4px' }}>Como funciona:</strong>
                    O sistema calcula matematicamente o tamanho necessário para o modelo escolhido atingir o nível de segurança desejado, protegendo você contra ataques de força bruta.
                </p>
            </div>
        </div>
    );
}

/* ============================== Random Form ============================== */

function RandomForm({ options, onChange }) {
    return (
        <div className="animate-fade-in config-form">
            <div className="config-grid">
                {options.mode !== 'token' && (
                    <div>
                        <label className="label">Comprimento</label>
                        <input
                            type="number"
                            min="8"
                            max="128"
                            value={options.length || 16}
                            onChange={(e) => {
                                const v = parseInt(e.target.value);
                                if (!isNaN(v)) onChange('length', Math.min(128, Math.max(8, v)));
                            }}
                            className="input-field input-mono"
                        />
                    </div>
                )}
            </div>

            {options.mode !== 'token' && (
                <>
                    <div className="checkbox-grid">
                        <CheckboxOption checked={options.use_upper !== false} onChange={(v) => onChange('use_upper', v)} label="ABC" />
                        <CheckboxOption checked={options.use_lower !== false} onChange={(v) => onChange('use_lower', v)} label="abc" />
                        <CheckboxOption checked={options.use_numbers !== false} onChange={(v) => onChange('use_numbers', v)} label="123" />
                        <CheckboxOption
                            checked={options.exclude_ambiguous === true}
                            onChange={(v) => onChange('exclude_ambiguous', v)}
                            label="Sem Ambiguidade (0OIl)"
                            muted
                        />
                    </div>

                    <div>
                        <label className="label">Caracteres Especiais</label>
                        <input
                            type="text"
                            className="input-field input-mono"
                            value={options.symbols || ''}
                            onChange={(e) => onChange('symbols', e.target.value)}
                        />
                    </div>
                </>
            )}

            {options.mode === 'token' && options.token_type !== 'uuid' && (
                <div>
                    <label className="label">Comprimento</label>
                    <input
                        type="number"
                        min="8"
                        max="512"
                        value={options.token_length || 32}
                        onChange={(e) => {
                            const v = parseInt(e.target.value);
                            if (!isNaN(v)) onChange('token_length', Math.min(512, Math.max(8, v)));
                        }}
                        className="input-field input-mono"
                    />
                </div>
            )}
        </div>
    );
}

/* ============================= Diceware Form ============================= */

function DicewareForm({ type, options, onChange }) {
    return (
        <div className="animate-fade-in config-form">
            <div className="config-grid">
                <div>
                    <label className="label">Idioma da Lista</label>
                    <select className="input-field" value={options.language || 'portugues'} onChange={(e) => onChange('language', e.target.value)}>
                        <option value="catalao">Catalão</option>
                        <option value="espanhol">Espanhol</option>
                        <option value="frances">Francês</option>
                        <option value="ingles">Inglês</option>
                        <option value="italiano">Italiano</option>
                        <option value="latim">Latim</option>
                        <option value="portugues">Português</option>
                    </select>
                </div>
                <div>
                    <label className="label">Número de Palavras</label>
                    <input
                        type="number"
                        min="3"
                        max="10"
                        value={options.num_words || 4}
                        onChange={(e) => {
                            const v = parseInt(e.target.value);
                            if (!isNaN(v)) onChange('num_words', Math.min(10, Math.max(3, v)));
                        }}
                        className="input-field input-mono"
                    />
                </div>
            </div>

            {type === 'diceware_mod' && (
                <div className="advanced-section">
                    <h4 className="advanced-title">Customização de Força</h4>

                    <div className="advanced-grid" style={{ display: 'grid', gap: '0.5rem' }}>
                        {/* Capitalização */}
                        <AdvancedRow
                            active={options.use_uppercase !== false}
                            onActiveChange={(v) => onChange('use_uppercase', v)}
                            label="Maiúsculas"
                            value={options.capitalize_count || 1}
                            onValueChange={(v) => onChange('capitalize_count', v)}
                            min={1}
                            max={options.num_words || 4}
                            unit="palavra(s)"
                        />

                        {/* Números */}
                        <AdvancedRow
                            active={options.use_numbers !== false}
                            onActiveChange={(v) => onChange('use_numbers', v)}
                            label="Incluir Números"
                            value={options.number_count || 1}
                            onValueChange={(v) => onChange('number_count', v)}
                            min={1}
                            max={8}
                            unit="número(s)"
                        />

                        {/* Símbolos */}
                        <div className="advanced-group">
                            <AdvancedRow
                                active={options.use_symbols !== false}
                                onActiveChange={(v) => onChange('use_symbols', v)}
                                label="Incluir Símbolos"
                                value={options.symbol_count || 1}
                                onValueChange={(v) => onChange('symbol_count', v)}
                                min={1}
                                max={8}
                                unit="símbolo(s)"
                            />
                            {options.use_symbols !== false && (
                                <div className="symbol-customization animate-fade-in" style={{ marginTop: '0.25rem', padding: '0 0.5rem' }}>
                                    <label className="label" style={{ fontSize: '0.65rem', marginBottom: '0.15rem' }}>Conjunto de Símbolos</label>
                                    <input
                                        type="text"
                                        className="input-field input-mono"
                                        style={{ padding: '0.4rem', fontSize: '0.9rem' }}
                                        value={options.symbols_pool || ''}
                                        onChange={(e) => onChange('symbols_pool', e.target.value)}
                                        placeholder="Ex: !@#$%&*"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
                        <CheckboxOption
                            checked={options.use_lowercase !== false}
                            onChange={(v) => onChange('use_lowercase', v)}
                            label="Manter Minúsculas (Desmarcar = TUDO MAIÚSCULO)"
                            muted
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

/* ========================== Reusable Sub-Components ========================== */

function CheckboxOption({ checked, onChange, label, muted = false }) {
    return (
        <label className="checkbox-option">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="checkbox" />
            <span className={`checkbox-label ${muted ? 'checkbox-label--muted' : ''}`}>{label}</span>
        </label>
    );
}

function AdvancedRow({ active, onActiveChange, label, value, onValueChange, min, max, unit }) {
    return (
        <div className={`advanced-row ${active ? 'active' : ''}`} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-secondary)',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            transition: 'all 0.2s'
        }}>
            <label className="checkbox-option" style={{ border: 'none', padding: 0 }}>
                <input type="checkbox" checked={active} onChange={(e) => onActiveChange(e.target.checked)} className="checkbox" />
                <span className="checkbox-label" style={{ fontWeight: 600 }}>{label}</span>
            </label>

            {active && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                        type="number"
                        min={min}
                        max={max}
                        value={value}
                        onChange={(e) => {
                            const v = parseInt(e.target.value);
                            if (!isNaN(v)) onValueChange(Math.min(max, Math.max(min, v)));
                        }}
                        style={{
                            width: '50px',
                            padding: '0.25rem',
                            textAlign: 'center',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--accent)',
                            borderRadius: '4px',
                            color: 'var(--text-primary)',
                            fontSize: '0.875rem'
                        }}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{unit}</span>
                </div>
            )}
        </div>
    );
}
