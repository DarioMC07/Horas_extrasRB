<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Empleado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UsuariosController extends Controller
{
    public function index()
    {
        $usuarios = User::with('empleado')->orderBy('name')->paginate(15);

        $formatted = $usuarios->getCollection()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'ultimo_acceso' => $user->ultimo_acceso?->toISOString(),
                'empleado' => $user->empleado ? [
                    'nombre_completo' => $user->empleado->nombre_completo,
                ] : null,
            ];
        });

        $usuarios->setCollection($formatted);

        return Inertia::render('Usuarios/Index', [
            'usuarios' => $usuarios,
        ]);
    }

    public function edit(User $usuario)
    {
        return Inertia::render('Usuarios/Index', [
            'usuarios' => [],
        ]);
    }

    public function update(Request $request, User $usuario)
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:'.User::class.',email,'.$usuario->id],
            'role' => ['required', 'in:admin,empleado,supervisor'],
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
