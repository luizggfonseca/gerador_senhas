import { useState, useRef } from 'react';
import { usePasswordGenerator } from '../hooks/usePasswordGenerator';
import ModalSeguranca from './ModalSeguranca';
import { GENERATOR_METADATA } from '../constants/generatorMetadata';

/* ========================== Reusable Components ========================== */

function GeneratorSection({ id, title, children, onGenerate, loading, icon }) {
    // Verifica se o ícone é um caminho de arquivo (PNG/JPG etc) ou um path SVG
    const isImagePath = typeof icon === 'string' && (icon.includes('.') || icon.startsWith('/'));

    return (
        <section id={id} className="dashboard-section">
            <div className="section-header">
                <h3 className="section-title">
                    {icon && (
                        isImagePath ? (
                            <img src={icon} alt="" className="section-icon-img" style={{ width: '1.8rem', height: '1.8rem', objectFit: 'contain' }} />
                        ) : (
                            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1.5rem' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                            </svg>
                        )
                    )}
                    {title}
                </h3>
            </div>
            <div className="section-body">{children}</div>
            <div className="section-actions">
                <button onClick={onGenerate} disabled={loading} className="btn-generate-small">
                    {loading ? (
                        <svg className="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    ) : (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1.4rem', height: '1.4rem' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    )}
                    {loading ? 'Gerando...' : 'Gerar senha'}
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
    const { result, loading: globalLoading, error, generate, reset } = usePasswordGenerator();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeMetadata, setActiveMetadata] = useState(null);
    const [lastGenerateFn, setLastGenerateFn] = useState(null);
    const [pendingSectionId, setPendingSectionId] = useState(null);
    const scrollContainerRef = useRef(null);


    // States for each section
    const [dicewareTrad, setDicewareTrad] = useState({ language: 'português', num_words: 4 });
    const [dicewareMod, setDicewareMod] = useState({
        language: 'português',
        num_words: 5,
        separator: '-',
        capitalize_count: 1,
        number_count: 0,
        numbers_pool: '0123456789',
        symbol_count: 0,
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
    const [highEntropy, setHighEntropy] = useState({ length: 32 });
    const [consonants, setConsonants] = useState({ length: 16 });
    const [protonStyle, setProtonStyle] = useState({ length: 12 });
    const [pin, setPin] = useState({ length: 6 });
    const [nanoid, setNanoid] = useState({ length: 21 });
    const [fips181, setFips181] = useState({ length: 10 });

    const handleGenerate = async (genId, options, metadataPath) => {
        let finalOptions = { ...options };

        // Fix for Classic Symbols
        if (genId === 'random_classic' && options.mode === 'classic') {
            finalOptions.symbols = options.use_symbols ? options.symbols : "";
            delete finalOptions.use_symbols;
        }

        // Entropy Logic - Dynamic Calculation
        if (options.entropy_bits > 0) {
            const bits = options.entropy_bits;
            if (genId === 'random_classic' && options.mode === 'classic') {
                // Calculate actual pool size to be precise
                let poolSize = 0;
                const ambig = options.exclude_ambiguous ? 5 : 0;
                if (options.use_upper) poolSize += (26 - (options.exclude_ambiguous ? 2 : 0)); // I, O
                if (options.use_lower) poolSize += (26 - (options.exclude_ambiguous ? 1 : 0)); // l
                if (options.use_numbers) poolSize += (10 - (options.exclude_ambiguous ? 2 : 0)); // 1, 0
                if (options.use_symbols && options.symbols) {
                    const uniqueSymbols = new Set(options.symbols).size;
                    poolSize += uniqueSymbols;
                }

                if (poolSize > 1) {
                    const bitsPerChar = Math.log2(poolSize);
                    finalOptions.length = Math.ceil(bits / bitsPerChar);
                }
            } else if (genId === 'random_classic' && options.mode === 'token') {
                if (options.token_type === 'hex') {
                    finalOptions.token_length = Math.ceil(bits / 4);
                } else if (options.token_type === 'urlsafe') {
                    finalOptions.token_length = Math.ceil(bits / 6);
                }
            }
        }

        setPendingSectionId(metadataPath);
        const res = await generate(genId, finalOptions);
        setPendingSectionId(null);

        if (res) {
            setActiveMetadata(GENERATOR_METADATA[metadataPath] || { title: 'Senha Gerada', description: 'Senha gerada com sucesso.' });
            // Define a função de geração recursiva para permitir cliques infinitos
            setLastGenerateFn(() => () => handleGenerate(genId, options, metadataPath));
            setIsModalOpen(true);
        }
    };

    return (
        <div className="generator-layout">

            <div className="generator-main" ref={scrollContainerRef}>
                {/* Entropy Legend */}
                <div className="entropy-legend">
                    <span className="legend-item legend-baixissima"><span className="legend-dot"></span> Baixíssima</span>
                    <span className="legend-item legend-baixa"><span className="legend-dot"></span> Baixa</span>
                    <span className="legend-item legend-media"><span className="legend-dot"></span> Média</span>
                    <span className="legend-item legend-alta"><span className="legend-dot"></span> Alta</span>
                    <span className="legend-item legend-altissima"><span className="legend-dot"></span> Altíssima</span>
                    <span className="legend-item legend-impossivel"><span className="legend-dot"></span> Impossível</span>
                </div>

                {/* 1. Diceware */}
                <GeneratorSection
                    id="diceware-pure"
                    title="DICEWARE"
                    icon="/icons/diceware.png"
                    onGenerate={() => handleGenerate('diceware_pure', dicewareTrad, 'diceware_pure')}
                    loading={globalLoading && pendingSectionId === 'diceware_pure'}
                >
                    <div className="config-grid">
                        <div>
                            <label className="label">IDIOMA</label>
                            <select className="input-field" value={dicewareTrad.language} onChange={(e) => setDicewareTrad({ ...dicewareTrad, language: e.target.value })}>
                                <option value="português">Português</option>
                                <option value="inglês">Inglês</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">QUANT. DE PALAVRAS</label>
                            <select className="input-field input-mono" value={dicewareTrad.num_words} onChange={(e) => setDicewareTrad({ ...dicewareTrad, num_words: parseInt(e.target.value) })}>
                                {[5, 6, 7, 8, 9, 10].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </GeneratorSection>

                {/* 2. Diceware (personalizável) */}
                <GeneratorSection
                    id="diceware-mod"
                    title="DICEWARE (PERSONALIZÁVEL)"
                    icon="/icons/diceware.png"
                    onGenerate={() => {
                        const options = {
                            ...dicewareMod,
                            use_uppercase: dicewareMod.capitalize_count > 0,
                            use_numbers: dicewareMod.number_count > 0,
                            use_symbols: dicewareMod.symbols_pool.length > 0
                        };
                        handleGenerate('diceware_modified', options, 'diceware_modified');
                    }}
                    loading={globalLoading && pendingSectionId === 'diceware_modified'}
                >
                    <div className="config-grid">
                        <div>
                            <label className="label">IDIOMA</label>
                            <select className="input-field" value={dicewareMod.language} onChange={(e) => setDicewareMod({ ...dicewareMod, language: e.target.value })}>
                                <option value="catalão">Catalão</option>
                                <option value="espanhol">Espanhol</option>
                                <option value="francês">Francês</option>
                                <option value="inglês">Inglês</option>
                                <option value="italiano">Italiano</option>
                                <option value="latim">Latim</option>
                                <option value="português">Português</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">SEPARADOR</label>
                            <select className="input-field input-mono" value={dicewareMod.separator} onChange={(e) => setDicewareMod({ ...dicewareMod, separator: e.target.value })}>
                                <option value=" ">Espaço ( )</option>
                                <option value="-">Hífen (-)</option>
                                <option value="_">Underline (_)</option>
                                <option value=".">Ponto (.)</option>
                                <option value=",">Vírgula (,)</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">QUANT. DE PALAVRAS</label>
                            <select className="input-field input-mono" value={dicewareMod.num_words} onChange={(e) => setDicewareMod({ ...dicewareMod, num_words: parseInt(e.target.value) })}>
                                {[5, 6, 7, 8, 9, 10].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label">LETRAS MAIÚSCULAS</label>
                            <select className="input-field input-mono" value={dicewareMod.capitalize_count} onChange={(e) => setDicewareMod({ ...dicewareMod, capitalize_count: parseInt(e.target.value) })}>
                                {[0, 1, 2, 3, 4, 5].map(n => (
                                    <option key={n} value={n}>{n === 0 ? 'Desativado' : n}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label">NÚMERO</label>
                            <select className="input-field input-mono" value={dicewareMod.number_count} onChange={(e) => setDicewareMod({ ...dicewareMod, number_count: parseInt(e.target.value) })}>
                                {[0, 1, 2, 3, 4, 5].map(n => (
                                    <option key={n} value={n}>{n === 0 ? 'Desativado' : n}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label">SÍMBOLOS</label>
                            <input
                                type="text"
                                placeholder="Padrão: !@#$..."
                                className="input-field input-mono"
                                value={dicewareMod.symbols_pool}
                                onChange={(e) => setDicewareMod({
                                    ...dicewareMod,
                                    symbols_pool: e.target.value,
                                    symbol_count: e.target.value.length || 0
                                })}
                            />
                        </div>
                    </div>
                </GeneratorSection>

                {/* 3. Senha Aleatória */}
                <GeneratorSection
                    id="random-classic"
                    title="Senha Aleatória"
                    icon="/icons/aleatoria.png"
                    onGenerate={() => handleGenerate('random_classic', { ...randomClassic, mode: 'classic' }, 'random_classic:classic')}
                    loading={globalLoading && pendingSectionId === 'random_classic:classic'}
                >
                    <div className="config-grid">
                        <div>
                            <label className="label">COMPRIMENTO</label>
                            <input type="number" min="4" max="128" className="input-field input-mono"
                                value={randomClassic.length || ''}
                                onChange={(e) => setRandomClassic({ ...randomClassic, length: parseInt(e.target.value) || 0, entropy_bits: 0 })}
                            />
                        </div>
                        <div>
                            <label className="label">ENTROPIA</label>
                            <input type="number" min="0" max="512" placeholder="Opcional" className="input-field input-mono"
                                value={randomClassic.entropy_bits || ''}
                                onChange={(e) => setRandomClassic({ ...randomClassic, entropy_bits: parseInt(e.target.value) || 0, length: 0 })}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.25rem' }}>
                            <CheckboxOption checked={randomClassic.use_upper} onChange={(v) => setRandomClassic({ ...randomClassic, use_upper: v })} label="ABC (maiúsculas)" />
                            <CheckboxOption checked={randomClassic.use_lower} onChange={(v) => setRandomClassic({ ...randomClassic, use_lower: v })} label="abc (minúsculas)" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.25rem' }}>
                            <CheckboxOption checked={randomClassic.use_numbers} onChange={(v) => setRandomClassic({ ...randomClassic, use_numbers: v })} label="123 (números)" />
                            <CheckboxOption checked={randomClassic.use_symbols} onChange={(v) => setRandomClassic({ ...randomClassic, use_symbols: v })} label="!@# (símbolos)" />
                        </div>
                        {randomClassic.use_symbols && (
                            <div>
                                <label className="label">SÍMBOLOS PERSONALIZADOS</label>
                                <input
                                    type="text"
                                    className="input-field input-mono"
                                    value={randomClassic.symbols}
                                    onChange={(e) => setRandomClassic({ ...randomClassic, symbols: e.target.value })}
                                />
                            </div>
                        )}
                    </div>
                </GeneratorSection>

                {/* 4. Token Hex. */}
                <GeneratorSection
                    id="token-hex"
                    title="TOKEN/API KEY HEX."
                    icon="/icons/token.png"
                    onGenerate={() => handleGenerate('random_classic', { mode: 'token', token_type: 'hex', token_length: tokenHex.length, entropy_bits: tokenHex.entropy_bits }, 'random_classic:token:hex')}
                    loading={globalLoading && pendingSectionId === 'random_classic:token:hex'}
                >
                    <div className="config-grid">
                        <div>
                            <label className="label">COMPRIMENTO</label>
                            <input type="number" min="4" max="512" className="input-field input-mono"
                                value={tokenHex.length || ''}
                                onChange={(e) => setTokenHex({ ...tokenHex, length: parseInt(e.target.value) || 0, entropy_bits: 0 })}
                            />
                        </div>
                        <div>
                            <label className="label">ENTROPIA (BITS)</label>
                            <input type="number" min="0" max="512" placeholder="Opcional" className="input-field input-mono"
                                value={tokenHex.entropy_bits || ''}
                                onChange={(e) => setTokenHex({ ...tokenHex, entropy_bits: parseInt(e.target.value) || 0, length: 0 })}
                            />
                        </div>
                    </div>
                </GeneratorSection>

                {/* 5. Token URL Safe */}
                <GeneratorSection
                    id="token-url"
                    title="URL (BASE 64)"
                    icon="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    onGenerate={() => handleGenerate('random_classic', { mode: 'token', token_type: 'urlsafe', token_length: tokenUrl.length }, 'random_classic:token:urlsafe')}
                    loading={globalLoading && pendingSectionId === 'random_classic:token:urlsafe'}
                >
                    <div>
                        <label className="label">COMPRIMENTO</label>
                        <input type="number" min="4" max="512" className="input-field input-mono" value={tokenUrl.length} onChange={(e) => setTokenUrl({ ...tokenUrl, length: parseInt(e.target.value) || 32 })} />
                    </div>
                </GeneratorSection>

                {/* 6. UUID */}
                <GeneratorSection
                    id="uuid"
                    title="UUID (V4)"
                    icon="M7 7h.01M7 11h.01M7 15h.01M10 7h.01M10 11h.01M10 15h.01M13 7h.01M13 11h.01M13 15h.01M17 7h.01M17 11h.01M17 15h.01"
                    onGenerate={() => handleGenerate('random_classic', { mode: 'token', token_type: 'uuid' }, 'random_classic:token:uuid')}
                    loading={globalLoading && pendingSectionId === 'random_classic:token:uuid'}
                >
                    <p className="sidebar-tip-text" style={{ fontSize: '0.85rem', opacity: 0.8 }}>Identificador único universal versão 4 (aleatório padrão RFC 4122).</p>
                </GeneratorSection>

                {/* 7. High-Entropy */}
                <GeneratorSection
                    id="high-entropy"
                    title="HIGH-ENTROPY ALPHANUMERIC"
                    icon="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    onGenerate={() => handleGenerate('advanced_options', { mode: 'high_entropy', length: highEntropy.length }, 'advanced:high_entropy')}
                    loading={globalLoading && pendingSectionId === 'advanced:high_entropy'}
                >
                    <div>
                        <label className="label">COMPRIMENTO</label>
                        <input type="number" min="8" max="128" className="input-field input-mono" value={highEntropy.length} onChange={(e) => setHighEntropy({ length: parseInt(e.target.value) || 32 })} />
                    </div>
                </GeneratorSection>

                {/* 8. Consonants */}
                <GeneratorSection
                    id="consonants"
                    title="Apenas Consoantes"
                    icon="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    onGenerate={() => handleGenerate('advanced_options', { mode: 'consonants', length: consonants.length }, 'advanced:consonants')}
                    loading={globalLoading && pendingSectionId === 'advanced:consonants'}
                >
                    <div>
                        <label className="label">Comprimento</label>
                        <input type="number" min="4" max="128" className="input-field input-mono" value={consonants.length} onChange={(e) => setConsonants({ length: parseInt(e.target.value) || 16 })} />
                    </div>
                </GeneratorSection>

                {/* 9. Proton Style */}
                <GeneratorSection
                    id="proton-style"
                    title="ProtonPass Style"
                    icon="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                    onGenerate={() => handleGenerate('advanced_options', { mode: 'proton', length: protonStyle.length }, 'advanced:proton')}
                    loading={globalLoading && pendingSectionId === 'advanced:proton'}
                >
                    <div>
                        <label className="label">Comprimento Total (aprox.)</label>
                        <input type="number" min="8" max="128" className="input-field input-mono" value={protonStyle.length} onChange={(e) => setProtonStyle({ length: parseInt(e.target.value) || 12 })} />
                    </div>
                </GeneratorSection>

                {/* 10. PIN */}
                <GeneratorSection
                    id="pin"
                    title="PIN Numérico"
                    icon="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    onGenerate={() => handleGenerate('advanced_options', { mode: 'pin', length: pin.length }, 'advanced:pin')}
                    loading={globalLoading && pendingSectionId === 'advanced:pin'}
                >
                    <div className="config-grid">
                        <button className={`btn-outline ${pin.length === 4 ? 'active' : ''}`} onClick={() => setPin({ length: 4 })}>4 Dígitos</button>
                        <button className={`btn-outline ${pin.length === 6 ? 'active' : ''}`} onClick={() => setPin({ length: 6 })}>6 Dígitos</button>
                        <button className={`btn-outline ${pin.length === 8 ? 'active' : ''}`} onClick={() => setPin({ length: 8 })}>8 Dígitos</button>
                        <input type="number" className="input-field input-mono" value={pin.length} onChange={(e) => setPin({ length: parseInt(e.target.value) || 4 })} />
                    </div>
                </GeneratorSection>

                {/* 11. ULID */}
                <GeneratorSection
                    id="ulid"
                    title="ULID"
                    icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    onGenerate={() => handleGenerate('advanced_options', { mode: 'ulid' }, 'advanced:ulid')}
                    loading={globalLoading && pendingSectionId === 'advanced:ulid'}
                >
                    <p className="sidebar-tip-text" style={{ fontSize: '0.85rem', opacity: 0.8 }}>Universally Unique Lexicographically Sortable Identifier.</p>
                </GeneratorSection>

                {/* 12. NanoID */}
                <GeneratorSection
                    id="nanoid"
                    title="NanoID"
                    icon="M13 10V3L4 14h7v7l9-11h-7z"
                    onGenerate={() => handleGenerate('advanced_options', { mode: 'nanoid', length: nanoid.length }, 'advanced:nanoid')}
                    loading={globalLoading && pendingSectionId === 'advanced:nanoid'}
                >
                    <div>
                        <label className="label">Comprimento (Padrão: 21)</label>
                        <input type="number" min="5" max="128" className="input-field input-mono" value={nanoid.length} onChange={(e) => setNanoid({ length: parseInt(e.target.value) || 21 })} />
                    </div>
                </GeneratorSection>

                {/* 13. FIPS-181 */}
                <GeneratorSection
                    id="fips-181"
                    title="Senha Fonética (FIPS-181)"
                    icon="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    onGenerate={() => handleGenerate('advanced_options', { mode: 'fips181', length: fips181.length }, 'advanced:fips181')}
                    loading={globalLoading && pendingSectionId === 'advanced:fips181'}
                >
                    <div>
                        <label className="label">Comprimento</label>
                        <input type="number" min="6" max="64" className="input-field input-mono" value={fips181.length} onChange={(e) => setFips181({ length: parseInt(e.target.value) || 10 })} />
                    </div>
                </GeneratorSection>

                {/* 14. Bubble Babble */}
                <GeneratorSection
                    id="bubble-babble"
                    title="Bubble Babble"
                    icon="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m8-10a4 4 0 100-8 4 4 0 000 8z"
                    onGenerate={() => handleGenerate('advanced_options', { mode: 'bubble_babble' }, 'advanced:bubble_babble')}
                    loading={globalLoading && pendingSectionId === 'advanced:bubble_babble'}
                >
                    <p className="sidebar-tip-text" style={{ fontSize: '0.85rem', opacity: 0.8 }}>Codificação sonora borbulhante para dados binários.</p>
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
