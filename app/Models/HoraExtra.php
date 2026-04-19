<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HoraExtra extends Model
{
    protected $table = 'horas_extras';

    protected $fillable = [
        'empleado_id', 'turno_id', 'fecha', 'cantidad_horas',
        'tipo_hora', 'motivo', 'estado', 'aprobado_por',
        'fecha_aprobacion', 'observaciones_admin',
    ];

    protected $casts = [
        'fecha'            => 'date',
        'fecha_aprobacion' => 'datetime',
        'cantidad_horas'   => 'float',
    ];

    public function empleado(): BelongsTo
    {
        return $this->belongsTo(Empleado::class);
    }

    public function turno(): BelongsTo
    {
        return $this->belongsTo(Turno::class);
    }

    public function aprobadoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'aprobado_por');
    }

    // Badge CSS según estado
    public function getBadgeClassAttribute(): string
    {
        return match($this->estado) {
            'aprobado'  => 'badge-success',
            'rechazado' => 'badge-danger',
            default     => 'badge-warning',
        };
    }

    // Etiqueta legible del tipo
    public function getTipoHoraLabelAttribute(): string
    {
        return match($this->tipo_hora) {
            'nocturna' => 'Nocturna',
            'feriado'  => 'Feriado',
            default    => 'Normal',
        };
    }
}
