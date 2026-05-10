# Propuesta: Ocultar botón "Nueva Solicitud" del administrador

## Why

El administrador (gerente RRHH) accede a la página `/horas-extras` para **aprobar o rechazar** solicitudes creadas por empleados. Sin embargo, el botón "Nueva Solicitud" que lleva a `/horas-extras/create` se muestra a **todos** los usuarios sin distinción de rol.

Esto representa un **bug de UX** ya que:
1. El administrador nunca debería crear solicitudes de horas extras — esa es función del empleado.
2. Mostrar opciones que no puede usar genera confusión y reduce la confianza en el sistema.
3. El rol de administrador está claramente diferenciado: **aprueba/rechaza**, no registra.

## What Changes

- El botón "Nueva Solicitud" en `resources/js/pages/HorasExtras/Index.tsx` queda oculto cuando `auth.user.role === 'admin'`.
- La página `/horas-extras` sigue siendo accesible para el administrador (necesaria para gestionar solicitudes).
- El botón permanece visible para empleados y supervisores.

## Impacto por rol

| Rol | Antes | Después |
|---|---|---|
| **Empleado** | Ve el botón → puede crear solicitud | Sin cambios |
| **Supervisor** | Ve el botón → puede crear solicitud | Sin cambios |
| **Administrador** | Ve el botón → no debería | **Bug corregido**: ya no lo ve |

## No-objetivos

- No modificar lógica de negocio ni rutas del backend.
- No cambiar el comportamiento del formulario de creación.
- No afectar la vista de detalle ni la tabla de solicitudes.
