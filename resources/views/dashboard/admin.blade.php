@extends('layouts.app')

@section('content')
<div class="page-header">
    <h1 class="page-title">Dashboard Administrativo</h1>
    <a href="{{ route('horas-extras.index') }}" class="btn btn-primary">Ver Todas las Solicitudes</a>
</div>

<!-- KPIs -->
<div class="grid-cols-3">
    <div class="card kpi-card">
        <span class="kpi-label">Horas Aprobadas (Mes)</span>
        <span class="kpi-value">{{ number_format($kpis['total_horas_aprobadas'], 1) }}h</span>
    </div>
    <div class="card kpi-card">
        <span class="kpi-label">Solicitudes Pendientes</span>
        <span class="kpi-value" style="color: var(--color-warning);">{{ $kpis['solicitudes_pendientes'] }}</span>
    </div>
    <div class="card kpi-card">
        <span class="kpi-label">Empleados Activos</span>
        <span class="kpi-value" style="color: var(--color-secondary);">{{ $kpis['empleados_activos'] }}</span>
    </div>
</div>

<div class="grid-cols-2">
    <!-- Chart: Horas por Tipo -->
    <div class="card">
        <h3 style="margin-bottom: 1rem; color: var(--color-muted); font-size: 0.875rem; text-transform: uppercase;">Distribución por Tipo de Hora</h3>
        <canvas id="chartTipoHora"></canvas>
    </div>

    <!-- Chart: Top Empleados -->
    <div class="card">
        <h3 style="margin-bottom: 1rem; color: var(--color-muted); font-size: 0.875rem; text-transform: uppercase;">Top 5 Empleados (Mes Actual)</h3>
        <canvas id="chartTopEmpleados"></canvas>
    </div>
</div>

<!-- Últimas solicitudes pendientes -->
<div class="card">
    <h3 style="margin-bottom: 1rem; color: var(--color-muted); font-size: 0.875rem; text-transform: uppercase;">Últimas Solicitudes Pendientes</h3>
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
                        <td>{{ $he->fecha->format('Y-m-d') }}</td>
                        <td>{{ $he->empleado->nombre_completo ?? 'N/A' }}</td>
                        <td><strong>{{ $he->cantidad_horas }}h</strong></td>
                        <td><span class="badge badge-info">{{ $he->tipo_hora_label }}</span></td>
                        <td>
                            <a href="{{ route('horas-extras.show', $he->id) }}" class="btn btn-secondary">Revisar</a>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @else
        <div style="text-align: center; padding: 2rem; color: var(--color-muted);">
            No hay solicitudes pendientes de aprobación en este momento. 🎉
        </div>
    @endif
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Grafica Dona - Tipo de Horas
        const ctxTipo = document.getElementById('chartTipoHora').getContext('2d');
        const dataTipo = @json($chartHorasPorTipo);
        
        new Chart(ctxTipo, {
            type: 'doughnut',
            data: {
                labels: Object.keys(dataTipo),
                datasets: [{
                    data: Object.values(dataTipo),
                    backgroundColor: ['#6C63FF', '#2DD4BF', '#F59E0B'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#F1F5F9' } }
                }
            }
        });

        // Grafica Barras - Top Empleados
        const ctxTop = document.getElementById('chartTopEmpleados').getContext('2d');
        const dataTop = @json($topEmpleados);
        
        new Chart(ctxTop, {
            type: 'bar',
            data: {
                labels: Object.keys(dataTop),
                datasets: [{
                    label: 'Horas Aprobadas',
                    data: Object.values(dataTop),
                    backgroundColor: '#6C63FF',
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                scales: {
                    x: { grid: { color: '#334155' }, ticks: { color: '#94A3B8' } },
                    y: { grid: { display: false }, ticks: { color: '#94A3B8' } }
                },
                plugins: { legend: { display: false } }
            }
        });
    });
</script>
@endsection
