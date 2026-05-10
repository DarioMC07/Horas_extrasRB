<?php

namespace App\Http\Controllers;

use App\Models\HoraExtra;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportesController extends Controller
{
    public function index(Request $request)
    {
        $query = HoraExtra::with(['empleado', 'turno', 'aprobadoPor']);

        if ($request->has('estado') && $request->estado != '') {
            $query->where('estado', $request->estado);
        }

        if ($request->has('mes') && $request->mes != '') {
            $query->whereMonth('fecha', date('m', strtotime($request->mes)))
                  ->whereYear('fecha', date('Y', strtotime($request->mes)));
        }

        if ($request->has('fecha_desde') && $request->fecha_desde != '') {
            $query->where('fecha', '>=', $request->fecha_desde);
        }

        if ($request->has('fecha_hasta') && $request->fecha_hasta != '') {
            $query->where('fecha', '<=', $request->fecha_hasta);
        }

        $formatted = $horasExtras->getCollection()->map(function ($he) {
            return [
                'id' => $he->id,
                'fecha' => $he->fecha->toDateString(),
                'cantidad_horas' => $he->cantidad_horas,
                'tipo_hora' => $he->tipo_hora,
                'tipo_hora_label' => $he->tipo_hora_label,
                'estado' => $he->estado,
                'empleado' => $he->empleado ? [
                    'nombre_completo' => $he->empleado->nombre_completo,
                    'cedula' => $he->empleado->cedula,
                    'departamento' => $he->empleado->departamento,
                ] : null,
            ];
        });

        $horasExtras->setCollection($formatted);

        $totalHoras = $query->sum('cantidad_horas');
        $totalRegistros = $query->count();

        return Inertia::render('Reportes/Index', [
            'horasExtras' => $horasExtras,
            'filters' => [
                'fechaDesde' => $request->fecha_desde ?? now()->startOfMonth()->toDateString(),
                'fechaHasta' => $request->fecha_hasta ?? now()->toDateString(),
                'empleado' => $request->empleado ?? 'todos',
                'estado' => $request->estado ?? 'todos',
            ],
            'totals' => [
                'totalHoras' => $totalHoras,
                'totalRegistros' => $totalRegistros,
            ],
        ]);
    }

    public function exportarCsv(Request $request)
    {
        $query = HoraExtra::with(['empleado', 'turno', 'aprobadoPor']);

        if ($request->has('estado') && $request->estado != '') {
            $query->where('estado', $request->estado);
        }
        if ($request->has('fecha_desde') && $request->fecha_desde != '') {
            $query->where('fecha', '>=', $request->fecha_desde);
        }
        if ($request->has('fecha_hasta') && $request->fecha_hasta != '') {
            $query->where('fecha', '<=', $request->fecha_hasta);
        }

        $horas = $query->orderBy('fecha', 'desc')->get();

        $filename = "reporte_horas_extras_" . date('Y_m_d_His') . ".csv";
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = [
            'ID', 'Empleado', 'Cedula', 'Fecha', 'Cantidad Horas',
            'Tipo Hora', 'Estado', 'Aprobado Por', 'Fecha Aprobacion', 'Motivo'
        ];

        $callback = function() use($horas, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($horas as $h) {
                $row = [
                    $h->id,
                    $h->empleado->nombre_completo ?? 'N/A',
                    $h->empleado->cedula ?? 'N/A',
                    $h->fecha->format('Y-m-d'),
                    $h->cantidad_horas,
                    $h->tipo_hora_label,
                    ucfirst($h->estado),
                    $h->aprobadoPor->name ?? 'N/A',
                    $h->fecha_aprobacion ? $h->fecha_aprobacion->format('Y-m-d H:i') : '',
                    $h->motivo,
                ];
                fputcsv($file, $row);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
