# Design: Ocultar botón "Nueva Solicitud" del administrador

## Decisión

Envolver el botón "Nueva Solicitud" con un condicional `{!isAdmin && (...)}`.

**Archivo:** `resources/js/pages/HorasExtras/Index.tsx`

**Línea objetivo:** 50–54

```tsx
// ANTES (bug)
<Button asChild className="bg-wise-green text-wise-black hover:bg-wise-green/90">
    <Link href={route('horas-extras.create')}>
        Nueva Solicitud
    </Link>
</Button>

// DESPUÉS (fix)
{!isAdmin && (
    <Button asChild className="bg-wise-green text-wise-black hover:bg-wise-green/90">
        <Link href={route('horas-extras.create')}>
            Nueva Solicitud
        </Link>
    </Button>
)}
```

La variable `isAdmin` **ya existe** en la línea 22 del mismo archivo:

```tsx
const isAdmin = auth?.user?.role === 'admin';
```

Solo se debe agregar el condicional `{!isAdmin && ...}` alrededor del botón.

## Sin cambios adicionales

- No hay cambios en rutas, controladores ni base de datos.
- No hay cambios en la tabla ni en los filtros de la página.
- No hay cambios en el sidebar ni en otros componentes.
