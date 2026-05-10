# Propuesta: Migración Frontend a React + Inertia.js

## Why

El frontend actual basado en Blade + Alpine.js presenta limitaciones técnicas que dificultan el desarrollo de interfaces complejas y mantenibles:

1. **Escalabilidad**: Blade no ofrece component reuse ni state management real. Cada vista es un archivo monolítico.
2. **DX deficiente**: Debugging de Alpine.js es doloroso; CSS inline en templates es difícil de mantener.
3. **Ecosistema pobre**: No hay libraries de componentes UI de calidad para Alpine vs React.
4. **UX del Asistente**: La interfaz de chat conversacional en `/asistente` requiere una UI rica que Blade no puede ofrecer de forma limpia.

La migración a React + Inertia.js permite:
- Componentes reutilizables y tipados
- shadcn/ui para UI components de calidad
- Mejor experiencia de desarrollo y testing
- Base sólida para escalar el proyecto

---

## What Changes

### Nuevas capacidades
- **Auth SPA**: Login, registro, forgot-password, reset-password, verify-email, confirm-password en React
- **Dashboard interactivo**: Gráficos con lightweight-charts, KPIs en tiempo real
- **Chat conversacional**: UI de asistente con bubbles, typing indicators, markdown rendering
- **CRUD moderno**: Horas extras, empleados, turnos, usuarios con shadcn/ui components
- **Sistema de layouts**: AppLayout con sidebar responsive + topbar, AuthLayout para login

### Modificaciones
- **BREAKING** Reemplazo completo del frontend: 36 archivos Blade → 0
- **BREAKING** package.json: Alpine.js reemplazado por React + Inertia.js
- **BREAKING** vite.config.js: Configurado para React en lugar de Alpine/Vanilla

### Remociones
- `resources/js/app.js` (Alpine bootstrap)
- `resources/views/**/*.blade.php` (36 vistas migradas)
- `resources/views/components/*` (10 componentes Blade)
- CSS inline del asistente (integrado en componentes React)
- `lightweight-charts` en Alpine (migrado a wrapper React)

---

## Capabilities

### New Capabilities

| Capability | Descripción |
|---|---|
| `frontend-spa-auth` | Autenticación completa SPA con Inertia: login, register, logout, password reset, email verification. Middleware Inertia para protección de rutas |
| `frontend-app-layout` | Layout principal con sidebar colapsable, topbar con user menu, navegación role-based. Responsive mobile |
| `frontend-dashboard` | Dashboard con KPIs, gráficos de tendencia, histogramas, tablas de solicitudes pendientes. Dos variantes: admin y empleado |
| `frontend-horas-extras` | CRUD completo de solicitudes: lista con filtros y paginación, formulario de creación, detalle de solicitud, cambio de estado |
| `frontend-empleados` | CRUD de empleados con búsqueda, modal de creación/edición |
| `frontend-turnos` | CRUD de turnos con selector de fechas y horas |
| `frontend-usuarios` | Gestión de usuarios con asignación de roles |
| `frontend-reportes` | Filtros avanzados y exportación CSV |
| `frontend-profile` | Edición de perfil, cambio de password, eliminación de cuenta |
| `frontend-chat-assistant` | Interfaz conversacional con typing indicators, rendering de markdown, SQL debug expandable |
| `ui-component-system` | Sistema de componentes shadcn/ui: Button, Input, Dialog, Table, Card, Tabs, Avatar, Badge, Separator, Dropdown |

### Modified Capabilities

Ninguna. La lógica de negocio permanece intacta. Solo cambia la capa de presentación.

---

## Impact

### Código afectado
- `resources/js/**` - Reescritura completa
- `resources/views/**` - Eliminación tras migración
- `package.json` - Nuevas dependencias React
- `vite.config.js` - Adaptación para Inertia + React
- `tailwind.config.js` - Configuración shadcn/ui
- `routes/web.php` - Sin cambios (Inertia maneja SPA routing)

### Dependencias nuevas
```
@inertiajs/react
@inertiajs/server (SSR adapter si se usa)
react
react-dom
lucide-react
class-variance-authority
clsx
tailwind-merge
cmdk (para command palette del chat)
```

### Dependencias eliminadas
```
alpinejs
```

### Sin cambios
- Backend Laravel (controllers, models, services)
- Base de datos y migrations
- Rutas y middleware
- Lógica de negocio y validaciones
