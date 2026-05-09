# Design: Migración Frontend a React + Inertia.js

## Context

El proyecto actual es un sistema Laravel 13 monolith con frontend Blade + Alpine.js. El frontend presenta deuda técnica acumulada:

- **36 vistas Blade** con CSS inline y lógica de presentación mezclada
- **Alpine.js** para interactividad insuficiente para UI complejas
- **Sin component reuse** - cada vista es independiente
- **No hay type safety** - JavaScript vanilla sin tipos
- **Debugging difícil** - errores en templates Blade + Alpine sonhard to trace

El sistema tiene 4 modelos (User, Empleado, Turno, HoraExtra) con lógica de negocio intacta. Las rutas API usan POST/PUT/DELETE protegidas con middleware auth + rol.

El objetivo es reemplazar completamente la capa de presentación (frontend) manteniendo el backend Laravel intacto.

---

## Goals / Non-Goals

**Goals:**
- Frontend SPA con React 19 + Inertia.js
- shadcn/ui como sistema de componentes base
- Tailwind CSS 100% con paleta `wise-*` existente
- Dashboard interactivo con gráficos lightweight-charts
- CRUD moderno para todas las entidades

**Non-Goals:**
- No modificar lógica de negocio del backend
- No cambiar la base de datos ni migrations
- No crear API REST separate (Inertia handle todo)
- No implementar SSR inicialmente (SPA puro)
- No migrar el NaturalQueryService (posterior)
- No SEO optimization (aplicación interna)

---

## Decisions

### Decisión 1: SPA vs SSR
**Elegido: SPA puro** (sin SSR)

| Alternativa | Pros | Cons |
|---|---|---|
| SSR con Inertia | Mejor SEO, hydrate en server | Configuración compleja, más recursos |
| SPA puro | Simple, rápido de implementar, menor costo server | Sin SEO, flash de loading inicial |

**Rationale:** Aplicación interna sin SEO requerido. SPA puro es 2x más rápido de implementar.

---

### Decisión 2: Routing
**Elegido: Inertia Router (no React Router)**

Inertia.js intercepta navegación y hace requests al backend sinfull page reloads.

```jsx
// En lugar de React Router:
<Link href="/dashboard">Dashboard</Link>

// Inertia detecta clicks y:
1. Hace GET /dashboard
2. Laravel devuelve página con datos
3. Inertia actualiza page prop
4. React re-renderiza solo lo necesario
```

**Alternativas consideradas:**
- React Router: Funciona pero pierde los beneficios de Inertia
- No routing: Cada view es full page reload (pierde SPA feel)

---

### Decisión 3: State Management
**Elegido: React useState + Inertia page props**

| Patrón | Cuándo usarlo |
|---|---|
| `usePage().props` | Datos del server (KPIs, lists) |
| `useState` | UI state local (modals, loading, forms) |
| `useForm` (Inertia) | Form submissions con validación |

**Rationale:** El proyecto es CRUD simple. useState + Inertia props cubre todos los casos sin necesidad de Zustand/Redux.

---

### Decisión 4: Charts Integration
**Elegido: lightweight-charts con React wrapper custom**

```jsx
<LightweightChart
  type="line"
  data={chartData}
  options={config}
/>
```

**Rationale:** Proyecto ya tiene licencia de lightweight-charts. Crear un wrapper React simple es más limpio que integrar una library diferente.

---

### Decisión 5: shadcn/ui Installation
**Elegido: Con Tailwind CSS + CSS variables (no CSS-in-JS)**

shadcn/ui por defecto usa Tailwind. El proyecto ya tiene Tailwind configurado.

**Pasos de instalación:**
```bash
npx shadcn@latest init
# Config: defaults
# Tailwind: yes
# CSS variables: yes

npx shadcn@latest add button input dialog table card badge avatar
```

**Rationale:** Evita dependencias extra (emotion, vanilla-extract) y mantiene 100% Tailwind.

---

