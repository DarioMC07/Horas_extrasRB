<?php

namespace App\Http\Controllers;

use App\Models\HoraExtra;
use App\Models\Turno;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HorasExtrasController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = HoraExtra::with(['empleado', 'turno', 'aprobadoPor'])->orderBy('fecha', 'desc');

        if ($user->isEmpleado()) {
            $query->where('empleado_id', $user->empleado_id);
        }

        if ($request->has('estado') && in_array($request->estado, ['pendiente', 'aprobado', 'rechazado'])) {
            $query->where('estado', $request->estado);
        }

        $horasExtras = $query->paginate(15);

        $formatted = $horasExtras->getCollection()->map(function ($he) {
            return [
                'id' => $he->id,
                'fecha' => $he->fecha->toDateString(),
                'cantidad_horas' => $he->cantidad_horas,
                'hora_inicio' => $he->hora_inicio,
                'hora_fin' => $he->hora_fin,
                'tipo_hora' => $he->tipo_hora,
                'tipo_hora_label' => $he->tipo_hora_label,
                'estado' => $he->estado,
                'motivo' => $he->motivo,
                'centro_costo' => $he->centro_costo,
                'created_at' => $he->created_at->toISOString(),
                'empleado' => $he->empleado ? [
                    'id' => $he->empleado->id,
                    'nombre_completo' => $he->empleado->nombre_completo,
                    'cedula' => $he->empleado->cedula,
                ] : null,
            ];
        });

        $horasExtras->setCollection($formatted);

        return Inertia::render('HorasExtras/Index', [
            'horasExtras' => $horasExtras,
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('HorasExtras/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'fecha'          => 'required|date',
            'cantidad_horas' => 'required|numeric|min:0.5|max:24',
            'tipo_hora'      => 'required|in:normal,nocturna,feriado',
            'motivo'         => 'required|string|max:500',
        ]);

        $user = $request->user();

        $empleado_id = $user->empleado_id;

        if ($user->isAdmin()) {
            $empleado_id = $request->input('empleado_id', $user->empleado_id);
        }

        if (!$empleado_id) {
            return back()->withErrors(['empleado_id' => 'Debe estar asociado a un empleado.']);
        }

        $data = [
            'empleado_id'    => $empleado_id,
            'fecha'          => $request->fecha,
            'cantidad_horas' => $request->cantidad_horas,
            'tipo_hora'      => $request->tipo_hora,
            'motivo'         => $request->motivo,
            'estado'         => 'pendiente',
        ];

        if ($request->has('hora_inicio')) {
            $data['hora_inicio'] = $request->hora_inicio;
        }
        if ($request->has('hora_fin')) {
            $data['hora_fin'] = $request->hora_fin;
        }
        if ($request->has('centro_costo')) {
            $data['centro_costo'] = $request->centro_costo;
        }

        HoraExtra::create($data);

        return redirect()->route('horas-extras.index')->with('success', 'Hora extra registrada con éxito.');
    }

    public function show(HoraExtra $horasExtra)
    {
        $horasExtra->load('empleado', 'aprobadoPor');

        $historial = [];
        if ($horasExtra->created_at) {
            $historial[] = [
                'estado' => 'pendiente',
                'fecha' => $horasExtra->created_at->toISOString(),
            ];
        }
        if ($horasExtra->estado === 'aprobado' && $horasExtra->fecha_aprobacion) {
            $historial[] = [
                'estado' => 'aprobado',
                'fecha' => $horasExtra->fecha_aprobacion->toISOString(),
                'usuario' => $horasExtra->aprobadoPor?->name,
            ];
        }
        if ($horasExtra->estado === 'rechazado' && $horasExtra->fecha_aprobacion) {
            $historial[] = [
                'estado' => 'rechazado',
                'fecha' => $horasExtra->fecha_aprobacion->toISOString(),
                'usuario' => $horasExtra->aprobadoPor?->name,
                'comentario' => $horasExtra->observaciones_admin,
            ];
        }

        return Inertia::render('HorasExtras/Show', [
            'horaExtra' => [
                'id' => $horasExtra->id,
                'fecha' => $horasExtra->fecha->toDateString(),
                'cantidad_horas' => $horasExtra->cantidad_horas,
                'hora_inicio' => $horasExtra->hora_inicio,
                'hora_fin' => $horasExtra->hora_fin,
                'tipo_hora' => $horasExtra->tipo_hora,
                'tipo_hora_label' => $horasExtra->tipo_hora_label,
                'estado' => $horasExtra->estado,
                'motivo' => $horasExtra->motivo,
                'centro_costo' => $horasExtra->centro_costo,
                'created_at' => $horasExtra->created_at->toISOString(),
                'empleado' => $horasExtra->empleado ? [
                    'id' => $horasExtra->empleado->id,
                    'nombre_completo' => $horasExtra->empleado->nombre_completo,
                    'cedula' => $horasExtra->empleado->cedula,
                ] : null,
                'historial' => $historial,
            ],
        ]);
    }

    public function updateEstado(Request $request, HoraExtra $horas_extra)
    {
        $request->validate([
            'estado' => 'required|in:aprobado,rechazado,pre-aprobado',
            'comentario' => 'nullable|string|max:500'
        ]);

        $horas_extra->update([
            'estado' => $request->estado,
            'aprobado_por' => $request->user()->id,
            'fecha_aprobacion' => now(),
            'observaciones_admin' => $request->comentario
        ]);

        return redirect()->route('horas-extras.show', $horas_extra->id)->with('success', 'Estado actualizado correctamente.');
    }

    public function destroy(Request $request, HoraExtra $horas_extra)
    {
        $user = $request->user();
        if ($user->isEmpleado() && ($horas_extra->estado !== 'pendiente' || $horas_extra->empleado_id !== $user->empleado_id)) {
            abort(403);
        }

        $horas_extra->delete();

        return redirect()->route('horas-extras.index')->with('success', 'Registro eliminado.');
    }
}
