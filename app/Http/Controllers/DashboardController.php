<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Models\HoraExtra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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

        $kpis = [
            'total_horas_aprobadas' => HoraExtra::where('estado', 'aprobado')
                ->whereMonth('fecha', $mesActual)
                ->whereYear('fecha', $anioActual)
                ->sum('cantidad_horas'),

            'solicitudes_pendientes' => HoraExtra::where('estado', 'pendiente')->count(),

            'empleados_activos' => Empleado::where('activo', true)->count(),
        ];

        $chartTendencia = [];
        for ($i = 5; $i >= 0; $i--) {
            $fecha = now()->copy()->subMonths($i);
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

        $topEmpleadosRaw = HoraExtra::select('empleado_id', DB::raw('SUM(cantidad_horas) as total'))
            ->where('estado', 'aprobado')
            ->whereMonth('fecha', $mesActual)
            ->groupBy('empleado_id')
            ->orderByDesc('total')
            ->limit(5)
            ->with('empleado')
            ->get();

        $topEmpleados = $topEmpleadosRaw->mapWithKeys(function ($item) {
            return [$item->empleado->nombre_completo => (float) $item->total];
        })->toArray();

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

        $ultimasPendientes = HoraExtra::with('empleado')
            ->where('estado', 'pendiente')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()->map(function ($he) {
                return [
                    'id' => $he->id,
                    'fecha' => $he->fecha->toDateString(),
                    'cantidad_horas' => $he->cantidad_horas,
                    'tipo_hora_label' => $he->tipo_hora_label,
                    'empleado' => [
                        'nombre_completo' => $he->empleado->nombre_completo ?? 'N/A',
                    ],
                ];
            })->toArray();

        $distribucionPorTipo = HoraExtra::select('tipo_hora', DB::raw('SUM(cantidad_horas) as total'))
            ->where('estado', 'aprobado')
            ->whereMonth('fecha', $mesActual)
            ->whereYear('fecha', $anioActual)
            ->groupBy('tipo_hora')
            ->get()
            ->map(fn ($h) => [
                'tipo' => $h->tipo_hora,
                'label' => match ($h->tipo_hora) {
                    'nocturna' => 'Nocturna',
                    'feriado' => 'Feriado',
                    default => 'Normal',
                },
                'total' => (float) $h->total,
            ])->toArray();

        return Inertia::render('Dashboard/Admin', [
            'kpis' => $kpis,
            'chartTendencia' => $chartTendencia,
            'topEmpleados' => $topEmpleados,
            'chartHistogram' => $chartHistogram,
            'ultimasPendientes' => $ultimasPendientes,
            'distribucionPorTipo' => $distribucionPorTipo,
        ]);
    }

    private function dashboardEmpleado($user)
    {
        $empleado_id = $user->empleado_id;
        $mesActual = now()->month;
        $anioActual = now()->year;

        if (!$empleado_id) {
            return Inertia::render('Dashboard/Empleado', [
                'kpis' => [
                    'mis_horas_mes' => 0,
                    'mis_pendientes' => 0,
                    'mis_rechazadas' => 0,
                ],
                'miHistorial' => [],
                'miTendencia' => [],
                'miDistribucionEstado' => [],
            ]);
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

        $miHistorial = HoraExtra::where('empleado_id', $empleado_id)
            ->orderBy('fecha', 'desc')
            ->take(10)
            ->with('turno')
            ->get()->map(function ($he) {
                return [
                    'id' => $he->id,
                    'fecha' => $he->fecha->toDateString(),
                    'cantidad_horas' => $he->cantidad_horas,
                    'motivo' => $he->motivo,
                    'estado' => $he->estado,
                    'badge_class' => $he->badge_class,
                ];
            })->toArray();

        $miTendencia = [];
        for ($i = 5; $i >= 0; $i--) {
            $fecha = now()->copy()->subMonths($i);
            $total = HoraExtra::where('empleado_id', $empleado_id)
                ->where('estado', 'aprobado')
                ->whereMonth('fecha', $fecha->month)
                ->whereYear('fecha', $fecha->year)
                ->sum('cantidad_horas');
            $miTendencia[] = [
                'time'  => $fecha->format('Y-m-01'),
                'value' => (float) $total,
                'label' => $fecha->translatedFormat('M Y'),
            ];
        }

        $miDistribucionEstado = HoraExtra::select('estado', DB::raw('COUNT(*) as total'))
            ->where('empleado_id', $empleado_id)
            ->whereMonth('fecha', $mesActual)
            ->whereYear('fecha', $anioActual)
            ->groupBy('estado')
            ->get()
            ->map(fn ($h) => [
                'estado' => $h->estado,
                'label' => match ($h->estado) {
                    'aprobado' => 'Aprobadas',
                    'rechazado' => 'Rechazadas',
                    default => 'Pendientes',
                },
                'total' => (int) $h->total,
            ])->toArray();

        return Inertia::render('Dashboard/Empleado', [
            'kpis' => $kpis,
            'miHistorial' => $miHistorial,
            'miTendencia' => $miTendencia,
            'miDistribucionEstado' => $miDistribucionEstado,
        ]);
    }
}
