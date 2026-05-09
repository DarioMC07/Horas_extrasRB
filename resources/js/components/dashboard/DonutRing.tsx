interface DonutSegment {
    label: string;
    value: number;
    color: string;
}

interface DonutRingProps {
    segments: DonutSegment[];
    /** Text shown in the center of the ring */
    centerLabel?: string;
    /** Size in px */
    size?: number;
    /** Stroke thickness */
    thickness?: number;
}

export function DonutRing({ segments, centerLabel = 'Total', size = 180, thickness = 22 }: DonutRingProps) {
    const total = segments.reduce((sum, s) => sum + s.value, 0);
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;

    if (total === 0) {
        return (
            <div className="flex flex-col items-center justify-center" style={{ height: size }}>
                <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-wise-light">
                    <p className="text-sm text-wise-gray">Sin datos</p>
                </div>
            </div>
        );
    }

    let cumulativeOffset = 0;

    const arcs = segments
        .filter(s => s.value > 0)
        .map((segment) => {
            const dashLength = (segment.value / total) * circumference;
            const dashOffset = cumulativeOffset;
            cumulativeOffset += dashLength;
            return { ...segment, dashLength, dashOffset };
        });

    return (
        <div className="flex flex-col items-center gap-4">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {arcs.map((arc, i) => (
                    <circle
                        key={i}
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={arc.color}
                        strokeWidth={thickness}
                        strokeDasharray={`${arc.dashLength} ${circumference - arc.dashLength}`}
                        strokeDashoffset={-arc.dashOffset}
                        strokeLinecap="butt"
                        className="transition-all duration-500"
                        style={{ transformOrigin: '50% 50%', transform: 'rotate(-90deg)' }}
                    />
                ))}
                <text
                    x={size / 2}
                    y={size / 2 - 4}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-sm fill-wise-gray"
                >
                    {centerLabel}
                </text>
                <text
                    x={size / 2}
                    y={size / 2 + 14}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-xl font-bold fill-wise-black"
                >
                    {total.toFixed(total % 1 === 0 ? 0 : 1)}
                </text>
            </svg>

            <div className="flex flex-wrap justify-center gap-3">
                {segments.map((segment, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs">
                        <span
                            className="block h-2.5 w-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: segment.color }}
                        />
                        <span className="text-wise-gray whitespace-nowrap">
                            {segment.label} ({segment.value})
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function DonutRingSkeleton({ size = 180 }: { size?: number }) {
    return (
        <div className="flex flex-col items-center gap-4">
            <div
                className="animate-pulse rounded-full border-[22px] border-wise-light"
                style={{ width: size, height: size }}
            />
            <div className="flex gap-3">
                {[60, 40, 30].map((w, i) => (
                    <div key={i} className="h-3 animate-pulse rounded bg-wise-light" style={{ width: w }} />
                ))}
            </div>
        </div>
    );
}
