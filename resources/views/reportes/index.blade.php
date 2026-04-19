@extends('layouts.app')

@section('content')
<div class="page-header">
    <h1 class="page-title">Reportes y Análisis</h1>
</div>

<div class="card" style="margin-bottom: 2rem;">
    <form action="{{ route('reportes.index') }}" method="GET" style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;">
        <div class="form-group" style="margin-bottom: 0;">
            <label for="mes">Filtrar por Mes</label>
            <input type="month" id="mes" name="mes" value="{{ request('mes', date('Y-m')) }}">
        </div>
        
        <div class="form-group" style="margin-bottom: 0;">
            <label for="estado">Estado de Horas</label>
            <select name="estado" id="estado">
                <option value="">-- Todos --</option>
                <option value="aprobado" {{ request('estado') === 'aprobado' ? 'selected' : '' }}>Aprobadas</option>
                <option value="pendiente" {{ request('estado') === 'pendiente' ? 'selected' : '' }}>Pendientes</option>
                <option value="rechazado" {{ request('estado') === 'rechazado' ? 'selected' : '' }}>Rechazadas</option>
            </select>
        </div>

        <button type="submit" class="btn btn-secondary">Filtrar</button>
        <a href="{{ route('reportes.index') }}" class="btn" style="background-color: transparent; color: var(--color-muted); border: 1px solid var(--color-border);">Limpiar</a>
        
        <!-- Botón Exportar preserva los mismos filtros -->
        <a href="{{ route('reportes.exportar', request()->all()) }}" class="btn btn-success" style="margin-left: auto;">
            📥 Exportar a CSV
        </a>
    </form>
</div>

<div class="card">
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Empleado</th>
                    <th>Cedula / Cargo</th>
                    <th>Fecha</th>
                    <th>Horas</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Evaluado Por</th>
                </tr>
            </thead>
            <tbody>
                @forelse($horasExtras as $he)
                <tr>
                    <td><strong>{{ $he->empleado->nombre_completo ?? 'N/A' }}</strong></td>
                    <td><span style="color: var(--color-muted); font-size: 0.875rem;">{{ $he->empleado->cedula ?? '' }}<br>{{ $he->empleado->cargo ?? '' }}</span></td>
                    <td>{{ $he->fecha->format('Y-m-d') }}</td>
                    <td><strong>{{ $he->cantidad_horas }}h</strong></td>
                    <td>{{ $he->tipo_hora_label }}</td>
                    <td><span class="badge {{ $he->badge_class }}">{{ ucfirst($he->estado) }}</span></td>
                    <td>
                        <span style="color: var(--color-muted); font-size: 0.875rem;">
                            {{ $he->aprobado_por ? $he->aprobadoPor->name : '-' }}
                        </span>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: var(--color-muted);">No hay datos para el criterio seleccionado.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
    <div style="margin-top: 1rem;">
        {{ $horasExtras->appends(request()->except('page'))->links('pagination::bootstrap-4') }}
    </div>
</div>
@endsection
