# Spec: Frontend Reportes

## Identificador
`frontend-reportes`

## Propósito
Define la generación de reportes filtrados y exportación CSV.

---

## Vista (`/reportes`)

### Filtros
| Filtro | Tipo | Default |
|---|---|---|
| Fecha desde | Date picker | Primer día del mes |
| Fecha hasta | Date picker | Hoy |
| Empleado | Select searchable | Todos |
| Departamento | Select | Todos |
| Estado | Select | Todos |

### Botón: "Aplicar Filtros"

---

## Tabla de Resultados

| Columna | Descripción |
|---|---|
| Empleado | Nombre completo |
| Departamento | Texto |
| Fecha | DD/MM/YYYY |
| Horas | Decimal |
| Tipo | Badge |
| Estado | Badge |

### Paginación
- 20 registros por página

### Summary Footer
- Total horas: SUM
- Total registros: COUNT

---

## Exportación

### Botón: "Exportar CSV"
- Posición: Header right
- Descarga archivo `reporte_horas_extras_{fecha}.csv`

### Columnas CSV
- Empleado, Cédula, Departamento, Fecha, Hora inicio, Hora fin, Horas, Tipo, Estado

---

## Estados

### Loading
- Skeleton tabla
- Disabled filtros

### Empty
- "No hay resultados para los filtros seleccionados"
- Sugerencia: "Amplía el rango de fechas"

### Error
- Alert con mensaje
- Retry button
