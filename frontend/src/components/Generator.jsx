import { useState, useRef } from 'react';
import { usePasswordGenerator } from '../hooks/usePasswordGenerator';
import ResultDisplay from './ResultDisplay';
import { GENERATOR_METADATA } from '../constants/generatorMetadata';

/* ========================== Sidebar Button Component ========================== */

function SidebarLink({ active, icon, title, onClick }) {
    const isImagePath = typeof icon === 'string' && (icon.includes('.') || icon.startsWith('/'));

    return (
        <button
            onClick={onClick}
            className={`nav-link ${active ? 'active' : ''}`}
        >
            {icon && (
                isImagePath ? (
                    <img src={icon} alt="" style={{ width: '1.2rem', height: '1.2rem', objectFit: 'contain' }} />
                ) : (
                    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1.2rem' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                    </svg>
                )
            )}
            <span style={{ fontSize: '0.85rem', flex: 1 }}>{title}</span>
        </button>
    );
}

/* ========================== Reusable Input Components ========================== */

function CheckboxOption({ checked, onChange, label, muted = false }) {
    return (
        <label className="checkbox-option">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="checkbox" />
            <span className={`checkbox-label ${muted ? 'checkbox-label--muted' : ''}`}>{label}</span>
        </label>
    );
}

/* ============================== Main Generator ============================== */

