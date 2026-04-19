<?php

namespace App\Http\Controllers;

use App\Models\Turno;
use App\Models\Empleado;
use Illuminate\Http\Request;

class TurnosController extends Controller
{
    public function index(Request $request)
    {
        $turnos = Turno::with('empleado')
            ->orderBy('fecha', 'desc')
            ->orderBy('hora_inicio', 'desc')
            ->paginate(15);

        return view('turnos.index', compact('turnos'));
    }

    public function create()
    {
        $empleados = Empleado::activos()->orderBy('apellido')->get();
        return view('turnos.create', compact('empleados'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'empleado_id'  => 'required|exists:empleados,id',
            'fecha'        => 'required|date',
            'hora_inicio'  => 'required|date_format:H:i',
            'hora_fin'     => 'required|date_format:H:i|after:hora_inicio',
            'tipo'         => 'required|in:normal,nocturno,feriado',
            'observaciones'=> 'nullable|string|max:500',
        ]);

        Turno::create($validated);

        return redirect()->route('turnos.index')->with('success', 'Turno registrado correctamente.');
    }

    public function edit(Turno $turno)
    {
        $empleados = Empleado::activos()->orderBy('apellido')->get();
        return view('turnos.edit', compact('turno', 'empleados'));
    }

    public function update(Request $request, Turno $turno)
    {
        $validated = $request->validate([
            'empleado_id'  => 'required|exists:empleados,id',
            'fecha'        => 'required|date',
            'hora_inicio'  => 'required|date_format:H:i',
            'hora_fin'     => 'required|date_format:H:i|after:hora_inicio',
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
