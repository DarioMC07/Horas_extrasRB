@extends('layouts.app')

@section('content')

<div class="page-header">
    <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Resumen de horas extras del mes</p>
    </div>
    <a href="{{ route('horas-extras.index') }}" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18l6-6-6-6"/>
        </svg>
        Ver Solicitudes
    </a>
</div>

<div class="grid-cols-3">
    <div class="card kpi-card">
        <span class="kpi-label">Horas Aprobadas (Mes)</span>
        <span class="kpi-value">{{ number_format($kpis['total_horas_aprobadas'], 1) }}h</span>
        <span class="kpi-trend">Horas autorizadas en el período</span>
    </div>
    <div class="card kpi-card">
        <span class="kpi-label">Solicitudes Pendientes</span>
        <span class="kpi-value" style="color: var(--color-warning);">{{ $kpis['solicitudes_pendientes'] }}</span>
        <span class="kpi-trend">Requieren revisión gerencial</span>
    </div>
    <div class="card kpi-card">
        <span class="kpi-label">Empleados Activos</span>
        <span class="kpi-value">{{ $kpis['empleados_activos'] }}</span>
        <span class="kpi-trend">Personal registrado en el sistema</span>
    </div>
</div>

<div class="grid-cols-2">
    <div class="card">
        <div class="card-header">
            <span class="card-title">Tendencia — Últimos 6 Meses</span>
        </div>
        <div id="chartTendencia" style="width: 100%; height: 240px;"></div>
    </div>

    <div class="card">
        <div class="card-header">
            <span class="card-title">Top 5 Empleados — Mes Actual</span>
        </div>
        <div id="chartTopEmpleados" style="width: 100%; height: 240px;"></div>
    </div>
</div>

<div class="card">
    <div class="card-header">
        <span class="card-title">Distribución Semanal — Histograma</span>
    </div>
    <div id="chartHistogram" style="width: 100%; height: 180px;"></div>
</div>

<div class="card">
    <div class="card-header">
        <span class="card-title">Últimas Solicitudes Pendientes</span>
        <a href="{{ route('horas-extras.index') }}?estado=pendiente" class="btn btn-sm btn-ghost">Ver todas</a>
    </div>
    <hr class="card-divider">

    @if(count($ultimasPendientes) > 0)
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Empleado</th>
                        <th>Horas</th>
                        <th>Tipo</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($ultimasPendientes as $he)
                    <tr>
                        <td>{{ $he->fecha->format('d/m/Y') }}</td>
                        <td><strong>{{ $he->empleado->nombre_completo ?? 'N/A' }}</strong></td>
                        <td><strong>{{ $he->cantidad_horas }}h</strong></td>
                        <td><span class="badge badge-info">{{ $he->tipo_hora_label }}</span></td>
                        <td>
                            <a href="{{ route('horas-extras.show', $he->id) }}" class="btn btn-sm btn-secondary">
                                Revisar
                            </a>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @else
        <div class="empty-state">
            <svg class="empty-state-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <p>No hay solicitudes pendientes de aprobación.</p>
        </div>
    @endif
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const chartOptions = {
        layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: '#868685',
            fontFamily: 'Inter, sans-serif',
            fontSize: 11,
        },
        grid: {
            vertLines: { color: 'rgba(14, 15, 12, 0.08)' },
            horzLines: { color: 'rgba(14, 15, 12, 0.08)' },
        },
        crosshair: {
            mode: CrosshairMode.Normal,
            vertLine: { color: '#9fe870', width: 1, style: 2, labelBackgroundColor: '#163300' },
            horzLine: { color: '#9fe870', width: 1, style: 2, labelBackgroundColor: '#163300' },
        },
        rightPriceScale: {
            borderColor: 'rgba(14, 15, 12, 0.12)',
            textColor: '#868685',
        },
        timeScale: {
            borderColor: 'rgba(14, 15, 12, 0.12)',
            timeVisible: false,
        },
        handleScroll: false,
        handleScale: false,
    };

    const rawTendencia = @json($chartTendencia);
    // Construir mapa time -> label para el formatter del eje X
    const tendenciaLabelMap = {};
    rawTendencia.forEach(d => { tendenciaLabelMap[d.time] = d.label; });
    const tendencyData = rawTendencia.map(d => ({ time: d.time, value: d.value }));

    const chart1 = createChart(document.getElementById('chartTendencia'), {
        ...chartOptions,
        width: document.getElementById('chartTendencia').clientWidth,
        height: 240,
        timeScale: {
            ...chartOptions.timeScale,
            tickMarkFormatter: (time) => {
                const key = typeof time === 'object'
                    ? `${time.year}-${String(time.month).padStart(2,'0')}-01`
                    : time;
                return tendenciaLabelMap[key] || key;
            },
        },
    });
    const lineSeries = chart1.addSeries(LineSeries, {
        color: '#9fe870',
        lineWidth: 2.5,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 5,
        crosshairMarkerBorderColor: '#163300',
        crosshairMarkerBackgroundColor: '#9fe870',
        priceFormat: { type: 'custom', formatter: v => `${v.toFixed(1)}h` },
    });
    lineSeries.setData(tendencyData);
    chart1.timeScale().fitContent();

    const dataTop = @json($topEmpleados);
    const topLabels = Object.keys(dataTop);
    const topValues = Object.values(dataTop);
    const chart2 = createChart(document.getElementById('chartTopEmpleados'), {
        ...chartOptions,
        width: document.getElementById('chartTopEmpleados').clientWidth,
        height: 240,
    });
    // lightweight-charts requiere time en formato YYYY-MM-DD o timestamp numérico.
    // Usamos fechas ficticias consecutivas como índice para los empleados.
    const baseDate = new Date('2024-01-01');
    const barData = topLabels.map((label, i) => {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + i);
        return {
            time: d.toISOString().slice(0, 10),
            value: topValues[i],
            color: '#9fe870',
        };
    });
    chart2.applyOptions({
        timeScale: {
            ...chartOptions.timeScale,
            tickMarkFormatter: (time) => {
                // LWC v5 pasa time como objeto {year, month, day}
                const key = typeof time === 'object'
                    ? `${time.year}-${String(time.month).padStart(2,'0')}-${String(time.day).padStart(2,'0')}`
                    : time;
                const idx = barData.findIndex(d => d.time === key);
                return idx !== -1 ? topLabels[idx] : key;
            },
        },
    });
    const barSeries = chart2.addSeries(HistogramSeries, {
        color: '#9fe870',
        priceFormat: { type: 'custom', formatter: v => `${v.toFixed(0)}h` },
    });
    barSeries.setData(barData);
    chart2.timeScale().fitContent();

    const histData = @json($chartHistogram);
    const chart3 = createChart(document.getElementById('chartHistogram'), {
        ...chartOptions,
        width: document.getElementById('chartHistogram').clientWidth,
        height: 180,
        rightPriceScale: { ...chartOptions.rightPriceScale, scaleMargins: { top: 0.1, bottom: 0 } },
    });
    const histSeries = chart3.addSeries(HistogramSeries, {
        color: '#9fe870',
        priceFormat: { type: 'custom', formatter: v => `${v.toFixed(0)}h` },
    });
    histSeries.setData(histData);
    chart3.timeScale().fitContent();

    window.addEventListener('resize', () => {
        chart1.resize(document.getElementById('chartTendencia').clientWidth, 240);
        chart2.resize(document.getElementById('chartTopEmpleados').clientWidth, 240);
        chart3.resize(document.getElementById('chartHistogram').clientWidth, 180);
    });
});
</script>
@endsection