<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmpleadosController;
use App\Http\Controllers\HorasExtrasController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportesController;
use App\Http\Controllers\TurnosController;
use App\Http\Controllers\UsuariosController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware(['auth'])->group(function () {
    // ── Dashboard (Todos los usuarios) ────────────────────────
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ── Horas Extras (Todos, lógica según rol en controlador) ───
    Route::resource('horas-extras', HorasExtrasController::class);
    
    // Ruta específica para aprobar/rechazar (solo admin de facto, aunque validado en ruta/controlador)
    Route::patch('/horas-extras/{horas_extra}/estado', [HorasExtrasController::class, 'updateEstado'])
        ->name('horas-extras.estado')->middleware('role:admin');

    // ── Perfil de Usuario (Breeze default) ──────────────────────
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ── Administración (Solo Gerentes) ────────────────────────
    Route::middleware('role:admin')->group(function () {
        Route::resource('empleados', EmpleadosController::class);
        Route::resource('turnos', TurnosController::class);
        Route::resource('usuarios', UsuariosController::class);
        
        // Reportes y Exportación
        Route::get('reportes', [ReportesController::class, 'index'])->name('reportes.index');
        Route::get('reportes/exportar', [ReportesController::class, 'exportarCsv'])->name('reportes.exportar');
    });
});

require __DIR__.'/auth.php';
