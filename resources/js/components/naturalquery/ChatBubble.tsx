import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
    role: 'user' | 'assistant';
    content: ReactNode;
    timestamp?: string;
}

export default function ChatBubble({ role, content, timestamp }: ChatBubbleProps) {
    const isUser = role === 'user';

    return (
        <div className={cn('flex gap-2 mb-4', isUser ? 'justify-end' : 'justify-start')}>
            {!isUser && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-wise-green text-xs font-bold text-wise-black flex-shrink-0 mt-1">
                    RB
                </div>
            )}
            <div
                className={cn(
                    'max-w-[85%] rounded-lg px-4 py-3 text-sm',
                    isUser
                        ? 'bg-wise-mint text-wise-black'
                        : 'bg-wise-surface border border-wise-light text-wise-black'
                )}
            >
                <div className="space-y-2">{content}</div>
                {timestamp && (
                    <p className="mt-1 text-xs text-wise-gray">{timestamp}</p>
                )}
            </div>
        </div>
    );
}
