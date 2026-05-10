# Spec: Frontend Gestión de Usuarios

## Identificador
`frontend-usuarios`

## Propósito
Define la gestión de usuarios del sistema y asignación de roles.

---

## Lista (`/usuarios`)

### Header
- Título: "Usuarios"
- Sin botón crear (admin crea via otro flujo)

### Tabla
| Columna | Descripción |
|---|---|
| Nombre | Nombre completo |
| Email | Email |
| Rol | Badge: Admin/Supervisor/Empleado |
| Empleado asociado | Nombre o "Sin asociar" |
| Acciones | Editar rol |

### Nota
- Solo admins pueden ver esta página
- Verificar en controller y middleware

---

## Editar Rol (Modal)

### Contenido
- Header: "Editar Usuario: {nombre}"
- Select: Rol (Admin/Supervisor/Empleado)
- Info: "Último acceso: {fecha}"

### Restricciones
- No se puede cambiar el propio rol
- No se puede quitar admin al último admin

### Guardar
- Botón "Actualizar"
- Success: Toast + refresh
- Error: Mensaje de error

---

## Estados

### Empty
- "No hay usuarios" (no debería pasar nunca)

### Loading
- Skeleton rows

### Error
- Alert con mensaje
