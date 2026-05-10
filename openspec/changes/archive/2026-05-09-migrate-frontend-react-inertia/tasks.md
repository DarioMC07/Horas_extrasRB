# Tasks: Migración Frontend a React + Inertia.js

## 1. Setup Inicial

- [x] 1.1 Instalar dependencias React + Inertia: `@inertiajs/react`, `react`, `react-dom`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `cmdk`
- [x] 1.2 Instalar tipos TypeScript: `@types/react`, `@types/react-dom`
- [x] 1.3 Configurar vite.config.js para React (cambiar app.js → app.tsx)
- [x] 1.4 Crear app.tsx con Inertia root provider y configuración SSR disabled
- [x] 1.5 Crear tsconfig.json o actualizar para React
- [x] 1.6 Init shadcn/ui: `npx shadcn@latest init` con opciones: defaults, tailwind, css variables
- [x] 1.7 Agregar componentes shadcn: `button`, `input`, `label`, `select`, `dialog`, `table`, `card`, `badge`, `avatar`, `separator`, `dropdown-menu`, `textarea`, `scroll-area`, `tabs`, `skeleton`, `toast`, `tooltip`
- [x] 1.8 Configurar tailwind.config.js con paleta `wise-*` (sin fonts custom)
- [x] 1.9 Crear lib/utils.ts con función `cn()`
- [x] 1.10 Eliminar package.json: `alpinejs`

## 2. Auth Layout y Vistas

