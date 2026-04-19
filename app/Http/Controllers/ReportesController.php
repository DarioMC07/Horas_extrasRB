<?php

namespace App\Http\Controllers;

use App\Models\HoraExtra;
use Illuminate\Http\Request;

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

        $horasExtras = $query->orderBy('fecha', 'desc')->paginate(20);

        return view('reportes.index', compact('horasExtras'));
    }

    public function exportarCsv(Request $request)
    {
        $query = HoraExtra::with(['empleado', 'turno', 'aprobadoPor']);

        if ($request->has('estado') && $request->estado != '') {
            $query->where('estado', $request->estado);
        }
        if ($request->has('mes') && $request->mes != '') {
            $query->whereMonth('fecha', date('m', strtotime($request->mes)))
                  ->whereYear('fecha', date('Y', strtotime($request->mes)));
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
