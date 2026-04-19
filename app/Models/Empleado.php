<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Empleado extends Model
{
    protected $fillable = [
        'nombre', 'apellido', 'cedula', 'cargo',
        'departamento', 'telefono', 'fecha_ingreso', 'activo',
    ];

    protected $casts = [
        'fecha_ingreso' => 'date',
        'activo'        => 'boolean',
    ];

    // Accessor: nombre completo
    public function getNombreCompletoAttribute(): string
    {
        return "{$this->nombre} {$this->apellido}";
    }

    public function turnos(): HasMany
    {
        return $this->hasMany(Turno::class);
    }

    public function horasExtras(): HasMany
    {
        return $this->hasMany(HoraExtra::class);
    }

    public function user()
    {
        return $this->hasOne(User::class);
    }

    // Scope: solo empleados activos
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    // Total horas extras aprobadas del mes actual
    public function totalHorasMes(): float
    {
        return $this->horasExtras()
            ->where('estado', 'aprobado')
            ->whereMonth('fecha', now()->month)
            ->whereYear('fecha', now()->year)
            ->sum('cantidad_horas');
    }
}
