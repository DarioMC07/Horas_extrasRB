# Spec: Frontend App Layout

## Identificador
`frontend-app-layout`

## Propósito
Define la estructura del layout principal de la aplicación: sidebar de navegación y topbar con información del usuario.

---

## Sidebar (Navigation)

### Estructura
```
┌─────────────────────────────┐
│  [Logo]                    │
├─────────────────────────────┤
│  Principal                 │
│  ├─ Dashboard              │
│  └─ Horas Extras           │
├─────────────────────────────┤
│  Administración (admin)     │
│  ├─ Empleados              │
│  ├─ Turnos                 │
│  ├─ Reportes               │
│  └─ Usuarios               │
├─────────────────────────────┤
│  [Admin] Asistente AI      │
├─────────────────────────────┤
│  [User Menu]               │
│  └─ Cerrar Sesión          │
└─────────────────────────────┘
```

### Comportamiento
- Logo clickeable → `/dashboard`
- Links activos con `active` state (bg-wise-mint, text-wise-green)
- Rol-based visibility: sección Admin solo visible para `admin`
- Responsive: en mobile, sidebar se oculta con hamburger menu

### Iconos por ruta
- Dashboard: Grid icon
- Horas Extras: Clock icon
- Empleados: Users icon
- Turnos: Calendar icon
- Reportes: BarChart icon
- Usuarios: Settings icon
- Asistente: Bot icon

---

## Topbar

### Contenido
```
┌──────────────────────────────────────────────┐
│  [≡] Page Title                    [Avatar]  │
└──────────────────────────────────────────────┘
```

- Hamburger menu (mobile only): Toggle sidebar
- Page title: Nombre de la ruta actual
- User avatar: Iniciales del usuario en círculo
- Dropdown menu (click en avatar):
  - Nombre + rol
  - Editar Perfil → `/profile`
  - Cerrar Sesión → POST `/logout`

---

## Responsive Breakpoints

| Breakpoint | Sidebar | Topbar |
|---|---|---|
| Desktop (>1024px) | Visible, fixed | Full |
| Tablet (768-1024px) | Collapsed a icon-only | Full |
| Mobile (<768px) | Hidden, overlay on toggle | Hamburger visible |

---

## Variantes de Layout

### AppLayout (authenticated)
- Sidebar + Topbar + Content area
- Verificado por middleware Inertia

### AuthLayout (guest)
- Centrado, sin sidebar/topbar
- Para `/login`, `/register`, `/forgot-password`, etc.
