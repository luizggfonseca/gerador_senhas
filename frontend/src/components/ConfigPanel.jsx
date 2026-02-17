/**
 * ConfigPanel — formulário de personalização por tipo de gerador.
 */
export default function ConfigPanel({ selectedGenId, options, onOptionChange, generatorsConfig }) {
    const type = generatorsConfig[selectedGenId]?.type;

    return (
        <div className="config-panel">
            {type !== 'random' && (
                <div className="config-panel-header">
                    <h3 className="config-panel-title">
                        <svg className="config-panel-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Personalização
                    </h3>
                </div>
            )}

            {type === 'random' && <RandomForm options={options} onChange={onOptionChange} />}
            {(type === 'diceware' || type === 'diceware_mod') && (
                <DicewareForm type={type} options={options} onChange={onOptionChange} />
            )}
        </div>
    );
}

/* ============================== Random Form ============================== */

function RandomForm({ options, onChange }) {
    return (
        <div className="animate-fade-in config-form">
            <div className="config-grid">
                <div>
                    <label className="label">Modo de Geração</label>
                    <select className="input-field" value={options.mode || 'classic'} onChange={(e) => onChange('mode', e.target.value)}>
                        <option value="classic">Senha Clássica</option>
                        <option value="token">Token / API Key</option>
                    </select>
                </div>

                {options.mode === 'token' ? (
                    <div>
                        <label className="label">Formato do Token</label>
                        <select
                            className="input-field"
                            value={options.token_type || 'hex'}
                            onChange={(e) => onChange('token_type', e.target.value)}
                        >
                            <option value="hex">Hexadecimal</option>
                            <option value="urlsafe">URL Safe (Base64)</option>
                            <option value="uuid">UUID (v4)</option>
                        </select>
                    </div>
                ) : (
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
                    <h4 className="advanced-title">Opções Avançadas</h4>

                    {/* Capitalização */}
                    <ToggleSection
                        checked={options.use_uppercase !== false}
                        onChange={(v) => onChange('use_uppercase', v)}
                        label="Maiúsculas (Capitalizar)"
                        badge={options.use_uppercase ? `${options.capitalize_count} palavras` : null}
                    >
                        <input
                            type="range"
                            min="1"
                            max={options.num_words || 4}
                            value={options.capitalize_count || 1}
                            onChange={(e) => onChange('capitalize_count', parseInt(e.target.value))}
                            className="range-slider"
                        />
                    </ToggleSection>

                    {/* Números */}
                    <ToggleSection
                        checked={options.use_numbers !== false}
                        onChange={(v) => onChange('use_numbers', v)}
                        label="Incluir Números"
                        badge={options.use_numbers ? `Qtd: ${options.number_count}` : null}
                    >
                        <input
                            type="range"
                            min="1"
                            max={4}
                            value={options.number_count || 1}
                            onChange={(e) => onChange('number_count', parseInt(e.target.value))}
                            className="range-slider"
                        />
                    </ToggleSection>

                    {/* Símbolos */}
                    <ToggleSection
                        checked={options.use_symbols !== false}
                        onChange={(v) => onChange('use_symbols', v)}
                        label="Incluir Símbolos"
                        badge={options.use_symbols ? `Qtd: ${options.symbol_count}` : null}
                    >
                        <input
                            type="range"
                            min="1"
                            max={4}
                            value={options.symbol_count || 1}
                            onChange={(e) => onChange('symbol_count', parseInt(e.target.value))}
                            className="range-slider"
                        />
                    </ToggleSection>

                    <CheckboxOption
                        checked={options.use_lowercase !== false}
                        onChange={(v) => onChange('use_lowercase', v)}
                        label="Manter Minúsculas (Desmarcar = TUDO MAIÚSCULO)"
                        muted
                    />
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

function ToggleSection({ checked, onChange, label, badge, children }) {
    return (
        <div className="toggle-section">
            <div className="toggle-section-header">
                <label className="checkbox-option">
                    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="checkbox" />
                    <span className="checkbox-label">{label}</span>
                </label>
                {badge && <span className="toggle-badge">{badge}</span>}
            </div>
            {checked && children}
        </div>
    );
}
