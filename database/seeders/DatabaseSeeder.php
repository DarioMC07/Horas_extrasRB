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
        $admin = User::updateOrCreate(
            ['email' => 'admin@rosabetania.com'],
            [
                'name'     => 'Administrador',
                'password' => Hash::make('admin123'),
                'role'     => 'admin',
            ]
        );

        // ── 2. Empleados ────────────────────────────────────────────
        $empleadosData = [
            ['Carlos',  'Martínez',  '001-0101990-1', 'Operador de Prensa',     'Producción',    '809-555-0001', '2021-03-15'],
            ['María',   'González',  '001-0202985-2', 'Diseñadora Gráfica',     'Diseño',        '809-555-0002', '2020-07-01'],
            ['Luis',    'Pérez',     '001-0303980-3', 'Técnico de Acabados',    'Producción',    '809-555-0003', '2019-11-20'],
            ['Ana',     'Rodríguez', '001-0404975-4', 'Asistente de Diseño',    'Diseño',        '809-555-0004', '2022-01-10'],
            ['Roberto', 'Díaz',      '001-0505970-5', 'Operador de Guillotina', 'Producción',    '809-555-0005', '2018-06-05'],
            ['Sofía',   'López',     '001-0606988-6', 'Coordinadora Ventas',    'Administración','809-555-0006', '2023-02-28'],
        ];

        $empleados = [];
        foreach ($empleadosData as $data) {
            $empleados[] = Empleado::firstOrCreate(
                ['cedula' => $data[2]],
                [
                    'nombre'        => $data[0],
                    'apellido'      => $data[1],
                    'cargo'         => $data[3],
                    'departamento'  => $data[4],
                    'telefono'      => $data[5],
                    'fecha_ingreso' => $data[6],
                    'activo'        => true,
                ]
            );
        }

        // ── 3. Usuarios empleados (vinculados) ──────────────────────
        foreach ($empleados as $empleado) {
            User::firstOrCreate(
                ['email' => strtolower($empleado->nombre) . '@rosabetania.com'],
                [
                    'name'        => $empleado->nombre_completo,
                    'password'    => Hash::make('empleado123'),
                    'role'        => 'empleado',
                    'empleado_id' => $empleado->id,
                ]
            );
        }

        // ── 4. Turnos + Horas Extras distribuidos en los últimos 6 meses ──
        // Garantiza datos en cada mes que muestra el gráfico de tendencia.
        $estados = ['aprobado', 'aprobado', 'aprobado', 'pendiente', 'rechazado'];
        $tiposH  = ['normal', 'normal', 'nocturna', 'feriado'];
        $motivos = [
            'Cierre de pedido urgente para cliente corporativo',
            'Mantenimiento de equipos de impresión',
            'Entrega de tiraje especial para evento',
            'Apoyo en control de calidad de producción',
            'Reunión con proveedor de materiales',
        ];

        foreach ($empleados as $empleado) {
            // Por cada mes de los últimos 6, generar 3-6 registros
            for ($mesOffset = 5; $mesOffset >= 0; $mesOffset--) {
                $mesBase     = now()->subMonths($mesOffset);
                $diasEnMes   = $mesBase->daysInMonth;
                $cantRegistros = rand(3, 6);

                for ($r = 0; $r < $cantRegistros; $r++) {
                    $fecha = $mesBase->copy()->day(rand(1, $diasEnMes));

                    $turno = Turno::create([
                        'empleado_id'   => $empleado->id,
                        'fecha'         => $fecha->toDateString(),
                        'hora_inicio'   => '08:00:00',
                        'hora_fin'      => '17:00:00',
                        'tipo'          => 'normal',
                        'observaciones' => null,
                    ]);

                    $estado = $estados[array_rand($estados)];
                    HoraExtra::create([
                        'empleado_id'         => $empleado->id,
                        'turno_id'            => $turno->id,
                        'fecha'               => $fecha->toDateString(),
                        'cantidad_horas'      => rand(1, 4) + (rand(0, 1) * 0.5),
                        'tipo_hora'           => $tiposH[array_rand($tiposH)],
                        'motivo'              => $motivos[array_rand($motivos)],
                        'estado'              => $estado,
                        'aprobado_por'        => $estado !== 'pendiente' ? $admin->id : null,
                        'fecha_aprobacion'    => $estado !== 'pendiente' ? now()->subDays(rand(1, 5)) : null,
                        'observaciones_admin' => $estado === 'rechazado' ? 'No cumple con el procedimiento establecido.' : null,
                    ]);
                }
            }
        }
    }
}
