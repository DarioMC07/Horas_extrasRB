## ADDED Requirements

### Requirement: Apertura del panel de chat (solo admin)
El sistema DEBE mostrar un botón en la barra superior (Topbar) únicamente para usuarios con rol `admin`. Al hacer clic, despliega un panel de chat desde el lado derecho de la pantalla, superpuesto sobre el contenido principal.

#### Scenario: Admin abre el chat
- **WHEN** un usuario con rol `admin` hace clic en el botón de chat en la Topbar
- **THEN** el panel de chat se desliza desde la derecha ocupando aproximadamente 420px de ancho
- **THEN** el contenido principal se ajusta sin desplazarse (el panel es overlay, no push)

#### Scenario: Admin cierra el chat
- **WHEN** el panel de chat está abierto y el admin hace clic en el botón de cerrar (X) o en el mismo botón de la Topbar
- **THEN** el panel se desliza hacia la derecha y desaparece
- **THEN** el contenido principal recupera su ancho completo

#### Scenario: Usuario no autenticado no ve el botón
- **WHEN** un usuario no está autenticado
- **THEN** el botón de chat NO se muestra en la interfaz

#### Scenario: Usuario con rol empleado o supervisor no ve el botón
- **WHEN** un usuario autenticado tiene rol `empleado` o `supervisor`
- **THEN** el botón de chat NO se muestra en la interfaz

### Requirement: Inicialización de sesión NaturalQuery
El sistema DEBE crear una sesión en NaturalQuery la primera vez que el usuario abre el chat, y reutilizarla durante toda su sesión de navegación.

#### Scenario: Primera apertura del chat
- **WHEN** un usuario abre el panel de chat por primera vez en su sesión
- **THEN** el sistema llama a `POST /naturalquery/session` que registra una sesión en NaturalQuery con las credenciales de base de datos configuradas
- **THEN** el `sessionId` retornado se almacena en la sesión PHP del usuario
- **THEN** el panel de chat muestra el campo de entrada listo para recibir preguntas

#### Scenario: Aperturas subsecuentes del chat
- **WHEN** un usuario abre el chat y ya tiene un `sessionId` en su sesión PHP
- **THEN** el sistema reutiliza el `sessionId` existente sin crear una nueva sesión en NaturalQuery

#### Scenario: Error al crear sesión
- **WHEN** el llamado a `POST /naturalquery/session` falla (NaturalQuery no disponible)
- **THEN** el sistema muestra un mensaje de error: "El servicio de consultas no está disponible en este momento. Intentalo más tarde."
- **THEN** el campo de entrada de chat se deshabilita

### Requirement: Acceso restringido por rol
El sistema DEBE proteger las rutas de NaturalQuery para que solo usuarios con rol `admin` puedan acceder a ellas, tanto a nivel de frontend (botón oculto) como de backend (middleware).

#### Scenario: Admin accede a las rutas de consulta
- **WHEN** un usuario con rol `admin` envía una solicitud a `POST /naturalquery/query` o `POST /naturalquery/session`
- **THEN** el sistema procesa la solicitud normalmente

#### Scenario: No-admin recibe error 403 en las rutas
- **WHEN** un usuario con rol `empleado` o `supervisor` intenta acceder directamente a `POST /naturalquery/query` o `POST /naturalquery/session`
- **THEN** el sistema retorna HTTP 403 sin procesar la solicitud

### Requirement: Envío de preguntas en lenguaje natural
El sistema DEBE permitir al usuario escribir preguntas en lenguaje natural y enviarlas para obtener respuestas basadas en los datos de la base de datos.

#### Scenario: Usuario envía una pregunta válida
- **WHEN** el usuario escribe una pregunta en el campo de texto y presiona Enter o hace clic en enviar
- **THEN** el sistema envía `POST /naturalquery/query` con la pregunta, el `sessionId`, el `history` conversacional, y `interpret: "rich"`
- **THEN** se muestra un indicador de carga (skeleton animado) mientras se espera la respuesta
- **THEN** al recibir la respuesta, se muestra el resultado formateado según `render.type`

#### Scenario: Usuario envía campo vacío
- **WHEN** el usuario intenta enviar una pregunta con el campo de texto vacío
- **THEN** el sistema NO envía la solicitud
- **THEN** el botón de enviar permanece deshabilitado

#### Scenario: Preguntas de seguimiento con historial
- **WHEN** el usuario envía una segunda pregunta relacionada con la primera (ej. "¿Y del mes pasado?")
- **THEN** el sistema incluye en `history` el par pregunta-respuesta de los turnos anteriores
- **THEN** NaturalQuery interpreta la pregunta en contexto y retorna la respuesta adecuada

