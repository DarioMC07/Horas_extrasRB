import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, LineSeries, AreaSeries, HistogramSeries, ColorType, CrosshairMode, LineType } from 'lightweight-charts';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartDataPoint {
    time: string;
    value: number;
    label?: string;
    color?: string;
}

interface LightweightChartProps {
    type: 'line' | 'area' | 'bar' | 'sparkline';
    data: ChartDataPoint[];
    height?: number;
    /** Override default color (wise-green: #9fe870) */
    color?: string;
    /** Show crosshair on hover */
    crosshair?: boolean;
}

export function LightweightChart({ type, data, height = 260, color = '#9fe870', crosshair = true }: LightweightChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    useEffect(() => {
        if (!containerRef.current || !data.length) return;

        const isMinimal = type === 'sparkline';

        const chart = createChart(containerRef.current, {
            width: containerRef.current.clientWidth,
            height,
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#868685',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 11,
            },
            grid: isMinimal
                ? { vertLines: { visible: false }, horzLines: { visible: false } }
                : {
                    vertLines: { color: 'rgba(14,15,12,0.06)', style: 1 },
                    horzLines: { color: 'rgba(14,15,12,0.06)', style: 1 },
                },
            crosshair: isMinimal || !crosshair
                ? { mode: CrosshairMode.Hidden }
                : {
                    mode: CrosshairMode.Normal,
                    vertLine: { color: color, width: 1, style: 3, labelBackgroundColor: color },
                    horzLine: { color: color, width: 1, style: 3, labelBackgroundColor: color },
                },
            rightPriceScale: isMinimal
                ? { visible: false }
                : {
                    borderVisible: false,
                    scaleMargins: { top: 0.15, bottom: 0.15 },
                },
            timeScale: isMinimal
                ? { visible: false }
                : {
                    borderVisible: false,
                    fixLeftEdge: true,
                    fixRightEdge: true,
                },
            handleScroll: false,
            handleScale: false,
        });

        chartRef.current = chart;

        if (type === 'line' || type === 'sparkline') {
            const series = chart.addSeries(LineSeries, {
                color,
                lineWidth: 2,
                lineType: LineType.Simple,
                crosshairMarkerVisible: !isMinimal,
                crosshairMarkerRadius: 4,
                crosshairMarkerBorderColor: color,
                crosshairMarkerBackgroundColor: '#ffffff',
                priceLineVisible: !isMinimal,
                lastValueVisible: !isMinimal,
                priceFormat: { type: 'custom', formatter: (v: number) => `${v.toFixed(1)}h` },
            });
            series.setData(data.map(d => ({ time: d.time, value: d.value })));
        } else if (type === 'area') {
            const series = chart.addSeries(AreaSeries, {
                lineColor: color,
                topColor: `${color}33`,
                bottomColor: `${color}05`,
                lineWidth: 2.5,
                crosshairMarkerVisible: true,
                crosshairMarkerRadius: 4,
                crosshairMarkerBorderColor: color,
                crosshairMarkerBackgroundColor: '#ffffff',
                priceLineVisible: true,
                priceFormat: { type: 'custom', formatter: (v: number) => `${v.toFixed(1)}h` },
            });
            series.setData(data.map(d => ({ time: d.time, value: d.value })));
        } else if (type === 'bar') {
            const series = chart.addSeries(HistogramSeries, {
                color,
                priceFormat: { type: 'custom', formatter: (v: number) => `${v.toFixed(0)}h` },
            });
            series.setData(data.map(d => ({
                time: d.time,
                value: d.value,
                color: d.color || color,
            })));
        }

        chart.timeScale().fitContent();

        const handleResize = () => {
            if (containerRef.current && chartRef.current) {
                chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
            chartRef.current = null;
        };
    }, [data, height, color, crosshair, type]);

    if (!data.length) {
        return (
            <div className="flex items-center justify-center rounded-lg bg-wise-bg/50" style={{ height }}>
                <p className="text-sm text-wise-gray">Sin datos disponibles</p>
            </div>
        );
    }

    return (
        <div className="relative rounded-lg bg-wise-bg/30 p-2">
            <div ref={containerRef} style={{ width: '100%', height }} />
        </div>
    );
}

export function ChartSkeleton({ height = 260 }: { height?: number }) {
    return <Skeleton className="w-full rounded-lg" style={{ height }} />;
}
