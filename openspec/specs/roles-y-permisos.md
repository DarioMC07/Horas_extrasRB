# Spec: Roles y Control de Acceso

## Identificador
`roles-y-permisos`

## Propósito
Define qué puede ver y hacer cada rol del sistema, garantizando que el control de acceso sea consistente y que ningún actor pueda sobrepasar sus atribuciones.

---

## Roles del Sistema

| Rol | Descripción |
|---|---|
| `empleado` | Trabajador de la imprenta que genera solicitudes de horas extras |
| `supervisor` | Jefe de turno o área; primera capa de validación operativa |
| `administrador` | RRHH o Gerencia; aprobación final, configuración global, exportaciones |

---

## Matriz de Permisos

| Acción | Empleado | Supervisor | Administrador |
|---|:---:|:---:|:---:|
| Crear solicitud propia | ✅ | ✅ | ✅ |
| Ver historial propio | ✅ | ✅ | ✅ |
| Pre-aprobar solicitud de su área | ❌ | ✅ | ❌ |
| Aprobar solicitud (cierre planilla) | ❌ | ❌ | ✅ |
| Rechazar solicitud | ❌ | ✅ (su área) | ✅ (global) |
| Ver solicitudes de todos los empleados | ❌ | Parcial (su área) | ✅ |
| Exportar reportes | ❌ | ❌ | ✅ |
| Gestionar centros de costo | ❌ | ❌ | ✅ |
| Gestionar usuarios y roles | ❌ | ❌ | ✅ |
| Ver dashboard con métricas globales | ❌ | ❌ | ✅ |
| Ver dashboard con métricas de su área | ❌ | ✅ | ✅ |

---

## Reglas de Control de Acceso

- Toda ruta que modifique el estado de una solicitud (POST/PUT/DELETE) debe validar el rol mediante middleware.
- Un usuario autenticado sin rol asignado no puede realizar ninguna acción transaccional.
- El Administrador puede cambiar el rol de cualquier usuario excepto el suyo propio.
- Un Supervisor no puede aprobar solicitudes de empleados fuera de su área asignada.

---

## Casos Borde

- Si un empleado es promovido a Supervisor, sus solicitudes previas siguen siendo accesibles bajo su nuevo rol.
- Un usuario puede pertenecer solo a un rol a la vez (no roles múltiples simultáneos).
- La sesión debe invalidarse inmediatamente si el Administrador revoca el rol de un usuario activo.
