# Spec: Frontend Horas Extras

## Identificador
`frontend-horas-extras`

## Propósito
Define las vistas y comportamiento del CRUD de solicitudes de horas extras.

---

## Lista (`/horas-extras`)

### Filtros
- **Estado**: Select (Todos, Pendiente, Pre-aprobada, Aprobada, Rechazada)
- **Fecha**: Date range picker (desde - hasta)
- **Búsqueda**: Input texto para empleado

### Tabla
| Columna | Descripción |
|---|---|
| ID | # + número |
| Empleado | Nombre completo |
| Fecha | Format: DD/MM/YYYY |
| Horas | Decimal con 1 decimal |
| Tipo | Badge: Normal (green), Nocturna (blue), Feriado (orange) |
| Estado | Badge con color según estado |
| Acciones | Ver (icon eye) |

### Paginación
- 15 registros por página
- Números de página + prev/next

### Acciones
- Fila clickeable → Ver detalle
- Admin: Dropdown con Pre-aprobar/Rechazar (si pendiente)

---

## Crear (`/horas-extras/create`)

### Formulario
| Campo | Tipo | Validación |
|---|---|---|
| Fecha | Date picker | Required, max 7 días futuro |
| Hora inicio | Time picker | Required |
| Hora fin | Time picker | Required, > inicio |
| Tipo hora | Select | Normal/Nocturna/Feriado |
| Motivo | Textarea | Required, min 10 chars |
| Centro de costo | Select (opcional) | - |

### Submit
- Botón "Guardar Solicitud"
- Loading state en botón
- Success: Redirect a `/horas-extras/{id}`
- Error: Mensajes inline

---

## Detalle (`/horas-extras/{id}`)

### Información
- Header: Estado actual + Badge
- Detalles: Empleado, fecha, horas, tipo, motivo
- Timeline de cambios de estado

### Acciones (según estado y rol)
- **Empleado**: Solo ver
- **Supervisor (area match)**: Pre-aprobar / Rechazar (con comentario)
- **Admin**: Aprobar / Rechazar (con comentario)

### Rechazo requiere
- Textarea "Motivo del rechazo" (obligatorio)
- Botón "Confirmar Rechazo"

---

## Estados Posibles

| Estado | Color Badge | Acciones Disponibles |
|---|---|---|
| Pendiente | Yellow | Pre-aprobar/Rechazar |
| Pre-aprobada | Blue | Aprobar/Rechazar (admin) |
| Aprobada | Green | Ninguna |
| Rechazada | Red | Ver motivos |

---

## Validaciones

- No permite crear solicitud si ya existe en mismo horario (API warning)
- Máximo 7 días en futuro
- Horas mínimo 0.5, máximo 12
