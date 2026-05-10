# Spec: Frontend CRUD Empleados

## Identificador
`frontend-empleados`

## Propósito
Define las vistas y comportamiento del CRUD de empleados.

---

## Lista (`/empleados`)

### Header
- Título: "Empleados"
- Botón: "Nuevo Empleado" (admin only)

### Tabla
| Columna | Descripción |
|---|---|
| Cédula | Número de identificación |
| Nombre | Nombre + Apellido |
| Cargo | Texto |
| Departamento | Texto |
| Teléfono | Texto |
| Ingreso | Fecha |
| Estado | Badge: Activo/Inactivo |
| Acciones | Editar, Eliminar (admin) |

### Búsqueda
- Input con placeholder "Buscar por nombre o cédula..."
- Debounce 300ms

### Empty State
- "No hay empleados registrados"
- CTA: "Agregar el primero"

---

## Crear/Editar Modal

### Campos
| Campo | Tipo | Validación |
|---|---|---|
| Cédula | Input text | Required, unique |
| Nombre | Input text | Required |
| Apellido | Input text | Required |
| Cargo | Input text | Required |
| Departamento | Select | Required |
| Teléfono | Input tel | Optional |
| Email | Input email | Optional |
| Fecha ingreso | Date picker | Required |
| Activo | Checkbox | Default: true |

### Guardar
- Botón "Guardar"
- Loading state
- Success: Close modal, refresh table
- Error: Inline validation messages

---

## Eliminar

### Confirm Dialog
- Title: "¿Eliminar empleado?"
- Message: "Juan Pérez será eliminado. Esta acción no se puede deshacer."
- Botones: "Cancelar" (secondary), "Eliminar" (destructive)

### Comportamiento
- No permite eliminar si tiene solicitudes associadas
- Error: "No se puede eliminar. Tiene solicitudes asociadas."

---

## Estados

### Loading
- Skeleton rows en tabla
- Spinner en modal

### Error
- Toast notification con mensaje
- Retry button
