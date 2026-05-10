import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

interface SqlToggleProps {
    sql: string | null;
}

export default function SqlToggle({ sql }: SqlToggleProps) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!sql) return null;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(sql);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-3">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 text-xs font-medium text-wise-gray hover:text-wise-black transition-colors"
            >
                {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                Ver SQL
            </button>
            {open && (
                <div className="mt-2 relative rounded-lg border border-wise-light bg-wise-bg p-3">
                    <button
                        onClick={handleCopy}
                        className="absolute top-2 right-2 rounded p-1 text-wise-gray hover:bg-wise-light hover:text-wise-black transition-colors"
                        aria-label="Copiar SQL"
                    >
                        {copied ? <Check size={14} className="text-wise-green" /> : <Copy size={14} />}
                    </button>
                    <pre className="text-xs text-wise-warm-dark overflow-x-auto pr-8 whitespace-pre-wrap break-all">
                        {sql}
                    </pre>
                </div>
            )}
        </div>
    );
}
