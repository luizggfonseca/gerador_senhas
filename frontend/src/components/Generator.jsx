import { useState, useRef } from 'react';
import { usePasswordGenerator } from '../hooks/usePasswordGenerator';
import ModalSeguranca from './ModalSeguranca';
import { GENERATOR_METADATA } from '../constants/generatorMetadata';

/* ========================== Reusable Components ========================== */

function GeneratorSection({ id, title, children, onGenerate, loading, icon }) {
    return (
        <section id={id} className="dashboard-section">
            <div className="section-header">
                <h3 className="section-title">
                    {icon && (
                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1.25rem' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                        </svg>
                    )}
                    {title}
                </h3>
            </div>
            <div className="section-body">{children}</div>
            <div className="section-actions">
                <button onClick={onGenerate} disabled={loading} className="btn-generate-small">
                    {loading ? (
                        <svg className="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '1rem', height: '1rem' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    ) : (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1.25rem' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    )}
                    {loading ? 'Gerando...' : 'Gerar Senha'}
                </button>
            </div>
        </section>
    );
}

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
    const { result, loading, error, generate, reset } = usePasswordGenerator();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeMetadata, setActiveMetadata] = useState(null);
    const [lastGenerateFn, setLastGenerateFn] = useState(null);
    const scrollContainerRef = useRef(null);

    // Navigation Links Data
    const navLinks = [
        { id: 'diceware-pure', label: 'Diceware' },
        { id: 'diceware-mod', label: 'Modificado' },
        { id: 'random-classic', label: 'Aleatória' },
        { id: 'token-hex', label: 'Token Hex' },
        { id: 'token-url', label: 'Token URL' },
        { id: 'uuid', label: 'UUID' }
    ];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // States for each section
    const [dicewareTrad, setDicewareTrad] = useState({ language: 'portugues', num_words: 4 });
    const [dicewareMod, setDicewareMod] = useState({
        language: 'portugues',
        num_words: 4,
        separator: '-',
        use_uppercase: true,
        capitalize_count: 1,
        use_numbers: true,
        number_count: 1,
        use_symbols: true,
        symbol_count: 1,
        symbols_pool: '!@#$%&*'
    });
    const [randomClassic, setRandomClassic] = useState({
        length: 16,
        use_upper: true,
        use_lower: true,
        use_numbers: true,
        use_symbols: true,
        symbols: '!@#$%&*',
        exclude_ambiguous: false,
        entropy_bits: 0
    });
    const [tokenHex, setTokenHex] = useState({ length: 32, entropy_bits: 0 });
    const [tokenUrl, setTokenUrl] = useState({ length: 32 });

    const handleGenerate = async (genId, options, metadataPath, generateFn) => {
        let finalOptions = { ...options };

        // Fix for Classic Symbols
        if (genId === 'random_classic' && options.mode === 'classic') {
            finalOptions.symbols = options.use_symbols ? options.symbols : "";
            delete finalOptions.use_symbols;
        }

        // Entropy Logic
        if (options.entropy_bits > 0) {
            const bits = options.entropy_bits;
            if (genId === 'random_classic' && options.mode === 'classic') {
                finalOptions.length = Math.ceil(bits / 5.95);
            } else if (genId === 'random_classic' && options.token_type === 'hex') {
                finalOptions.token_length = Math.ceil(bits / 4);
            }
        }

        const res = await generate(genId, finalOptions);
        if (res) {
            setActiveMetadata(GENERATOR_METADATA[metadataPath] || { title: 'Senha Gerada', description: 'Senha gerada com sucesso.' });
            setLastGenerateFn(() => generateFn);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="generator-layout">
            {/* Navigation Bar */}
            <nav className="dashboard-nav">
                {navLinks.map(link => (
                    <button key={link.id} onClick={() => scrollToSection(link.id)} className="nav-link">
                        {link.label}
                    </button>
                ))}
            </nav>

            <div className="generator-main" ref={scrollContainerRef}>

                {/* 1. Diceware Tradicional */}
                <GeneratorSection
                    id="diceware-pure"
                    title="Diceware Tradicional"
                    icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    onGenerate={() => handleGenerate('diceware_pure', dicewareTrad, 'diceware_pure', () => handleGenerate('diceware_pure', dicewareTrad, 'diceware_pure'))}
                    loading={loading}
                >
                    <div className="config-grid">
                        <div>
                            <label className="label">Idioma</label>
                            <select className="input-field" value={dicewareTrad.language} onChange={(e) => setDicewareTrad({ ...dicewareTrad, language: e.target.value })}>
                                <option value="portugues">Português</option>
                                <option value="ingles">Inglês</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Número de Palavras</label>
                            <input type="number" min="3" max="15" className="input-field input-mono" value={dicewareTrad.num_words} onChange={(e) => setDicewareTrad({ ...dicewareTrad, num_words: parseInt(e.target.value) || 3 })} />
                        </div>
                    </div>
                </GeneratorSection>

                {/* 2. Diceware Modificado */}
                <GeneratorSection
                    id="diceware-mod"
                    title="Diceware Modificado"
                    icon="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    onGenerate={() => handleGenerate('diceware_modified', dicewareMod, 'diceware_modified', () => handleGenerate('diceware_modified', dicewareMod, 'diceware_modified'))}
                    loading={loading}
                >
                    <div className="config-grid">
                        <div>
                            <label className="label">Idioma</label>
                            <select className="input-field" value={dicewareMod.language} onChange={(e) => setDicewareMod({ ...dicewareMod, language: e.target.value })}>
                                <option value="portugues">Português</option>
                                <option value="ingles">Inglês</option>
                                <option value="espanhol">Espanhol</option>
                                <option value="frances">Francês</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Separador</label>
                            <input type="text" className="input-field input-mono" value={dicewareMod.separator} onChange={(e) => setDicewareMod({ ...dicewareMod, separator: e.target.value })} />
                        </div>
                    </div>
                    <div className="config-grid" style={{ marginTop: '0.5rem' }}>
                        <div>
                            <label className="label">Palavras</label>
                            <input type="number" min="3" max="15" className="input-field input-mono" value={dicewareMod.num_words} onChange={(e) => setDicewareMod({ ...dicewareMod, num_words: parseInt(e.target.value) || 3 })} />
                        </div>
                        <div>
                            <CheckboxOption checked={dicewareMod.use_uppercase} onChange={(v) => setDicewareMod({ ...dicewareMod, use_uppercase: v })} label="Letras Maiúsculas" />
                            {dicewareMod.use_uppercase && (
                                <input type="number" min="1" max={dicewareMod.num_words} className="input-field input-mono" style={{ marginTop: '0.25rem', height: '32px' }} value={dicewareMod.capitalize_count} onChange={(e) => setDicewareMod({ ...dicewareMod, capitalize_count: parseInt(e.target.value) || 1 })} />
                            )}
                        </div>
                    </div>
                    <div className="config-grid" style={{ marginTop: '0.5rem' }}>
                        <div>
                            <CheckboxOption checked={dicewareMod.use_numbers} onChange={(v) => setDicewareMod({ ...dicewareMod, use_numbers: v })} label="Números" />
                            {dicewareMod.use_numbers && (
                                <input type="number" min="1" max="8" className="input-field input-mono" style={{ marginTop: '0.25rem', height: '32px' }} value={dicewareMod.number_count} onChange={(e) => setDicewareMod({ ...dicewareMod, number_count: parseInt(e.target.value) || 1 })} />
                            )}
                        </div>
                        <div>
                            <CheckboxOption checked={dicewareMod.use_symbols} onChange={(v) => setDicewareMod({ ...dicewareMod, use_symbols: v })} label="Símbolos" />
                            {dicewareMod.use_symbols && (
                                <input type="text" className="input-field input-mono" style={{ marginTop: '0.25rem', height: '32px' }} value={dicewareMod.symbols_pool} onChange={(e) => setDicewareMod({ ...dicewareMod, symbols_pool: e.target.value })} />
                            )}
                        </div>
                    </div>
                </GeneratorSection>

                {/* 3. Senha Clássica Aleatória */}
                <GeneratorSection
                    id="random-classic"
                    title="Senha Clássica Aleatória"
                    icon="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    onGenerate={() => handleGenerate('random_classic', { ...randomClassic, mode: 'classic' }, 'random_classic:classic', () => handleGenerate('random_classic', { ...randomClassic, mode: 'classic' }, 'random_classic:classic'))}
                    loading={loading}
                >
                    <div className="config-grid">
                        <div>
                            <label className="label">Comprimento</label>
                            <input type="number" min="4" max="128" className="input-field input-mono" value={randomClassic.length} onChange={(e) => setRandomClassic({ ...randomClassic, length: parseInt(e.target.value) || 16 })} />
                        </div>
                        <div>
                            <label className="label">Entropia (Bits)</label>
                            <input type="number" min="0" max="512" placeholder="Opcional" className="input-field input-mono" value={randomClassic.entropy_bits || ''} onChange={(e) => setRandomClassic({ ...randomClassic, entropy_bits: parseInt(e.target.value) || 0 })} />
                        </div>
                    </div>
                    <div className="checkbox-grid" style={{ marginTop: '0.75rem' }}>
                        <CheckboxOption checked={randomClassic.use_upper} onChange={(v) => setRandomClassic({ ...randomClassic, use_upper: v })} label="ABC" />
                        <CheckboxOption checked={randomClassic.use_lower} onChange={(v) => setRandomClassic({ ...randomClassic, use_lower: v })} label="abc" />
                        <CheckboxOption checked={randomClassic.use_numbers} onChange={(v) => setRandomClassic({ ...randomClassic, use_numbers: v })} label="123" />
                        <CheckboxOption checked={randomClassic.use_symbols} onChange={(v) => setRandomClassic({ ...randomClassic, use_symbols: v })} label="!@#" />
                    </div>
                    {randomClassic.use_symbols && (
                        <div style={{ marginTop: '0.5rem' }}>
                            <label className="label" style={{ fontSize: '0.75rem' }}>Símbolos Personalizados</label>
                            <input type="text" className="input-field input-mono" value={randomClassic.symbols} onChange={(e) => setRandomClassic({ ...randomClassic, symbols: e.target.value })} />
                        </div>
                    )}
                </GeneratorSection>

                {/* 4. Token Hexadecimal */}
                <GeneratorSection
                    id="token-hex"
                    title="Token / API Key Hexadecimal"
                    icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    onGenerate={() => handleGenerate('random_classic', { mode: 'token', token_type: 'hex', token_length: tokenHex.length, entropy_bits: tokenHex.entropy_bits }, 'random_classic:token:hex', () => handleGenerate('random_classic', { mode: 'token', token_type: 'hex', token_length: tokenHex.length, entropy_bits: tokenHex.entropy_bits }, 'random_classic:token:hex'))}
                    loading={loading}
                >
                    <div className="config-grid">
                        <div>
                            <label className="label">Comprimento</label>
                            <input type="number" min="4" max="512" className="input-field input-mono" value={tokenHex.length} onChange={(e) => setTokenHex({ ...tokenHex, length: parseInt(e.target.value) || 32 })} />
                        </div>
                        <div>
                            <label className="label">Entropia (Bits)</label>
                            <input type="number" min="0" max="512" placeholder="Opcional" className="input-field input-mono" value={tokenHex.entropy_bits || ''} onChange={(e) => setTokenHex({ ...tokenHex, entropy_bits: parseInt(e.target.value) || 0 })} />
                        </div>
                    </div>
                </GeneratorSection>

                {/* 5. Token URL Safe */}
                <GeneratorSection
                    id="token-url"
                    title="Token URL (Base64)"
                    icon="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    onGenerate={() => handleGenerate('random_classic', { mode: 'token', token_type: 'urlsafe', token_length: tokenUrl.length }, 'random_classic:token:urlsafe', () => handleGenerate('random_classic', { mode: 'token', token_type: 'urlsafe', token_length: tokenUrl.length }, 'random_classic:token:urlsafe'))}
                    loading={loading}
                >
                    <div>
                        <label className="label">Comprimento</label>
                        <input type="number" min="4" max="512" className="input-field input-mono" value={tokenUrl.length} onChange={(e) => setTokenUrl({ ...tokenUrl, length: parseInt(e.target.value) || 32 })} />
                    </div>
                </GeneratorSection>

                {/* 6. UUID */}
                <GeneratorSection
                    id="uuid"
                    title="UUID (v4)"
                    icon="M7 7h.01M7 11h.01M7 15h.01M10 7h.01M10 11h.01M10 15h.01M13 7h.01M13 11h.01M13 15h.01M17 7h.01M17 11h.01M17 15h.01"
                    onGenerate={() => handleGenerate('random_classic', { mode: 'token', token_type: 'uuid' }, 'random_classic:token:uuid', () => handleGenerate('random_classic', { mode: 'token', token_type: 'uuid' }, 'random_classic:token:uuid'))}
                    loading={loading}
                >
                    <p className="sidebar-tip-text" style={{ fontSize: '0.85rem', opacity: 0.8 }}>Identificador único universal versao 4 (aleatório padrão RFC 4122).</p>
                </GeneratorSection>

            </div>

            {isModalOpen && (
                <ModalSeguranca
                    result={result}
                    metadata={activeMetadata}
                    onGenerate={lastGenerateFn}
                    onClose={() => {
                        setIsModalOpen(false);
                        reset();
                    }}
                />
            )}
        </div>
    );
}