### Decisión 6: Project Structure
```
resources/js/
├── app.tsx                 # React root + Inertia setup
├── pages/                   # Inertia pages (1:1 con rutas)
│   ├── Auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ForgotPassword.tsx
│   ├── Dashboard/
│   │   ├── Admin.tsx
│   │   └── Empleado.tsx
│   ├── HorasExtras/
│   │   ├── Index.tsx
│   │   ├── Create.tsx
│   │   └── Show.tsx
│   └── ...
├── components/
│   ├── ui/                  # shadcn components (registry)
│   ├── layouts/             # AppLayout, AuthLayout
│   └── dashboard/           # Chart components
├── lib/
│   ├── utils.ts             # cn() helper
│   └── inertia.ts          # Inertia setup
└── types/
    └── inertia.d.ts         # TypeScript types
```

---

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| **Perdida de SEO** | Aceptado - aplicación interna |
| **Flash en carga inicial** | Skeleton loaders + spinner en app root |
| **Alpine → React learning curve** | Seguir patterns establecidos de Inertia |
| **shadcn/ui CSS variables conflicts** | Usar prefijo `shadcn-` para overrides |
| **Charts en React (re-renders)** | useMemo para chart data, refs para instancia |
| **Migración grande sin rollback** | git branch feature + incremental commits |
| **Session auth en SPA** | CSRF via Inertia, no extra config needed |

---

## Migration Plan

### Fase 1: Setup (Día 1, ~2h)
1. Instalar dependencias:
   ```bash
   npm install @inertiajs/react react react-dom
   npm install -D @types/react @types/react-dom
   ```
2. Configurar vite.config.js para React
3. Crear app.tsx con Inertia root provider
4. Setup shadcn/ui con `npx shadcn@latest init`
5. Agregar componentes base

### Fase 2: Auth (Día 1-2, ~4h)
1. Crear AuthLayout.tsx
2. Migrar login.tsx → Login.tsx
3. Migrar register.tsx → Register.tsx
4. Migrar forgot-password, reset-password
5. Configurar middleware Inertia en Laravel

### Fase 3: App Layout (Día 2, ~3h)
1. Crear AppLayout.tsx con sidebar + topbar
2. Migrar navigation logic de layouts/app.blade.php
3. Responsive sidebar (mobile toggle)
4. User dropdown menu

### Fase 4: Dashboard (Día 3, ~4h)
1. AdminDashboard.tsx con KPIs + charts
2. EmpleadoDashboard.tsx
3. Wrapper component para lightweight-charts

### Fase 5: CRUDs (Día 3-4, ~8h)
1. HorasExtras (Index, Create, Show)
2. Empleados CRUD
3. Turnos CRUD
4. Usuarios (solo editar rol)

### Fase 6: Reportes + Profile (Día 4, ~4h)
1. Eliminar Blade views migrados
2. Eliminar resources/js/app.js (Alpine)
3. Actualizar package.json (remover alpine)
4. Eliminar CSS inline del asistente

### Deploy
1. Commit a main
2. Test en staging
3. Swap production

---

## Open Questions

1. **¿Mantener el sidebar colapsado por defecto en desktop?**
   - Estado actual: siempre visible
   - Props:AHORA: visible completo

2. **¿Usar Command Palette (⌘K) para navegación?**
   - shadcn tiene `cmdk` integrado
   - Posterior a migración, no en scope inicial

3. **¿Cuántos breakpoints de responsive?**
   - Proponer: mobile (<768px), tablet (768-1024px), desktop (>1024px)

4. **¿Loading state global o por sección?**
   - Proponer: Global skeleton en app, no full page spinners

5. **¿Persistir preferencias del usuario (sidebar collapsed, theme)?**
   - LocalStorage para sidebar state
   - Theme: no (solo un theme por ahora)

---

## Dependencies

### NPM Packages (new)
```json
{
  "@inertiajs/react": "^2.0",
  "react": "^19.0",
  "react-dom": "^19.0",
  "lucide-react": "^0.500",
  "class-variance-authority": "^0.7",
  "clsx": "^2.1",
  "tailwind-merge": "^2.5",
  "cmdk": "^1.0"
}
```

### Dev Dependencies (new)
```json
{
  "@types/react": "^19.0",
  "@types/react-dom": "^19.0"
}
```

### Eliminar
```json
{
  "alpinejs": "^3.4"  // REMOVER
}
```
