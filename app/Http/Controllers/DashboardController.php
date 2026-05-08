<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Models\HoraExtra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return $this->dashboardAdmin();
        }

        return $this->dashboardEmpleado($user);
    }

    private function dashboardAdmin()
    {
        $mesActual = now()->month;
        $anioActual = now()->year;

        // KPIs principales
        $kpis = [
            'total_horas_aprobadas' => HoraExtra::where('estado', 'aprobado')
                ->whereMonth('fecha', $mesActual)
                ->whereYear('fecha', $anioActual)
                ->sum('cantidad_horas'),
                
            'solicitudes_pendientes' => HoraExtra::where('estado', 'pendiente')->count(),
            
            'empleados_activos' => Empleado::where('activo', true)->count(),
        ];

        // Datos para gráficas
        // 1. Tendencia de horas extras aprobadas (últimos 6 meses) - Línea
        // La key DEBE ser yyyy-mm-dd (primer día del mes);
        // el label legible se aplica en JS con tickMarkFormatter.
        $chartTendencia = [];
        for ($i = 5; $i >= 0; $i--) {
            $fecha = now()->subMonths($i);
            $total = HoraExtra::where('estado', 'aprobado')
                ->whereMonth('fecha', $fecha->month)
                ->whereYear('fecha', $fecha->year)
                ->sum('cantidad_horas');
            $chartTendencia[] = [
                'time'  => $fecha->format('Y-m-01'),
                'value' => (float) $total,
                'label' => $fecha->translatedFormat('M Y'),
            ];
        }

        // 2. Top 5 empleados con más horas (Barras horizontales)
        $topEmpleados = HoraExtra::select('empleado_id', DB::raw('SUM(cantidad_horas) as total'))
            ->where('estado', 'aprobado')
            ->whereMonth('fecha', $mesActual)
            ->groupBy('empleado_id')
            ->orderByDesc('total')
            ->limit(5)
            ->with('empleado')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->empleado->nombre_completo => (float) $item->total];
            })->toArray();

        // 3. Datos para histograma (Lightweight Charts) - últimas 6 semanas del mes actual
        $chartHistogram = collect();
        $seenWeeks = [];
        for ($i = 5; $i >= 0; $i--) {
            $fecha       = now()->subWeeks($i)->copy();
            $weekStart   = $fecha->copy()->startOfWeek();
            $weekEnd     = $fecha->copy()->endOfWeek();
            $timeKey     = $weekStart->format('Y-m-d');

            if (in_array($timeKey, $seenWeeks)) continue;
            $seenWeeks[] = $timeKey;

            $total = HoraExtra::where('estado', 'aprobado')
                ->whereBetween('fecha', [$weekStart->toDateString(), $weekEnd->toDateString()])
                ->sum('cantidad_horas');
            $chartHistogram->push([
                'time'  => $timeKey,
                'value' => (float) $total,
                'color' => $total > 0 ? '#9fe870' : 'rgba(159,232,112,0.2)',
            ]);
        }
        $chartHistogram = $chartHistogram->toArray();

        // 4. Últimas solicitudes pendientes (Tabla rápida)
        $ultimasPendientes = HoraExtra::with('empleado')
            ->where('estado', 'pendiente')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return view('dashboard.admin', compact('kpis', 'chartTendencia', 'topEmpleados', 'chartHistogram', 'ultimasPendientes'));
    }

    private function dashboardEmpleado($user)
    {
        $empleado_id = $user->empleado_id;
        $mesActual = now()->month;
        $anioActual = now()->year;

        if (!$empleado_id) {
            // Caso borde: usuario empleado sin perfil de empleado asociado
            return view('dashboard.empleado_sin_perfil');
        }

        $kpis = [
            'mis_horas_mes' => HoraExtra::where('empleado_id', $empleado_id)
                ->where('estado', 'aprobado')
                ->whereMonth('fecha', $mesActual)
                ->whereYear('fecha', $anioActual)
                ->sum('cantidad_horas'),
                
            'mis_pendientes' => HoraExtra::where('empleado_id', $empleado_id)
                ->where('estado', 'pendiente')
                ->count(),
                
            'mis_rechazadas' => HoraExtra::where('empleado_id', $empleado_id)
                ->where('estado', 'rechazado')
                ->whereMonth('fecha', $mesActual)
                ->count(),
        ];

        // Historial reciente del empleado
        $miHistorial = HoraExtra::where('empleado_id', $empleado_id)
            ->orderBy('fecha', 'desc')
            ->take(10)
            ->with('turno')
            ->get();

        return view('dashboard.empleado', compact('kpis', 'miHistorial'));
    }
}
