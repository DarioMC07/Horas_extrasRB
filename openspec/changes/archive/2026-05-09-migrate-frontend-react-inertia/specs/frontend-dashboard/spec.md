# Spec: Frontend Dashboard

## Identificador
`frontend-dashboard`

## Propósito
Define los dashboards para admin y empleado con KPIs, gráficos y tablas resumen.

---

## Dashboard Admin (`/dashboard`)

### KPIs (4 cards en grid 2x2)
1. **Total horas este mes**: Número + trend vs mes anterior
2. **Solicitudes pendientes**: Número con badge warning
3. **Empleados activos**: Número
4. **Horas nocturnas %**: Porcentaje

### Gráficos

#### Tendencia Semanal (`lightweight-charts`)
- Line chart con series: horas normales, nocturnas, feriados
- X-axis: últimos 7 días
- Y-axis: horas
- Tooltip on hover

#### Top 5 Empleados (`lightweight-charts`)
- Horizontal bar chart
- Top 5 por horas este mes
- Color por tipo de hora

#### Histograma Semanal (`lightweight-charts`)
- Bar chart semanal
- Distribución por día

### Tabla: Solicitudes Pendientes
- Columns: Empleado, Fecha, Horas, Tipo, Estado
- Max 10 rows, paginated
- Link a `/horas-extras/{id}`

---

## Dashboard Empleado (`/dashboard`)

### KPIs (2 cards)
1. **Mis horas este mes**: Total horas aprobadas
2. **Solicitudes pendientes**: Mi count

### Tabla: Mi Historial Reciente
- Últimas 5 solicitudes
- Columns: Fecha, Horas, Tipo, Estado
- Link a `/horas-extras/{id}`

---

## Estados de UI

### Loading
- Skeleton cards para KPIs
- Skeleton chart placeholder
- Spinner en tabla

### Empty
- "Sin datos" illustration
- Mensaje contextual

### Error
- Alert con mensaje de error
- Botón "Reintentar"

---

## Comportamiento de Datos

- Datos se cargan via Inertia `usePage()` props
- Props: `kpis`, `charts`, `pendingRequests`, `recentActivity`
- Auto-refresh cada 60 segundos (polling)
