interface MetricCardProps {
    value: number;
    label: string;
}

export default function MetricCard({ value, label }: MetricCardProps) {
    return (
        <div className="rounded-lg bg-wise-mint p-6 text-center">
            <div className="text-4xl font-bold text-wise-green tabular-nums">
                {value.toLocaleString('es-AR')}
            </div>
            <p className="mt-2 text-sm text-wise-warm-dark">{label}</p>
        </div>
    );
}
