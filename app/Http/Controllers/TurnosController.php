<?php

namespace App\Http\Controllers;

use App\Models\Turno;
use App\Models\Empleado;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TurnosController extends Controller
{
    public function index(Request $request)
    {
        $turnos = Turno::with('empleado')
            ->orderBy('fecha', 'desc')
            ->orderBy('hora_inicio', 'desc')
            ->paginate(15);

        $formatted = $turnos->getCollection()->map(function ($turno) {
            return [
                'id' => $turno->id,
                'fecha' => $turno->fecha->toDateString(),
                'hora_inicio' => $turno->hora_inicio,
                'hora_fin' => $turno->hora_fin,
                'tipo' => $turno->tipo,
                'observaciones' => $turno->observaciones,
                'empleado' => $turno->empleado ? [
                    'id' => $turno->empleado->id,
                    'nombre_completo' => $turno->empleado->nombre_completo,
                ] : null,
            ];
        });

        $turnos->setCollection($formatted);

        $empleados = Empleado::activos()->orderBy('apellido')->get()->map(function ($emp) {
            return [
                'id' => $emp->id,
                'nombre_completo' => $emp->nombre_completo,
            ];
        });

        return Inertia::render('Turnos/Index', [
            'turnos' => $turnos,
            'empleados' => $empleados,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'empleado_id'  => 'required|exists:empleados,id',
            'fecha'        => 'required|date',
            'hora_inicio'  => 'required|date_format:H:i',
            'hora_fin'     => 'required|date_format:H:i',
            'tipo'         => 'required|in:normal,nocturno,feriado',
            'observaciones'=> 'nullable|string|max:500',
        ]);

        Turno::create($validated);

        return redirect()->route('turnos.index')->with('success', 'Turno registrado correctamente.');
    }

    public function update(Request $request, Turno $turno)
    {
        $validated = $request->validate([
            'empleado_id'  => 'required|exists:empleados,id',
            'fecha'        => 'required|date',
            'hora_inicio'  => 'required|date_format:H:i',
            'hora_fin'     => 'required|date_format:H:i',
            'tipo'         => 'required|in:normal,nocturno,feriado',
            'observaciones'=> 'nullable|string|max:500',
        ]);

        $turno->update($validated);

        return redirect()->route('turnos.index')->with('success', 'Turno actualizado correctamente.');
    }

    public function destroy(Turno $turno)
    {
        $turno->delete();
        return redirect()->route('turnos.index')->with('success', 'Turno eliminado.');
    }
}
