<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use Illuminate\Http\Request;

class EmpleadosController extends Controller
{
    public function index()
    {
        $empleados = Empleado::orderBy('apellido')->paginate(15);
        return view('empleados.index', compact('empleados'));
    }

    public function create()
    {
        return view('empleados.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'       => 'required|string|max:255',
            'apellido'     => 'required|string|max:255',
            'cedula'       => 'required|string|max:20|unique:empleados',
            'cargo'        => 'required|string|max:255',
            'departamento' => 'required|string|max:255',
            'telefono'     => 'nullable|string|max:20',
            'fecha_ingreso'=> 'required|date',
            'activo'       => 'boolean',
        ]);

        Empleado::create($validated);

        return redirect()->route('empleados.index')->with('success', 'Empleado registrado correctamente.');
    }

    public function show(Empleado $empleado)
    {
        $horasDelMes    = $empleado->totalHorasMes();
        $ultimasHoras   = $empleado->horasExtras()->orderBy('fecha', 'desc')->take(10)->get();
        return view('empleados.show', compact('empleado', 'horasDelMes', 'ultimasHoras'));
    }

    public function edit(Empleado $empleado)
    {
        return view('empleados.edit', compact('empleado'));
    }

    public function update(Request $request, Empleado $empleado)
    {
        $validated = $request->validate([
            'nombre'       => 'required|string|max:255',
            'apellido'     => 'required|string|max:255',
            'cedula'       => 'required|string|max:20|unique:empleados,cedula,' . $empleado->id,
            'cargo'        => 'required|string|max:255',
            'departamento' => 'required|string|max:255',
            'telefono'     => 'nullable|string|max:20',
            'fecha_ingreso'=> 'required|date',
            'activo'       => 'boolean',
        ]);

        $empleado->update($validated);

        return redirect()->route('empleados.index')->with('success', 'Empleado actualizado correctamente.');
    }

    public function destroy(Empleado $empleado)
    {
        // Mejor práctica sería soft delete o desactivar, pero dejamos la opción por BD
        $empleado->update(['activo' => false]);
        return redirect()->route('empleados.index')->with('success', 'Empleado marcado como inactivo.');
    }
}
