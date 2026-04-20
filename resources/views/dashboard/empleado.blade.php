@extends('layouts.app')

@section('content')

<div class="page-header">
    <div>
        <h1 class="page-title">Mi Tablero</h1>
        <p class="page-subtitle">Resumen de tus horas extras registradas</p>
    </div>
    <a href="{{ route('horas-extras.create') }}" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Registrar Horas Extras
    </a>
</div>

<!-- KPIs -->
<div class="grid-cols-3">
    <div class="card kpi-card">
        <span class="kpi-label">Mis Horas Aprobadas (Mes)</span>
        <span class="kpi-value" style="color: var(--color-success);">{{ number_format($kpis['mis_horas_mes'], 1) }}h</span>
        <span class="kpi-trend">Horas autorizadas este período</span>
    </div>
    <div class="card kpi-card">
        <span class="kpi-label">Pendientes de Aprobación</span>
        <span class="kpi-value" style="color: var(--color-warning);">{{ $kpis['mis_pendientes'] }}</span>
        <span class="kpi-trend">En espera de revisión gerencial</span>
    </div>
    <div class="card kpi-card">
        <span class="kpi-label">Rechazadas (Mes)</span>
        <span class="kpi-value" style="color: var(--color-danger);">{{ $kpis['mis_rechazadas'] }}</span>
        <span class="kpi-trend">Solicitudes no autorizadas</span>
    </div>
</div>

<div class="card">
    <div class="card-header">
        <span class="card-title">Historial Reciente</span>
        <a href="{{ route('horas-extras.index') }}" class="btn btn-sm btn-ghost">
            Ver historial completo
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18l6-6-6-6"/>
            </svg>
        </a>
    </div>
    <hr class="card-divider">

    @if(count($miHistorial) > 0)
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Horas</th>
                        <th>Motivo</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($miHistorial as $he)
                    <tr>
                        <td>{{ $he->fecha->format('d/m/Y') }}</td>
                        <td><strong>{{ $he->cantidad_horas }}h</strong></td>
                        <td style="color: var(--color-muted);">{{ Str::limit($he->motivo, 45) }}</td>
                        <td><span class="badge {{ $he->badge_class }}">{{ ucfirst($he->estado) }}</span></td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @else
        <div class="empty-state">
            <svg class="empty-state-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>
            <p>No tienes horas extras registradas recientemente.</p>
        </div>
    @endif
</div>

@endsection
