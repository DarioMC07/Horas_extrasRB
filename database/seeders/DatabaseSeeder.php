<?php

namespace Database\Seeders;

use App\Models\Empleado;
use App\Models\HoraExtra;
use App\Models\Turno;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. Admin ────────────────────────────────────────────────
        $admin = User::create([
            'name'     => 'Administrador',
            'email'    => 'admin@rosabetania.com',
            'password' => Hash::make('admin123'),
            'role'     => 'admin',
        ]);

        // ── 2. Empleados ────────────────────────────────────────────
        $empleadosData = [
            ['Carlos',   'Martínez',  '001-0101990-1', 'Operador de Prensa',    'Producción',    '809-555-0001', '2021-03-15'],
            ['María',    'González',  '001-0202985-2', 'Diseñadora Gráfica',    'Diseño',        '809-555-0002', '2020-07-01'],
            ['Luis',     'Pérez',     '001-0303980-3', 'Técnico de Acabados',   'Producción',    '809-555-0003', '2019-11-20'],
            ['Ana',      'Rodríguez', '001-0404975-4', 'Asistente de Diseño',   'Diseño',        '809-555-0004', '2022-01-10'],
            ['Roberto',  'Díaz',      '001-0505970-5', 'Operador de Guillotina','Producción',    '809-555-0005', '2018-06-05'],
            ['Sofía',    'López',     '001-0606988-6', 'Coordinadora Ventas',   'Administración','809-555-0006', '2023-02-28'],
        ];

        $empleados = [];
        foreach ($empleadosData as $data) {
            $empleados[] = Empleado::create([
                'nombre'        => $data[0],
                'apellido'      => $data[1],
                'cedula'        => $data[2],
                'cargo'         => $data[3],
                'departamento'  => $data[4],
                'telefono'      => $data[5],
                'fecha_ingreso' => $data[6],
                'activo'        => true,
            ]);
        }

        // ── 3. Usuarios empleados (vinculados) ──────────────────────
        foreach ($empleados as $empleado) {
            User::create([
                'name'        => $empleado->nombre_completo,
                'email'       => strtolower($empleado->nombre) . '@rosabetania.com',
                'password'    => Hash::make('empleado123'),
                'role'        => 'empleado',
                'empleado_id' => $empleado->id,
            ]);
        }

        // ── 4. Turnos ───────────────────────────────────────────────
        $tipos = ['normal', 'nocturno', 'feriado'];
        $turnos = [];
        foreach ($empleados as $empleado) {
            for ($i = 0; $i < 8; $i++) {
                $fecha = now()->subDays(rand(1, 60));
                $turnos[] = Turno::create([
                    'empleado_id'  => $empleado->id,
                    'fecha'        => $fecha->toDateString(),
                    'hora_inicio'  => '08:00:00',
                    'hora_fin'     => '17:00:00',
                    'tipo'         => $tipos[array_rand($tipos)],
                    'observaciones'=> null,
                ]);
            }
        }

        // ── 5. Horas extras ─────────────────────────────────────────
        $estados  = ['pendiente', 'aprobado', 'aprobado', 'rechazado']; // mayoría aprobadas
        $tiposH   = ['normal', 'nocturna', 'feriado'];
        $motivos  = [
            'Cierre de pedido urgente para cliente corporativo',
            'Mantenimiento de equipos de impresión',
            'Entrega de tiraje especial para evento',
            'Apoyo en control de calidad de producción',
            'Reunión con proveedor de materiales',
        ];

        foreach ($turnos as $turno) {
            if (rand(0, 1)) { // 50% de turnos generan hora extra
                $estado = $estados[array_rand($estados)];
                HoraExtra::create([
                    'empleado_id'          => $turno->empleado_id,
                    'turno_id'             => $turno->id,
                    'fecha'                => $turno->fecha,
                    'cantidad_horas'       => rand(1, 4) + (rand(0, 1) * 0.5),
                    'tipo_hora'            => $tiposH[array_rand($tiposH)],
                    'motivo'               => $motivos[array_rand($motivos)],
                    'estado'               => $estado,
                    'aprobado_por'         => $estado !== 'pendiente' ? $admin->id : null,
                    'fecha_aprobacion'     => $estado !== 'pendiente' ? now()->subDays(rand(1, 5)) : null,
                    'observaciones_admin'  => $estado === 'rechazado' ? 'No cumple con el procedimiento establecido.' : null,
                ]);
            }
        }
    }
}
