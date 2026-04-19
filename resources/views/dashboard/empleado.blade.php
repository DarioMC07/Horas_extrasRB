@extends('layouts.app')

@section('content')
<div class="page-header">
    <h1 class="page-title">Mi Tablero</h1>
    <a href="{{ route('horas-extras.create') }}" class="btn btn-primary">Registrar Horas Extras</a>
</div>

<!-- KPIs -->
<div class="grid-cols-3">
    <div class="card kpi-card">
        <span class="kpi-label">Mis Horas Aprobadas (Mes)</span>
        <span class="kpi-value" style="color: var(--color-success);">{{ number_format($kpis['mis_horas_mes'], 1) }}h</span>
    </div>
    <div class="card kpi-card">
        <span class="kpi-label">Pendientes de Aprobación</span>
        <span class="kpi-value" style="color: var(--color-warning);">{{ $kpis['mis_pendientes'] }}</span>
    </div>
    <div class="card kpi-card">
        <span class="kpi-label">Rechazadas (Mes)</span>
        <span class="kpi-value" style="color: var(--color-danger);">{{ $kpis['mis_rechazadas'] }}</span>
    </div>
</div>

<div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="color: var(--color-muted); font-size: 0.875rem; text-transform: uppercase;">Historial Reciente</h3>
        <a href="{{ route('horas-extras.index') }}" style="font-size: 0.875rem;">Ver todo mi historial &rarr;</a>
    </div>

    @if(count($miHistorial) > 0)
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Horas</th>
                        <th>Tipo</th>
                        <th>Motivo</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($miHistorial as $he)
                    <tr>
                        <td>{{ $he->fecha->format('Y-m-d') }}</td>
                        <td><strong>{{ $he->cantidad_horas }}h</strong></td>
                        <td>{{ $he->tipo_hora_label }}</td>
                        <td>{{ Str::limit($he->motivo, 40) }}</td>
                        <td>
                            <span class="badge {{ $he->badge_class }}">{{ ucfirst($he->estado) }}</span>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @else
        <div style="text-align: center; padding: 2rem; color: var(--color-muted);">
            No tienes horas extras registradas recientemente.
        </div>
    @endif
</div>
@endsection
