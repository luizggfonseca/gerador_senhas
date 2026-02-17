import { useState, useEffect } from 'react';
import { usePasswordGenerator } from '../hooks/usePasswordGenerator';
import Sidebar from './Sidebar';
import ConfigPanel from './ConfigPanel';
import ResultPanel from './ResultPanel';

/**
 * Configuração estática dos geradores para metadados de UI (ícones, tipos).
 */
const GENERATORS_CONFIG = {
    diceware_pure: {
        label: 'Diceware (Puro)',
        type: 'diceware',
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    },
    diceware_modified: {
        label: 'Diceware (Mod)',
        type: 'diceware_mod',
        icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    },
    random_classic: {
        label: 'Aleatório / Token',
        type: 'random',
        icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',
    },
};

/**
 * Defaults iniciais para cada tipo de gerador.
 */
const DEFAULTS = {
    random_classic: {
        mode: 'classic',
        length: 16,
        use_upper: true,
        use_lower: true,
        use_numbers: true,
        symbols: '!@#$%^&*()-_=+',
        exclude_ambiguous: false,
    },
    diceware_pure: {
        language: 'portugues',
        num_words: 4,
    },
    diceware_modified: {
        language: 'portugues',
        num_words: 4,
        separator: '-',
        use_uppercase: true,
        use_lowercase: true,
        use_numbers: true,
        use_symbols: true,
        number_count: 1,
        symbol_count: 1,
        capitalize_count: 1,
        numbers_pool: '0123456789',
        symbols_pool: '!@#$%&*',
    },
};

/**
 * Generator — componente principal que orquestra Sidebar, ConfigPanel e ResultPanel.
 */
export default function Generator() {
    const [generators, setGenerators] = useState([]);
    const [selectedGenId, setSelectedGenId] = useState('random_classic');
    const [options, setOptions] = useState(DEFAULTS.random_classic);

    const { result, loading, error, copied, generate, copyToClipboard, reset } = usePasswordGenerator();

    // Carrega lista de geradores da API
    useEffect(() => {
        fetch('http://localhost:8000/api/generators')
            .then((res) => res.json())
            .then((data) => {
                setGenerators(data);
                if (data.length > 0) {
                    // Default para o último (random_classic)
                    const defaultId = data[data.length - 1]?.id || 'random_classic';
                    setSelectedGenId(defaultId);
                }
            })
            .catch(console.error);
    }, []);

    // Reset ao trocar de gerador
    useEffect(() => {
        setOptions(DEFAULTS[selectedGenId] || {});
        reset();
    }, [selectedGenId, reset]);

    const handleOptionChange = (key, value) => {
        setOptions((prev) => ({ ...prev, [key]: value }));
    };

    const handleGenerate = () => {
        generate(selectedGenId, options);
    };

    return (
        <div className="generator-layout">
            <Sidebar
                generators={generators}
                selectedGenId={selectedGenId}
                onSelect={setSelectedGenId}
                generatorsConfig={GENERATORS_CONFIG}
            />

            <div className="generator-main">
                <ConfigPanel
                    selectedGenId={selectedGenId}
                    options={options}
                    onOptionChange={handleOptionChange}
                    generatorsConfig={GENERATORS_CONFIG}
                />

                <ResultPanel
                    result={result}
                    loading={loading}
                    error={error}
                    copied={copied}
                    onGenerate={handleGenerate}
                    onCopy={copyToClipboard}
                />
            </div>
        </div>
    );
}
