<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Turno extends Model
{
    protected $fillable = [
        'empleado_id', 'fecha', 'hora_inicio', 'hora_fin', 'tipo', 'observaciones',
    ];

    protected $casts = [
        'fecha' => 'date',
    ];

    public function empleado(): BelongsTo
    {
        return $this->belongsTo(Empleado::class);
    }

    public function horasExtras(): HasMany
    {
        return $this->hasMany(HoraExtra::class);
    }

    // Duración del turno en horas
    public function getDuracionAttribute(): float
    {
        $inicio = \Carbon\Carbon::parse($this->hora_inicio);
        $fin    = \Carbon\Carbon::parse($this->hora_fin);
        return $inicio->diffInMinutes($fin) / 60;
    }
}
