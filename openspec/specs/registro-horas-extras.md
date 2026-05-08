# Spec: Registro y Ciclo de Vida de Horas Extras

## Identificador
`registro-horas-extras`

## Propósito
Define el comportamiento esperado del sistema para el registro, visibilidad y transición de estados de una solicitud de horas extras, desde la perspectiva de cada rol.

---

## Comportamiento por Rol

### Empleado
- Puede crear una solicitud de horas extras indicando: fecha, hora de inicio, hora de fin y motivo.
- No puede crear solicitudes con fechas futuras a más de 7 días calendario.
- No puede modificar una solicitud que ya fue aprobada, pre-aprobada o rechazada.
- Puede ver el historial completo de sus solicitudes con el estado actual de cada una.
- Recibe retroalimentación (comentario obligatorio) cuando una solicitud es rechazada.

### Supervisor
- Puede ver únicamente las solicitudes de empleados de su turno o área asignada.
- Puede **pre-aprobar** o **rechazar** solicitudes en estado `pendiente`.
- Al rechazar, debe proveer un comentario obligatorio visible para el empleado.
- No puede modificar los datos de la solicitud, solo cambiar el estado.

### Administrador (RRHH)
- Puede ver todas las solicitudes del sistema sin importar el área.
- Puede **aprobar** solicitudes en estado `pre_aprobada` (o `pendiente` si el flujo es de un solo nivel).
- Puede **rechazar** cualquier solicitud con comentario obligatorio.
- Recibe alerta visual cuando un empleado supera el límite legal semanal de horas extras.
- Puede exportar registros filtrados por rango de fecha, empleado, área o estado.

---

## Ciclo de Vida de Estados

```
pendiente → pre_aprobada → aprobada
          ↓               ↓
        rechazada       rechazada
```

- Una solicitud en `aprobada` no puede ser modificada ni revertida sin dejar un registro de auditoría.
- El cambio de estado `pendiente → aprobada` (saltando pre-aprobación) solo es válido para Administradores.

---

## Validaciones de Negocio

| Regla | Comportamiento esperado |
|---|---|
| Límite semanal legal | Alerta visible al Administrador si el empleado supera las horas legales en la semana |
| Rechazo sin comentario | El sistema bloquea el rechazo si no se provee comentario |
| Solicitud duplicada | El sistema advierte si ya existe una solicitud en el mismo rango horario para el mismo empleado |
| Modificación post-aprobación | Bloqueada; cualquier excepción deja rastro en el audit trail |

---

## Casos Borde

- Si el Supervisor es removido de un área, sus aprobaciones previas permanecen válidas.
- Un empleado no puede ser su propio aprobador, aunque tenga rol de Supervisor.
- Las solicitudes rechazadas pueden ser re-enviadas por el empleado como una nueva solicitud (no se reutiliza la rechazada).
