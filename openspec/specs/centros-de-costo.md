# Spec: Asignación de Centros de Costo

## Identificador
`centros-de-costo`

## Propósito
Define el comportamiento esperado para la asignación de horas extras a departamentos u órdenes de producción, permitiendo cruzar datos laborales con la rentabilidad operativa de la imprenta.

---

## Comportamiento por Rol

### Empleado
- Al crear una solicitud de horas extras, puede (opcionalmente) seleccionar un centro de costo de una lista predefinida.
- Si no selecciona ninguno, la solicitud queda sin asignación de costo.

### Supervisor
- Puede reasignar o asignar el centro de costo de una solicitud **antes** de pre-aprobarla.
- No puede crear ni eliminar centros de costo.

### Administrador
- Es el único rol que puede crear, editar o desactivar centros de costo.
- Puede reasignar el centro de costo de cualquier solicitud en estado `pendiente` o `pre_aprobada`.
- En el dashboard, puede filtrar métricas de horas por centro de costo.

---

## Validaciones de Negocio

| Regla | Comportamiento esperado |
|---|---|
| Centro de costo desactivado | No aparece en la lista de selección para nuevas solicitudes; las solicitudes históricas conservan su referencia |
| Solicitud aprobada | El centro de costo no puede modificarse tras la aprobación final |
| Centro de costo eliminado | Bloqueado si tiene solicitudes asociadas; solo puede desactivarse |

---

## Casos Borde

- Una solicitud puede no tener centro de costo asignado; las métricas deben mostrar un grupo "Sin asignar".
- Si un centro de costo es renombrado, las solicitudes históricas deben reflejar el nombre actualizado.
