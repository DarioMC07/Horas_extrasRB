import type { ListItem } from '@/types/naturalquery';

interface ListViewProps {
    items: ListItem[];
}

export default function ListView({ items }: ListViewProps) {
    return (
        <div className="space-y-2">
            {items.map((item, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-wise-light px-4 py-3"
                >
                    <span className="text-sm font-medium text-wise-black">{item.label}</span>
                    <span className="text-sm font-semibold text-wise-green tabular-nums">
                        {typeof item.value === 'number' ? item.value.toLocaleString('es-AR') : item.value}
                    </span>
                </div>
            ))}
        </div>
    );
}
