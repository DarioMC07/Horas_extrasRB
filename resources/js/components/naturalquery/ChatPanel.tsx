import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { X, Send, AlertTriangle, ShieldAlert, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ChatBubble from './ChatBubble';
import MetricCard from './MetricCard';
import ListView from './ListView';
import DataTable from './DataTable';
import SqlToggle from './SqlToggle';
import type { NaturalQueryResponse } from '@/types/naturalquery';

const SESSION_STORAGE_KEY = 'naturalquery_session_id';

interface ChatMessage {
    role: 'user' | 'assistant';
    question?: string;
    answer?: string;
    rawResponse?: NaturalQueryResponse;
}

interface ChatPanelProps {
    open: boolean;
    onClose: () => void;
}

const CONFIDENCE_CONFIG = {
    high: { label: 'Confianza alta', className: 'bg-wise-mint text-wise-positive' },
    medium: { label: 'Confianza media', className: 'bg-wise-warning/30 text-wise-warm-dark' },
    low: { label: 'Confianza baja', className: 'bg-wise-orange/40 text-wise-warm-dark' },
    none: { label: '', className: 'hidden' },
};

export default function ChatPanel({ open, onClose }: ChatPanelProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionReady, setSessionReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(() => localStorage.getItem(SESSION_STORAGE_KEY));
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading, scrollToBottom]);

    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);

    const initSession = useCallback(async () => {
        setError(null);
        try {
            const response = await fetch('/naturalquery/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });
            if (response.ok) {
                const data = await response.json();
                const id = data.sessionId;
                if (id) {
                    localStorage.setItem(SESSION_STORAGE_KEY, id);
                    setSessionId(id);
                }
                setSessionReady(true);
            } else {
                const data = await response.json();
                setError(data.error || 'No se pudo conectar con el servicio de consultas.');
            }
        } catch {
            setError('No se pudo conectar con el servicio de consultas. Verificá que NaturalQuery esté corriendo.');
        }
    }, []);

    useEffect(() => {
        if (open && !sessionReady) {
            if (sessionId) {
                setSessionReady(true);
            } else {
                initSession();
            }
        }
    }, [open, sessionReady, sessionId, initSession]);

    const renderResult = (response: NaturalQueryResponse) => {
        const { render } = response;

        return (
            <>
                {response.answer && response.intent !== 'social' && response.intent !== 'meta' && (
                    <p className="font-medium">{response.answer}</p>
                )}

                {response.intent === 'social' || response.intent === 'meta' || render.type === 'message' ? (
                    <p className="text-wise-warm-dark">
                        {render.type === 'message' ? render.text : response.answer}
                    </p>
                ) : (
                    <>
                        {render.type === 'metric' && (
                            <MetricCard value={render.value} label={render.label} />
                        )}
                        {render.type === 'list' && (
                            <ListView items={render.items} />
                        )}
                        {render.type === 'table' && (
                            <DataTable columns={render.columns} rows={render.rows} />
                        )}
                    </>
                )}

                {response.interpretation && (
                    <div className="mt-3 pt-3 border-t border-wise-light">
                        <div className="prose prose-sm max-w-none text-wise-warm-dark prose-headings:text-wise-black prose-strong:text-wise-black prose-a:text-wise-green">
                            <ReactMarkdown>{response.interpretation.content}</ReactMarkdown>
                        </div>
                    </div>
                )}

                {response.confidence !== 'none' && CONFIDENCE_CONFIG[response.confidence] && (
                    <div className="mt-2 flex items-center gap-1">
                        <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', CONFIDENCE_CONFIG[response.confidence].className)}>
                            {response.confidence === 'low' && <AlertTriangle size={11} />}
                            {CONFIDENCE_CONFIG[response.confidence].label}
                        </span>
                    </div>
                )}

                {response.truncated && (
                    <div className="mt-2 flex items-start gap-2 rounded-lg bg-wise-orange/20 px-3 py-2 text-xs text-wise-warm-dark">
                        <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                        Mostrando 500 de {response.totalRows.toLocaleString('es-AR')} resultados. Refiná tu pregunta para ver todos los datos.
                    </div>
                )}

                {response.warnings && response.warnings.length > 0 && (
                    <div className="mt-2 text-xs text-wise-gray italic">
                        {response.warnings.map((w, i) => <p key={i}>{w}</p>)}
                    </div>
                )}

                <SqlToggle sql={response.sql} />
            </>
        );
    };

    const sendQuestion = async (e?: FormEvent) => {
        e?.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || loading || !sessionReady) return;

        setInput('');
        setLoading(true);
        setError(null);

        const currentSessionId = sessionId || localStorage.getItem(SESSION_STORAGE_KEY);

        let history: { question: string; answer: string }[] = [];
        setMessages((prev) => {
            history = prev
                .filter((m) => m.role === 'user' && m.question)
                .slice(-5)
                .map((m) => ({
                    question: m.question!,
                    answer: '',
                }));

            // Fill in answers from following assistant messages
            for (let i = 0; i < prev.length - 1; i++) {
                if (prev[i].role === 'user' && prev[i + 1].role === 'assistant' && prev[i + 1].rawResponse) {
                    const answerIdx = history.findIndex((h) => h.question === prev[i].question);
                    if (answerIdx >= 0) {
                        history[answerIdx].answer = prev[i + 1].rawResponse!.answer || '';
                    }
                }
            }

            return [...prev, { role: 'user', question: trimmed } as ChatMessage];
        });

        try {
            const response = await fetch('/naturalquery/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    sessionId: currentSessionId,
                    question: trimmed,
                    history,
                    interpret: 'rich',
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                if (data.code === 'INVALID_SESSION') {
                    localStorage.removeItem(SESSION_STORAGE_KEY);
                    setSessionId(null);
                    setSessionReady(false);
                    setError('Sesión expirada. Reconectando...');
                } else if (data.code === 'RATE_LIMIT_EXCEEDED') {
                    setError(data.error || 'Demasiadas consultas. Intentá de nuevo en un minuto.');
                } else {
                    setError(data.error || 'Ocurrió un error al procesar la consulta.');
                }
                setLoading(false);
                return;
            }

            const data: NaturalQueryResponse = await response.json();

            const answerText = data.answer || (data.render.type === 'message' ? data.render.text : 'Sin respuesta.');

            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    answer: answerText,
                    rawResponse: data,
                } as ChatMessage,
            ]);
        } catch {
            setError('Error de conexión. Verificá que el servicio esté disponible.');
        } finally {
            setLoading(false);
        }
    };

    const resetSession = () => {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        setSessionId(null);
        setSessionReady(false);
        setError(null);
        setMessages([]);
        setTimeout(() => initSession(), 100);
    };

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 transition-opacity"
                    onClick={onClose}
                />
            )}

            <div
                className={cn(
                    'fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-wise-surface border-l border-wise-light flex flex-col shadow-xl transition-transform duration-300',
                    open ? 'translate-x-0' : 'translate-x-full'
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-wise-light flex-shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-wise-green text-xs font-bold text-wise-black flex-shrink-0">
                            RB
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-sm font-semibold text-wise-black truncate">Consultas NL</h2>
                            <p className="text-xs text-wise-gray truncate">Asistente de datos</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        {error && (
                            <button
                                onClick={resetSession}
                                className="rounded p-1.5 text-wise-danger hover:bg-wise-danger/10 transition-colors"
                                title="Reconectar"
                            >
                                <ShieldAlert size={16} />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="rounded p-1.5 text-wise-gray hover:bg-wise-light hover:text-wise-black transition-colors"
                            aria-label="Cerrar chat"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3">
                    {error && (
                        <div className="flex items-start gap-2 rounded-lg bg-wise-danger/10 px-3 py-2 mb-4 text-sm text-wise-danger">
                            <ShieldAlert size={16} className="flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Error</p>
                                <p className="text-wise-warm-dark">{error}</p>
                            </div>
                        </div>
                    )}

                    {messages.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wise-mint mb-4">
                                <Clock size={24} className="text-wise-green" />
                            </div>
                            <p className="text-sm font-medium text-wise-black">Consultas en lenguaje natural</p>
                            <p className="mt-1 text-xs text-wise-gray">
                                Preguntá lo que quieras sobre los datos. Ej: "¿Cuántas horas extra se aprobaron este mes?"
                            </p>
                        </div>
                    )}

                    {messages.map((msg, i) => {
                        if (msg.rawResponse) {
                            return (
                                <ChatBubble key={i} role="assistant" content={renderResult(msg.rawResponse)} />
                            );
                        }
                        const text = msg.role === 'user' ? msg.question : msg.answer;
                        return (
                            <ChatBubble key={i} role={msg.role} content={<p>{text}</p>} />
                        );
                    })}

                    {loading && (
                        <ChatBubble
                            role="assistant"
                            content={
                                <div className="flex items-center gap-2 text-wise-gray">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span className="text-sm">Consultando...</span>
                                </div>
                            }
                        />
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendQuestion} className="flex-shrink-0 border-t border-wise-light p-4">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    onClose();
                                }
                            }}
                            placeholder={sessionReady ? 'Escribí tu consulta...' : 'Conectando...'}
                            disabled={!sessionReady || loading}
                            className="flex-1 rounded-lg border border-wise-light bg-wise-bg px-3 py-2 text-sm text-wise-black placeholder:text-wise-gray focus:outline-none focus:ring-2 focus:ring-wise-green/30 focus:border-wise-green disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!sessionReady || loading || !input.trim()}
                            className="rounded-lg bg-wise-green p-2 text-wise-black hover:bg-wise-green/80 disabled:opacity-40 transition-colors"
                            aria-label="Enviar consulta"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
