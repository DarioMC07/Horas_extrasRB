# Spec: Frontend CRUD Turnos

## Identificador
`frontend-turnos`

## Propósito
Define las vistas y comportamiento del CRUD de turnos de trabajo.

---

## Lista (`/turnos`)

### Header
- Título: "Turnos"
- Botón: "Nuevo Turno" (admin only)

### Tabla
| Columna | Descripción |
|---|---|
| Fecha | DD/MM/YYYY |
| Empleado | Nombre |
| Hora inicio | HH:MM |
| Hora fin | HH:MM |
| Tipo | Normal/ Nocturna |
| Observaciones | Texto truncado |
| Acciones | Editar, Eliminar |

### Filtros
- Fecha: Date range
- Empleado: Select searchable

---

## Crear/Editar Modal

### Campos
| Campo | Tipo | Validación |
|---|---|---|
| Empleado | Select searchable | Required |
| Fecha | Date picker | Required |
| Hora inicio | Time picker | Required |
| Hora fin | Time picker | Required, > inicio |
| Tipo | Select | Normal/Nocturna |
| Observaciones | Textarea | Optional |

---

## Casos Especiales

### Turno Nocturno
- Hora fin puede ser del día siguiente (ej: 22:00 - 06:00)
- Validación especial para este caso

### Conflictos
- Warning si empleado ya tiene turno ese día
- No bloquear, solo warn

---

## Estados

### Loading
- Skeleton en tabla
- Spinner en modal

### Empty
- "No hay turnos registrados"