export default function Generator() {
    const { result, loading: globalLoading, error, generate, reset } = usePasswordGenerator();
    const [activeGeneratorId, setActiveGeneratorId] = useState('diceware-mod');
    const [activeMetadata, setActiveMetadata] = useState(null);
    const [lastGenerateFn, setLastGenerateFn] = useState(null);
    const scrollContainerRef = useRef(null);

    // States for each section
    const [dicewareMod, setDicewareMod] = useState({
        language: 'português', num_words: 5, separator: '-', capitalize_count: 1, number_count: 0,
        numbers_pool: '0123456789', symbol_count: 0, symbols_pool: '!@#$%&*'
    });
    const [randomClassic, setRandomClassic] = useState({
        length: 16, use_upper: true, use_lower: true, use_numbers: true, use_symbols: true,
        symbols: '!@#$%&*', exclude_ambiguous: false, entropy_bits: 0
    });
    const [tokenHex, setTokenHex] = useState({ length: 32, entropy_bits: 0 });
    const [tokenUrl, setTokenUrl] = useState({ length: 32, entropy_bits: 0 });
    const [highEntropy, setHighEntropy] = useState({ length: 32, entropy_bits: 0 });
    const [consonants, setConsonants] = useState({ length: 16, use_upper: true, use_lower: true, entropy_bits: 0 });
    const [protonStyle, setProtonStyle] = useState({ length: 12, entropy_bits: 0 });
    const [pin, setPin] = useState({ length: 6, entropy_bits: 0 });

    const handleGenerate = async (genId, options, metadataPath) => {
        let finalOptions = { ...options };

        if (genId === 'random_classic' && options.mode === 'classic') {
            finalOptions.symbols = options.use_symbols ? options.symbols : "";
            delete finalOptions.use_symbols;
        }

        // Entropy Logic
        if (options.entropy_bits > 0) {
            const bits = options.entropy_bits;
            let poolSize = 0;
            if (genId === 'random_classic' && options.mode === 'classic') {
                if (options.use_upper) poolSize += 26;
                if (options.use_lower) poolSize += 26;
                if (options.use_numbers) poolSize += 10;
                if (options.use_symbols && options.symbols) poolSize += new Set(options.symbols).size;
                if (poolSize > 1) finalOptions.length = Math.ceil(bits / Math.log2(poolSize));
            } else if (genId === 'random_classic' && options.mode === 'token') {
                if (options.token_type === 'hex') finalOptions.token_length = Math.ceil(bits / 4);
                else if (options.token_type === 'urlsafe') finalOptions.token_length = Math.ceil(bits / 6);
            } else if (genId === 'advanced_options') {
                if (options.mode === 'consonants') {
                    poolSize = (options.use_lower ? 21 : 0) + (options.use_upper ? 21 : 0);
                    if (poolSize > 0) finalOptions.length = Math.ceil(bits / Math.log2(poolSize));
                } else if (options.mode === 'pin') finalOptions.length = Math.ceil(bits / 3.32);
                else if (options.mode === 'proton') finalOptions.length = Math.ceil(bits / 4.9);
                else if (options.mode === 'high_entropy') finalOptions.length = Math.ceil(bits / 5.95);
            }
        }

        setActiveMetadata(GENERATOR_METADATA[metadataPath] || { title: 'Senha Gerada' });
        const res = await generate(genId, finalOptions);
        if (res) {
            setLastGenerateFn(() => () => handleGenerate(genId, options, metadataPath));
        }
    };

    const generators = [
        { id: 'diceware-mod', title: 'Diceware'},
        { id: 'random-classic', title: 'Senha aleatória'},
        { id: 'token-hex', title: 'Token/API Key Hex.'},
        { id: 'token-url', title: 'URL (BASE 64)'},
        { id: 'uuid', title: 'UUID (V4)'},
        { id: 'proton-style', title: 'ProtonPass Style'},
        { id: 'nanoid', title: 'NanoID'}
    ];

    const renderActiveConfig = () => {
        switch (activeGeneratorId) {
            case 'diceware-mod':
                return (
                    <div className="config-grid animate-fade-in">
                        <div>
                            <label className="label">IDIOMA</label>
                            <select className="input-field" value={dicewareMod.language} onChange={(e) => setDicewareMod({ ...dicewareMod, language: e.target.value })}>
                                {['catalão', 'espanhol', 'francês', 'inglês', 'italiano', 'latim', 'português'].map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="label">SEPARADOR</label>
                            <select className="input-field input-mono" value={dicewareMod.separator} onChange={(e) => setDicewareMod({ ...dicewareMod, separator: e.target.value })}>
                                <option value=" ">ESPAÇO</option>
                                <option value="-">TRAÇO</option>
                                <option value="_">UNDERLINE</option>
                                <option value=".">PONTO</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">QUANT. DE PALAVRAS</label>
                            <select className="input-field input-mono" value={dicewareMod.num_words} onChange={(e) => setDicewareMod({ ...dicewareMod, num_words: parseInt(e.target.value) })}>
                                {[5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="label">LETRAS MAIÚSCULAS</label>
                            <select className="input-field input-mono" value={dicewareMod.capitalize_count} onChange={(e) => setDicewareMod({ ...dicewareMod, capitalize_count: parseInt(e.target.value) })}>
                                {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n === 0 ? 'DESATIVADO' : n}</option>)}
                            </select>
                        </div>

                        {/* Novos campos adicionados */}
                        <div>
                            <label className="label">QUANT. DE NÚMEROS</label>
                            <select className="input-field input-mono" value={dicewareMod.number_count} onChange={(e) => setDicewareMod({ ...dicewareMod, number_count: parseInt(e.target.value) })}>
                                {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n === 0 ? 'DESATIVADO' : n}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="label">QUANT. DE SÍMBOLOS</label>
                            <select className="input-field input-mono" value={dicewareMod.symbol_count} onChange={(e) => setDicewareMod({ ...dicewareMod, symbol_count: parseInt(e.target.value) })}>
                                {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n === 0 ? 'DESATIVADO' : n}</option>)}
                            </select>
                        </div>

                        <div className="section-actions" style={{ gridColumn: 'span 2' }}>
                            <button onClick={() => handleGenerate('diceware_modified', { ...dicewareMod, use_uppercase: dicewareMod.capitalize_count > 0, use_numbers: dicewareMod.number_count > 0, use_symbols: dicewareMod.symbol_count > 0 }, 'diceware_modified')} className="btn btn-generate" disabled={globalLoading}>
                                {globalLoading ? 'GERANDO...' : 'GERAR DICWARE'}
                            </button>
                        </div>
                    </div>
                );
            case 'random-classic':
                return (
                    <div className="config-grid animate-fade-in">
                        <div>
                            <label className="label">COMPRIMENTO</label>
                            <input type="number" min="4" max="128" className="input-field input-mono" value={randomClassic.length || ''} onChange={(e) => setRandomClassic({ ...randomClassic, length: parseInt(e.target.value) || 0, entropy_bits: 0 })} />
                        </div>
                        <div>
                            <label className="label">ENTROPIA (BITS)</label>
                            <input type="number" min="0" max="512" placeholder="OPCIONAL" className="input-field input-mono" value={randomClassic.entropy_bits || ''} onChange={(e) => setRandomClassic({ ...randomClassic, entropy_bits: parseInt(e.target.value) || 0, length: 0 })} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <CheckboxOption checked={randomClassic.use_upper} onChange={(v) => setRandomClassic({ ...randomClassic, use_upper: v })} label="ABC (MAIÚSCULAS)" />
                            <CheckboxOption checked={randomClassic.use_lower} onChange={(v) => setRandomClassic({ ...randomClassic, use_lower: v })} label="abc (MINÚSCULAS)" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <CheckboxOption checked={randomClassic.use_numbers} onChange={(v) => setRandomClassic({ ...randomClassic, use_numbers: v })} label="123 (NÚMEROS)" />
                            <CheckboxOption checked={randomClassic.use_symbols} onChange={(v) => setRandomClassic({ ...randomClassic, use_symbols: v })} label="!@# (SÍMBOLOS)" />
                        </div>
                        <div className="section-actions" style={{ gridColumn: 'span 2' }}>
                            <button onClick={() => handleGenerate('random_classic', { ...randomClassic, mode: 'classic' }, 'random_classic:classic')} className="btn btn-generate" disabled={globalLoading}>
                                {globalLoading ? 'GERANDO...' : 'GERAR SENHA'}
                            </button>
                        </div>
                    </div>
                );
            case 'token-hex':
            case 'token-url':
                const isHex = activeGeneratorId === 'token-hex';
                const state = isHex ? tokenHex : tokenUrl;
                const setState = isHex ? setTokenHex : setTokenUrl;
                const type = isHex ? 'hex' : 'urlsafe';
                return (
                    <div className="config-grid animate-fade-in">
                        <div>
                            <label className="label">COMPRIMENTO</label>
                            <input type="number" className="input-field input-mono" value={state.length || ''} onChange={(e) => setState({ ...state, length: parseInt(e.target.value) || 0, entropy_bits: 0 })} />
                        </div>
                        <div>
                            <label className="label">ENTROPIA</label>
                            <input type="number" className="input-field input-mono" value={state.entropy_bits || ''} onChange={(e) => setState({ ...state, entropy_bits: parseInt(e.target.value) || 0, length: 0 })} />
                        </div>
                        <div className="section-actions" style={{ gridColumn: 'span 2' }}>
                            <button onClick={() => handleGenerate('random_classic', { mode: 'token', token_type: type, token_length: state.length, entropy_bits: state.entropy_bits }, `random_classic:token:${type}`)} className="btn btn-generate" disabled={globalLoading}>
                                GERAR TOKEN
                            </button>
                        </div>
                    </div>
                );
            case 'uuid':
                return (
                    <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                        <p className="sidebar-tip-text" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>ID ÚNICO UNIVERSAL (V4) ALEATÓRIO PADRÃO RFC 4122</p>
                        <button onClick={() => handleGenerate('random_classic', { mode: 'token', token_type: 'uuid' }, 'random_classic:token:uuid')} className="btn btn-generate" disabled={globalLoading}>
                            GERAR UUID
                        </button>
                    </div>
                );
            case 'proton-style':
                const mapping = {
                    'proton-style': { state: protonStyle, set: setProtonStyle, mode: 'proton', path: 'advanced:proton' }
                }[activeGeneratorId];

                return (
                    <div className="config-grid animate-fade-in">
                        <div>
                            <label className="label">COMPRIMENTO</label>
                            <input type="number" className="input-field input-mono" value={mapping.state.length || ''} onChange={(e) => mapping.set({ ...mapping.state, length: parseInt(e.target.value) || 0, entropy_bits: 0 })} />
                        </div>
                        <div>
                            <label className="label">ENTROPIA</label>
                            <input type="number" className="input-field input-mono" value={mapping.state.entropy_bits || ''} onChange={(e) => mapping.set({ ...mapping.state, entropy_bits: parseInt(e.target.value) || 0, length: 0 })} />
                        </div>
                        {activeGeneratorId === 'consonants' && (
                            <div style={{ display: 'flex', gap: '1rem', gridColumn: 'span 2' }}>
                                <CheckboxOption checked={consonants.use_upper} onChange={(v) => setConsonants({ ...consonants, use_upper: v })} label="MAIÚSCULAS" />
                                <CheckboxOption checked={consonants.use_lower} onChange={(v) => setConsonants({ ...consonants, use_lower: v })} label="MINÚSCULAS" />
                            </div>
                        )}
                        <div className="section-actions" style={{ gridColumn: 'span 2' }}>
                            <button onClick={() => handleGenerate('advanced_options', { ...mapping.state, mode: mapping.mode }, mapping.path)} className="btn btn-generate" disabled={globalLoading}>
                                GERAR {activeGeneratorId.toUpperCase().replace('-', ' ')}
                            </button>
                        </div>
                    </div>
                );
            case 'nanoid':
                return (
                    <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                        <p className="sidebar-tip-text" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            NANOID SEGURO E ALEATÓRIO (21 CARACTERES).
                        </p>
                        <button onClick={() => handleGenerate('advanced_options', { mode: 'nanoid', length: 21 }, 'advanced:nanoid')} className="btn btn-generate" disabled={globalLoading}>
                            GERAR NANOID
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="generator-container">
            {/* 1. Sidebar — desktop only */}
            <aside className="generator-sidebar">
                <div className="sidebar-list">
                    {generators.map(gen => (
                        <SidebarLink
                            key={gen.id}
                            title={gen.title}
                            icon={gen.icon}
                            active={activeGeneratorId === gen.id}
                            onClick={() => {
                                setActiveGeneratorId(gen.id);
                                if (!result) reset();
                            }}
                        />
                    ))}
                </div>
            </aside>

            {/* 2. Mobile Tab Bar — visível apenas em mobile via CSS */}
            <nav className="mobile-tab-bar">
                {generators.map(gen => (
                    <button
                        key={gen.id}
                        className={`mobile-tab-item ${activeGeneratorId === gen.id ? 'active' : ''}`}
                        onClick={() => {
                            setActiveGeneratorId(gen.id);
                            if (!result) reset();
                        }}
                    >
                        {gen.title}
                    </button>
                ))}
            </nav>

            {/* 3. Main Content */}
            <main className="generator-main">
                <div className="generator-config-card">
                    {renderActiveConfig()}
                </div>

                {result && activeMetadata && (
                    <ResultDisplay
                        result={result}
                        metadata={activeMetadata}
                        onGenerate={lastGenerateFn}
                        onClose={() => {
                            reset();
                        }}
                    />
                )}
            </main>
        </div>
    );
}