- [x] 2.1 Crear AuthLayout.tsx (layout centrado para login/register)
- [x] 2.2 Crear pages/Auth/Login.tsx con form login
- [x] 2.3 Crear pages/Auth/Register.tsx con form registro
- [x] 2.4 Crear pages/Auth/ForgotPassword.tsx
- [x] 2.5 Crear pages/Auth/ResetPassword.tsx
- [x] 2.6 Crear pages/Auth/VerifyEmail.tsx
- [x] 2.7 Crear pages/Auth/ConfirmPassword.tsx
- [x] 2.8 Configurar middleware Inertia en Laravel (HandleInertiaRequests.php)
- [x] 2.9 Crear inertia.d.ts para TypeScript
- [x] 2.10 Eliminar resources/views/auth/*.blade.php

## 3. App Layout (Sidebar + Topbar)

- [x] 3.1 Crear components/layouts/AppLayout.tsx con sidebar + topbar
- [x] 3.2 Crear components/layouts/Sidebar.tsx con navegación
- [x] 3.3 Crear components/layouts/Topbar.tsx con user menu dropdown
- [x] 3.4 Implementar navegación role-based (admin vs empleado)
- [x] 3.5 Implementar responsive sidebar (hamburger menu en mobile)
- [x] 3.6 Crear components/layouts/UserMenu.tsx dropdown
- [x] 3.7 Migrar lógica de logout a React (Inertia post)
- [x] 3.8 Eliminar resources/views/layouts/app.blade.php
- [x] 3.9 Eliminar resources/views/layouts/auth.blade.php
- [x] 3.10 Eliminar resources/views/layouts/guest.blade.php

## 4. Dashboard Admin

- [x] 4.1 Crear pages/Dashboard/Admin.tsx
- [x] 4.2 Crear components/dashboard/KpiCard.tsx (skeleton + estados)
- [x] 4.3 Crear components/dashboard/MetricCard.tsx (gradient card para metricas)
- [x] 4.4 Crear components/dashboard/LightweightChart.tsx (wrapper React)
- [x] 4.5 Implementar TendenciaSemanalChart (line chart)
- [x] 4.6 Implementar TopEmpleadosChart (horizontal bar)
- [x] 4.7 Implementar HistogramaSemanal (bar chart)
- [x] 4.8 Crear components/dashboard/PendingRequestsTable.tsx
- [x] 4.9 Agregar auto-refresh polling (60s)
- [x] 4.10 Eliminar resources/views/dashboard/admin.blade.php

## 5. Dashboard Empleado

- [x] 5.1 Crear pages/Dashboard/Empleado.tsx
- [x] 5.2 Crear components/dashboard/EmpleadoKpiCards.tsx
- [x] 5.3 Crear components/dashboard/MiHistorialTable.tsx
- [x] 5.4 Eliminar resources/views/dashboard/empleado.blade.php
- [x] 5.5 Eliminar resources/views/dashboard/empleado_sin_perfil.blade.php
- [x] 5.6 Eliminar resources/views/dashboard.blade.php

## 6. HorasExtras CRUD

- [x] 6.1 Crear pages/HorasExtras/Index.tsx (lista con filtros)
- [x] 6.2 Crear components/horasextras/HorasExtrasTable.tsx con pagination
- [x] 6.3 Crear components/horasextras/Filters.tsx (estado, fecha, búsqueda)
- [x] 6.4 Crear pages/HorasExtras/Create.tsx (formulario)
- [x] 6.5 Crear components/horasextras/HoraExtraForm.tsx con validación
- [x] 6.6 Crear pages/HorasExtras/Show.tsx (detalle + timeline)
- [x] 6.7 Crear components/horasextras/EstadoTimeline.tsx
- [x] 6.8 Crear components/horasextras/RechazoModal.tsx
- [x] 6.9 Implementar acciones: Pre-aprobar, Aprobar, Rechazar
- [x] 6.10 Eliminar resources/views/horas-extras/*.blade.php

## 7. Empleados CRUD

- [x] 7.1 Crear pages/Empleados/Index.tsx
- [x] 7.2 Crear components/empleados/EmpleadosTable.tsx
- [x] 7.3 Crear pages/Empleados/Create.tsx modal o page
- [x] 7.4 Crear pages/Empleados/Edit.tsx modal o page
- [x] 7.5 Crear components/empleados/EmpleadoForm.tsx
- [x] 7.6 Crear components/empleados/DeleteConfirmDialog.tsx
- [x] 7.7 Implementar búsqueda con debounce
- [x] 7.8 Agregar validaciones inline

## 8. Turnos CRUD

- [x] 8.1 Crear pages/Turnos/Index.tsx
- [x] 8.2 Crear components/turnos/TurnosTable.tsx
- [x] 8.3 Crear components/turnos/TurnoForm.tsx (modal)
- [x] 8.4 Implementar selector de empleado searchable
- [x] 8.5 Manejar turnos nocturnos (hora fin día siguiente)

## 9. Usuarios CRUD

- [x] 9.1 Crear pages/Usuarios/Index.tsx
- [x] 9.2 Crear components/usuarios/UsuariosTable.tsx
- [x] 9.3 Crear components/usuarios/EditRolModal.tsx
- [x] 9.4 Implementar restricciones: no cambiarse a sí mismo, no quitar rol al último admin

## 10. Reportes

- [x] 10.1 Crear pages/Reportes/Index.tsx
- [x] 10.2 Crear components/reportes/FiltrosReporte.tsx
- [x] 10.3 Crear components/reportes/ReporteTable.tsx
- [x] 10.4 Implementar resumen footer (total horas, count)
- [x] 10.5 Crear funcionalidad exportar CSV
- [x] 10.6 Eliminar resources/views/reportes/index.blade.php

## 11. Profile

- [x] 11.1 Crear pages/Profile/Edit.tsx
- [x] 11.2 Crear components/profile/UpdateProfileForm.tsx
- [x] 11.3 Crear components/profile/UpdatePasswordForm.tsx
- [x] 11.4 Crear components/profile/DeleteAccountForm.tsx (danger zone)
- [x] 11.5 Implementar confirm password antes de eliminar
- [x] 11.6 Eliminar resources/views/profile/*.blade.php

## 12. Componentes UI shadcn

- [x] 12.1 Personalizar button variants con colores wise-green
- [x] 12.2 Personalizar badge variants con colores de estado
- [x] 12.3 Agregar tooltip a icon buttons
- [x] 12.4 Configurar toast provider (sonner/warning)

## 13. Cleanup Final

- [x] 13.1 Eliminar resources/views/components/*.blade.php (10 componentes)
- [x] 13.2 Eliminar resources/views/navigation.blade.php
- [x] 13.3 Eliminar resources/views/welcome.blade.php
- [x] 13.4 Eliminar resources/js/app.js (Alpine bootstrap)
- [x] 13.5 Eliminar public/fonts/* (si hay fonts custom de blade)
- [x] 13.6 Crear HandleInertiaRequests.php limpio
- [x] 13.7 Limpiar public/css/app.css
- [x] 13.8 Actualizar routes/web.php comments si hay referencias a vistas
- [x] 13.9 Verificar que todas las rutas funcionan (auth, logout, redirect)
- [x] 13.10 Build completo exitosa

## 14. Post-Migration (Fuera de scope inicial)

- [ ] 14.1 Command palette (⌘K)
- [ ] 14.2 Persistir preferencias (sidebar collapsed)
- [ ] 14.3 Theme toggle (dark mode)
