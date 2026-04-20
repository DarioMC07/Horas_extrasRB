@extends('layouts.app')

@section('content')

<div class="page-header">
    <div>
        <h1 class="page-title">Dashboard Administrativo</h1>
        <p class="page-subtitle">Resumen de operaciones del mes actual</p>
    </div>
    <a href="{{ route('horas-extras.index') }}" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18l6-6-6-6"/>
        </svg>
        Ver Todas las Solicitudes
    </a>
</div>

<!-- KPIs -->
<div class="grid-cols-3">
    <div class="card kpi-card">
        <span class="kpi-label">Horas Aprobadas (Mes)</span>
        <span class="kpi-value">{{ number_format($kpis['total_horas_aprobadas'], 1) }}h</span>
        <span class="kpi-trend">Horas extra autorizadas en el período</span>
    </div>
    <div class="card kpi-card">
        <span class="kpi-label">Solicitudes Pendientes</span>
        <span class="kpi-value" style="color: var(--color-warning);">{{ $kpis['solicitudes_pendientes'] }}</span>
        <span class="kpi-trend">Requieren revisión gerencial</span>
    </div>
    <div class="card kpi-card">
        <span class="kpi-label">Empleados Activos</span>
        <span class="kpi-value" style="color: var(--color-secondary);">{{ $kpis['empleados_activos'] }}</span>
        <span class="kpi-trend">Personal registrado en el sistema</span>
    </div>
</div>

<div class="grid-cols-2">
    <!-- Chart: Tendencia Últimos 6 Meses -->
    <div class="card">
        <div class="card-header">
            <span class="card-title">Tendencia de Horas Extras — Últimos 6 Meses</span>
        </div>
        <canvas id="chartTendencia" style="max-height: 220px;"></canvas>
    </div>

    <!-- Chart: Top Empleados -->
    <div class="card">
        <div class="card-header">
            <span class="card-title">Top 5 Empleados — Mes Actual</span>
        </div>
        <canvas id="chartTopEmpleados"></canvas>
    </div>
</div>

<!-- Últimas solicitudes pendientes -->
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
        // Gráfica Línea — Tendencia 6 meses
        const ctxTend = document.getElementById('chartTendencia').getContext('2d');
        const dataTend = @json($chartTendencia);

        new Chart(ctxTend, {
            type: 'line',
            data: {
                labels: Object.keys(dataTend),
                datasets: [{
                    label: 'Horas Aprobadas',
                    data: Object.values(dataTend),
                    borderColor: '#16A34A',
                    backgroundColor: 'rgba(22, 163, 74, 0.08)',
                    borderWidth: 2,
                    pointBackgroundColor: '#16A34A',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        grid: { color: '#E2E8E2' },
                        ticks: { color: '#6B7280', font: { family: 'Inter', size: 11 } }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: '#E2E8E2' },
                        ticks: { color: '#6B7280', font: { family: 'Inter', size: 11 } }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: ctx => ` ${ctx.parsed.y}h aprobadas`
                        }
                    }
                }
            }
        });

        // Gráfica Barras — Top Empleados
        const ctxTop = document.getElementById('chartTopEmpleados').getContext('2d');
        const dataTop = @json($topEmpleados);

        new Chart(ctxTop, {
            type: 'bar',
            data: {
                labels: Object.keys(dataTop),
                datasets: [{
                    label: 'Horas Aprobadas',
                    data: Object.values(dataTop),
                    backgroundColor: 'rgba(22, 163, 74, 0.15)',
                    borderColor: '#16A34A',
                    borderWidth: 1.5,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                scales: {
                    x: {
                        grid: { color: '#E2E8E2' },
                        ticks: { color: '#6B7280', font: { family: 'Inter', size: 11 } }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: '#374151', font: { family: 'Inter', size: 12 } }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    });
</script>
@endsection
