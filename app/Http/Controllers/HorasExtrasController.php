<?php

namespace App\Http\Controllers;

use App\Models\HoraExtra;
use App\Models\Turno;
use Illuminate\Http\Request;

class HorasExtrasController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = HoraExtra::with(['empleado', 'turno', 'aprobadoPor'])->orderBy('fecha', 'desc');

        if ($user->isEmpleado()) {
            $query->where('empleado_id', $user->empleado_id);
        }

        // Filtro básico de estado
        if ($request->has('estado') && in_array($request->estado, ['pendiente', 'aprobado', 'rechazado'])) {
            $query->where('estado', $request->estado);
        }

        $horasExtras = $query->paginate(15);

        return view('horas-extras.index', compact('horasExtras'));
    }

    public function create(Request $request)
    {
        $user = $request->user();
        
        $turnosBaseQuery = Turno::orderBy('fecha', 'desc');

        if ($user->isEmpleado()) {
            $turnos = $turnosBaseQuery->where('empleado_id', $user->empleado_id)->take(20)->get();
        } else {
            // El admin puede crearle a cualquier empleado pero ideal es seleccionar el empleado primero.
            // Para simplificar, le mandamos los últimos 50 turnos o los del mes
            $turnos = $turnosBaseQuery->take(50)->with('empleado')->get();
        }

        return view('horas-extras.create', compact('turnos'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'turno_id'       => 'nullable|exists:turnos,id',
            'fecha'          => 'required|date',
            'cantidad_horas' => 'required|numeric|min:0.5|max:24',
            'tipo_hora'      => 'required|in:normal,nocturna,feriado',
            'motivo'         => 'required|string|max:500',
        ]);

        $user = $request->user();
        
        $empleado_id = $user->isEmpleado() ? $user->empleado_id : $request->input('empleado_id');

        // Si es admin tiene que enviar un empleado_id al crear la hora extra (a menos que dependa del turno)
        if ($user->isAdmin() && empty($empleado_id)) {
            if ($request->turno_id) {
                $empleado_id = Turno::find($request->turno_id)->empleado_id;
            } else {
                return back()->withErrors(['empleado_id' => 'Debe seleccionar un empleado o turno.']);
            }
        }

        HoraExtra::create([
            'empleado_id'    => $empleado_id,
            'turno_id'       => $request->turno_id,
            'fecha'          => $request->fecha,
            'cantidad_horas' => $request->cantidad_horas,
            'tipo_hora'      => $request->tipo_hora,
            'motivo'         => $request->motivo,
            'estado'         => 'pendiente', // Siempre entra pendiente  
        ]);

        return redirect()->route('horas-extras.index')->with('success', 'Hora extra registrada con éxito y pendiente de aprobación.');
    }

    public function show(HoraExtra $horasExtra)
    {
        return view('horas-extras.show', compact('horasExtra'));
    }

    // Método para Admin para aprobar o rechazar
    public function updateEstado(Request $request, HoraExtra $horas_extra)
    {
        $request->validate([
            'estado' => 'required|in:aprobado,rechazado',
            'observaciones_admin' => 'nullable|string|max:500'
        ]);

        $horas_extra->update([
            'estado' => $request->estado,
            'aprobado_por' => $request->user()->id,
            'fecha_aprobacion' => now(),
            'observaciones_admin' => $request->observaciones_admin
        ]);

        return redirect()->route('horas-extras.index')->with('success', 'Estado actualizado correctamente.');
    }

    // Borrado si es necesario (el empleado podría borrar si está pendiente?)
    public function destroy(Request $request, HoraExtra $horas_extra)
    {
        // Solo un empleado puede borrar sus pendientes, el admin puede cualquiera
        $user = $request->user();
        if ($user->isEmpleado() && ($horas_extra->estado !== 'pendiente' || $horas_extra->empleado_id !== $user->empleado_id)) {
            abort(403);
        }

        $horas_extra->delete();

        return redirect()->route('horas-extras.index')->with('success', 'Registro eliminado eliminado.');
    }
}
