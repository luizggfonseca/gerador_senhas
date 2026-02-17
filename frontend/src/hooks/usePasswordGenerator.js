import { useState, useCallback } from 'react';

const API_BASE = 'http://localhost:8000';

/**
 * Hook customizado para gerenciamento de geração de senhas.
 * Centraliza toda a lógica de estado e comunicação com a API.
 */
export function usePasswordGenerator() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const generate = useCallback(async (generatorId, options) => {
        setLoading(true);
        setError(null);
        setCopied(false);

        try {
            const res = await fetch(`${API_BASE}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    generator_id: generatorId,
                    options,
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.detail || `Erro ${res.status}`);
            }

            const data = await res.json();
            setResult(data);
            return data;
        } catch (e) {
            setError(e.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const copyToClipboard = useCallback(async () => {
        if (!result?.password) return;

        try {
            await navigator.clipboard.writeText(result.password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback para navegadores antigos
            const textarea = document.createElement('textarea');
            textarea.value = result.password;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [result]);

    const reset = useCallback(() => {
        setResult(null);
        setError(null);
        setCopied(false);
    }, []);

    return {
        result,
        loading,
        error,
        copied,
        generate,
        copyToClipboard,
        reset,
    };
}
