<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Empleado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UsuariosController extends Controller
{
    public function index()
    {
        $usuarios = User::with('empleado')->orderBy('name')->paginate(15);
        return view('usuarios.index', compact('usuarios'));
    }

    public function create()
    {
        $empleados = Empleado::activos()->orderBy('apellido')->get();
        return view('usuarios.create', compact('empleados'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'in:admin,empleado'],
            'empleado_id' => ['nullable', 'exists:empleados,id'],
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'empleado_id' => $request->role === 'empleado' ? $request->empleado_id : null,
        ]);

        return redirect()->route('usuarios.index')->with('success', 'Usuario creado correctamente.');
    }

    public function edit(User $usuario)
    {
        $empleados = Empleado::activos()->orderBy('apellido')->get();
        return view('usuarios.edit', compact('usuario', 'empleados'));
    }

    public function update(Request $request, User $usuario)
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:'.User::class.',email,'.$usuario->id],
            'role' => ['required', 'in:admin,empleado'],
            'empleado_id' => ['nullable', 'exists:empleados,id'],
        ];

        if ($request->filled('password')) {
            $rules['password'] = ['confirmed', Rules\Password::defaults()];
        }

        $request->validate($rules);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'empleado_id' => $request->role === 'empleado' ? $request->empleado_id : null,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $usuario->update($data);

        return redirect()->route('usuarios.index')->with('success', 'Usuario actualizado correctamente.');
    }

    public function destroy(User $usuario)
    {
        if ($usuario->id === request()->user()->id) {
            return back()->withErrors(['Error' => 'No puedes eliminarte a ti mismo.']);
        }
        
        $usuario->delete();
        return redirect()->route('usuarios.index')->with('success', 'Usuario eliminado.');
    }
}