### Requirement: Renderizado de respuestas según tipo
El sistema DEBE renderizar la respuesta de NaturalQuery usando el componente visual adecuado según el campo `render.type`.

#### Scenario: Respuesta tipo métrica (metric)
- **WHEN** `render.type` es `"metric"`
- **THEN** el sistema muestra un componente `MetricCard` con el valor numérico en tamaño grande y prominente, y el `render.label` como texto descriptivo debajo

#### Scenario: Respuesta tipo lista (list)
- **WHEN** `render.type` es `"list"`
- **THEN** el sistema muestra un componente `ListView` con cada item de `render.items` formateado como etiqueta-valor

#### Scenario: Respuesta tipo tabla (table)
- **WHEN** `render.type` es `"table"`
- **THEN** el sistema muestra un componente `DataTable` con las columnas de `render.columns` como encabezados y `render.rows` como filas de datos

#### Scenario: Respuesta tipo mensaje (message)
- **WHEN** `render.type` es `"message"` (intent social, meta, o sin datos)
- **THEN** el sistema muestra un `ChatBubble` con el texto de `render.text` o `answer`

#### Scenario: Interpretación enriquecida (rich)
- **WHEN** la respuesta incluye `interpretation` con `format: "markdown"`
- **THEN** el sistema renderiza `interpretation.content` como Markdown formateado debajo del resultado principal, usando `react-markdown`

### Requirement: Visualización de metadatos de la consulta
El sistema DEBE mostrar información complementaria sobre la consulta generada para transparencia y depuración.

#### Scenario: SQL generado disponible
- **WHEN** la respuesta incluye el campo `sql` no nulo
- **THEN** el sistema muestra un toggle "Ver SQL" que al expandirse revela la consulta SQL generada en un bloque de código con botón para copiar al portapapeles

#### Scenario: Sin SQL generado
- **WHEN** la respuesta tiene `sql: null` (intent social o meta)
- **THEN** el toggle "Ver SQL" NO se muestra

#### Scenario: Indicador de confianza
- **WHEN** la respuesta incluye `confidence` con valor `"high"`, `"medium"` o `"low"`
- **THEN** el sistema muestra un badge con el nivel de confianza:
  - `"high"`: badge verde (sin advertencia)
  - `"medium"`: badge amarillo con texto "Confianza media"
  - `"low"`: badge naranja con texto "Confianza baja — verifica los resultados"

#### Scenario: Resultados truncados
- **WHEN** `truncated` es `true`
- **THEN** el sistema muestra un banner: "Mostrando 500 de {totalRows} resultados. Refiná tu pregunta para ver todos los datos."

### Requirement: Manejo de errores
El sistema DEBE manejar los errores de NaturalQuery de forma graceful, informando al usuario sin romper la experiencia.

#### Scenario: Sesión inválida o expirada
- **WHEN** NaturalQuery retorna HTTP 404 con código `INVALID_SESSION`
- **THEN** el sistema renueva la sesión automáticamente llamando a `POST /naturalquery/session` y reintenta la consulta

#### Scenario: SQL inválido generado
- **WHEN** NaturalQuery retorna HTTP 422 con código `INVALID_SQL`
- **THEN** el sistema muestra: "No pude generar una consulta válida para esa pregunta. Intentá reformularla con más detalle."

#### Scenario: Todos los providers LLM fallaron
- **WHEN** NaturalQuery retorna HTTP 503 con código `ALL_PROVIDERS_FAILED`
- **THEN** el sistema muestra: "El servicio de IA no está disponible en este momento. Intentalo de nuevo en unos minutos."

#### Scenario: Rate limit excedido
- **WHEN** NaturalQuery retorna HTTP 429 con código `RATE_LIMIT_EXCEEDED`
- **THEN** el sistema muestra: "Demasiadas consultas. Esperá {retryAfter} segundos antes de intentar de nuevo." con una cuenta regresiva visual

#### Scenario: NaturalQuery no disponible (error de red)
- **WHEN** la conexión a `localhost:4000` falla (connection refused, timeout)
- **THEN** el sistema muestra: "El servicio de consultas no está disponible. Verificá que NaturalQuery esté corriendo en localhost:4000."

### Requirement: Scroll automático y accesibilidad
El sistema DEBE mantener una experiencia de chat fluida y accesible.

#### Scenario: Nuevos mensajes hacen scroll automático
- **WHEN** se recibe una nueva respuesta y se agrega al historial del chat
- **THEN** el contenedor de mensajes hace scroll automático hacia abajo para mostrar el mensaje más reciente

#### Scenario: Campo de entrada accesible por teclado
- **WHEN** el panel de chat está abierto
- **THEN** el foco se coloca automáticamente en el campo de entrada de texto
- **THEN** al presionar Escape con el chat abierto, el panel se cierra
