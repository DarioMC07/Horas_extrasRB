<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmpleadosController extends Controller
{
    public function index()
    {
        $empleados = Empleado::orderBy('apellido')->paginate(15);

        $formatted = $empleados->getCollection()->map(function ($emp) {
            return [
                'id' => $emp->id,
                'cedula' => $emp->cedula,
                'nombre' => $emp->nombre,
                'apellido' => $emp->apellido,
                'nombre_completo' => $emp->nombre_completo,
                'cargo' => $emp->cargo,
                'departamento' => $emp->departamento,
                'telefono' => $emp->telefono,
                'email' => $emp->email,
                'fecha_ingreso' => $emp->fecha_ingreso?->toDateString(),
                'activo' => $emp->activo,
            ];
        });

        $empleados->setCollection($formatted);

        return Inertia::render('Empleados/Index', [
            'empleados' => $empleados,
        ]);
    }

    public function create()
    {
        return Inertia::render('Empleados/Index', [
            'empleados' => [],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cedula'       => 'required|string|max:20|unique:empleados',
            'nombre'       => 'required|string|max:255',
            'apellido'     => 'required|string|max:255',
            'cargo'        => 'required|string|max:255',
            'departamento' => 'required|string|max:255',
            'telefono'     => 'nullable|string|max:20',
            'email'        => 'nullable|email|max:255',
            'fecha_ingreso'=> 'required|date',
            'activo'       => 'boolean',
        ]);

        Empleado::create($validated);

        return redirect()->route('empleados.index')->with('success', 'Empleado registrado correctamente.');
    }

    public function edit(Empleado $empleado)
    {
        return Inertia::render('Empleados/Edit', [
            'empleado' => [
                'id' => $empleado->id,
                'cedula' => $empleado->cedula,
                'nombre' => $empleado->nombre,
                'apellido' => $empleado->apellido,
                'cargo' => $empleado->cargo,
                'departamento' => $empleado->departamento,
                'telefono' => $empleado->telefono,
                'email' => $empleado->email,
                'fecha_ingreso' => $empleado->fecha_ingreso?->toDateString(),
                'activo' => $empleado->activo,
            ],
        ]);
    }

    public function update(Request $request, Empleado $empleado)
    {
        $validated = $request->validate([
            'cedula'       => 'required|string|max:20|unique:empleados,cedula,' . $empleado->id,
            'nombre'       => 'required|string|max:255',
            'apellido'     => 'required|string|max:255',
            'cargo'        => 'required|string|max:255',
            'departamento' => 'required|string|max:255',
            'telefono'     => 'nullable|string|max:20',
            'email'        => 'nullable|email|max:255',
            'fecha_ingreso'=> 'required|date',
            'activo'       => 'boolean',
        ]);

        $empleado->update($validated);

        return redirect()->route('empleados.index')->with('success', 'Empleado actualizado correctamente.');
    }

    public function destroy(Empleado $empleado)
    {
        $empleado->update(['activo' => false]);
        return redirect()->route('empleados.index')->with('success', 'Empleado marcado como inactivo.');
    }
}
