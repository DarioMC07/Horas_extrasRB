# Tasks: Ocultar botón "Nueva Solicitud" del administrador

## Implementación

- [ ] 1.1 Agregar condicional `{!isAdmin && ...}` envolviendo el botón "Nueva Solicitud" en `resources/js/pages/HorasExtras/Index.tsx` líneas 50–54

## Verificación

- [ ] 1.2 Verificar que el botón NO aparece cuando se accede como administrador
- [ ] 1.3 Verificar que el botón SÍ aparece cuando se accede como empleado
- [ ] 1.4 Verificar que el build compila sin errores: `npm run build`
