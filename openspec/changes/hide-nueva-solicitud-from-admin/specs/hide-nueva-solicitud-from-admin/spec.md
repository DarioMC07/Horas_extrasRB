# Spec: Ocultar botón Nueva Solicitud para administrador

## Identificador

`hide-nueva-solicitud-from-admin`

## Propósito

Ocultar el botón "Nueva Solicitud" en la página `/horas-extras` cuando el usuario tiene rol `admin`.

---

## Comportamiento esperado

### Página `/horas-extras` — Vista administrador

| Elemento | Visible | Notas |
|---|---|---|
| Título "Horas Extras" | Sí | Siempre visible |
| Botón "Nueva Solicitud" | **No** | Debe ocultarse |
| Tabla de solicitudes | Sí | Para aprobar/rechazar |
| Filtros | Sí | Siempre visibles |

### Página `/horas-extras` — Vista empleado/supervisor

| Elemento | Visible | Notas |
|---|---|---|
| Título "Horas Extras" | Sí | Siempre visible |
| Botón "Nueva Solicitud" | Sí | Link a `/horas-extras/create` |
| Tabla de solicitudes | Sí | Solo propias (empleado) |
| Filtros | Sí | Siempre visibles |

---

## Validaciones

- El condicional usa la variable `isAdmin` existente (línea 22).
- La página `/horas-extras` sigue siendo accesible para el admin (necesaria para gestionar solicitudes).
- No hay cambios en el formulario de creación ni en la ruta `horas-extras.create`.
