## Why

Los administradores del sistema necesitan responder preguntas ad-hoc sobre los datos sin depender de reportes predefinidos ni conocer SQL. Hoy si un gerente quiere saber "¿cuál es el empleado con más horas extra aprobadas en el último trimestre?" debe generar manualmente un reporte o exportar datos y procesarlos. NaturalQuery permite hacer consultas en lenguaje natural al instante desde un chat integrado, reduciendo la fricción para explorar datos.

## What Changes

- Nuevo servicio backend `NaturalQueryService` que consume la API de NaturalQuery (`localhost:4000`)
- Nuevo endpoint `POST /naturalquery/query` que recibe preguntas en lenguaje natural y retorna respuestas estructuradas (SQL, datos, interpretación, tipo de renderizado)
- Nuevo endpoint `POST /naturalquery/session` para gestionar la sesión con NaturalQuery
- Panel de chat deslizable desde la derecha (tipo IDE) accesible desde cualquier página autenticada
- Componente `ChatPanel` con historial conversacional, campo de entrada y renderizado dinámico según el tipo de respuesta
- Componentes de renderizado: `MetricCard`, `ListView`, `DataTable`, `ChatBubble` para los 4 `render.type` de NaturalQuery
- Botón toggle en la Topbar para abrir/cerrar el panel de chat
- Visualización de metadatos: nivel de confianza, SQL generado (colapsable), aviso de truncado, interpretación enriquecida (Markdown)
- Historial conversacional gestionado por el frontend, enviado en cada request para preguntas de seguimiento

## Capabilities

### New Capabilities

- `naturalquery-chat`: Panel de consultas en lenguaje natural exclusivo para administradores. Permite hacer preguntas sobre los datos de la base de datos usando lenguaje natural. Incluye sesión con NaturalQuery, envío de preguntas, gestión de historial conversacional, y renderizado dinámico de respuestas (métrica, lista, tabla, mensaje) con metadatos de confianza y SQL generado.

### Modified Capabilities

<!-- Ninguna capacidad existente modifica sus requerimientos -->

## Impact

- **Backend**: Nuevo servicio `app/Services/NaturalQueryService.php`, nuevo controlador `NaturalQueryController`, 2 rutas nuevas en `routes/web.php`
- **Frontend**: Nuevo directorio `resources/js/components/naturalquery/` con 6 componentes React, modificaciones en `AppLayout.tsx` y `Topbar.tsx`
- **Dependencias**: Ninguna nueva; Laravel HTTP Client ya incluido; `react-markdown` para renderizar interpretación enriquecida
- **Infraestructura**: Requiere que NaturalQuery esté corriendo como proceso separado (`bunx naturalquery start` en `localhost:4000`)
- **Variables de entorno**: Ya configuradas (`NATURAL_QUERY_URL`, `NATURAL_QUERY_DB_*`, `NATURAL_QUERY_GROQ_KEY`)
