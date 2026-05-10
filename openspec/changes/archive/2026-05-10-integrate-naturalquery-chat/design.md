## Context

El proyecto Horas Extras Rosa Betania ya migró exitosamente de Blade+Alpine.js a React 19 + Inertia.js 2.0. El `.env` contiene desde la migración las variables para NaturalQuery (`NATURAL_QUERY_URL`, `NATURAL_QUERY_GROQ_KEY`, etc.) pero el servicio nunca se implementó — fue listado explícitamente como "No Goal" en el diseño de migración para hacerse posteriormente.

NaturalQuery es un servicio HTTP local (corre con `bunx naturalquery start` en `localhost:4000`) que traduce preguntas en lenguaje natural a SQL usando LLMs (Groq, Gemini) y retorna resultados estructurados con metadata de renderizado. NaturalQuery es stateless — el consumidor es responsable de mantener el array `history`.

Actualmente los usuarios solo pueden explorar datos mediante los reportes predefinidos y dashboards. No existe forma de hacer consultas ad-hoc.

## Goals / Non-Goals

**Goals:**
- Permitir a usuarios con rol `admin` hacer preguntas en lenguaje natural sobre los datos
- Integrar el panel de chat como slide-over desde la derecha, accesible desde cualquier página
- Renderizar respuestas según el `render.type` de NaturalQuery (metric, list, table, message)
- Mostrar metadatos: confianza, SQL generado, interpretación enriquecida, aviso de truncado
- Soportar conversaciones multi-turno mediante el array `history`
- Mantener las credenciales de base de datos exclusivamente en el backend

**Non-Goals:**
- No se expone NaturalQuery a internet (solo localhost)
- No se modifica el esquema de base de datos
- No se crean nuevos roles o permisos — el chat está restringido al rol `admin`
- No se implementa streaming de respuestas (la API de NaturalQuery no lo soporta actualmente)
- No se persiste el historial de chat en base de datos (solo en memoria del frontend durante la sesión)

## Decisions

### 1. Arquitectura: proxy backend

**Decisión**: Las consultas pasan por un controlador Laravel que actúa como proxy hacia NaturalQuery.

**Alternativa considerada**: Llamar a NaturalQuery directamente desde el frontend React.
**Rechazada porque**: Expondría las credenciales de base de datos y la API key de Groq en el navegador.

**Implementación**: `React → fetch POST /naturalquery/query → NaturalQueryController → NaturalQueryService → HTTP localhost:4000`

### 2. Gestión de sesión NaturalQuery: almacenada en sesión PHP

**Decisión**: El `sessionId` de NaturalQuery se almacena en la sesión de Laravel (`$request->session()`). Al abrir el chat por primera vez, el frontend llama a `POST /naturalquery/session` que crea la sesión en NaturalQuery y la persiste.

**Alternativa considerada**: Guardar `sessionId` en localStorage del navegador.
**Rechazada porque**: Diferentes pestañas/ventanas crearían sesiones duplicadas; la sesión PHP es más simple y segura.

### 3. Mecanismo HTTP: fetch API del navegador, no Inertia visits

**Decisión**: El chat usa `fetch()` nativo para enviar preguntas y recibir respuestas, sin navegación Inertia.

**Alternativa considerada**: Usar `useForm` de Inertia o `router.post()`.
**Rechazada porque**: Las visitas Inertia están diseñadas para navegación de página completa; el chat necesita actualizaciones parciales sin recargar la página ni cambiar la URL.

### 4. Renderizado de Markdown: react-markdown (nueva dependencia npm)

**Decisión**: Agregar `react-markdown` para renderizar `interpretation.content` cuando `interpret: "rich"`.

**Alternativa considerada**: Renderizar como texto plano o usar `dangerouslySetInnerHTML`.
**Rechazada porque**: Peligro de XSS con innerHTML; texto plano pierde el formato enriquecido. react-markdown es seguro (no permite HTML arbitrario) y ligero (~50KB).

### 5. Estado del chat: React state en AppLayout

**Decisión**: El estado de apertura/cierre del chat y el historial de mensajes se manejan con `useState` en `AppLayout.tsx`, pasándose como props a `Topbar` y `ChatPanel`.

**Alternativa considerada**: React Context o Zustand.
**Rechazada porque**: Solo 2 componentes necesitan el estado (Topbar para el botón, ChatPanel para el contenido). Context añadiría complejidad innecesaria para este caso.

### 6. Colores y diseño: Tailwind con tokens existentes

**Decisión**: Usar exclusivamente los tokens de color del proyecto (`wise-*`) y clases utilitarias Tailwind ya configuradas.

## Risks / Trade-offs

- **[Latencia 1-5s por consulta]** → Mostrar skeleton/loader animado mientras se espera la respuesta de NaturalQuery
- **[NaturalQuery debe estar corriendo]** → Si el servicio no está disponible, el endpoint retorna 503 y el frontend muestra mensaje de error amigable. Documentar en README el requisito de `bunx naturalquery start`
- **[Rate limit: 20 req/min por sesión]** → Mostrar contador visual si se acerca al límite; si se excede, mostrar `retryAfter` con cuenta regresiva
- **[Credenciales sensibles en `.env`]** → Ya están en `.env` desde la migración. Asegurar que `.env.example` no contenga valores reales
- **[NaturalQuery sin autenticación]** → Solo escucha en `localhost:4000`. No exponer el puerto en firewall/producción. El proxy backend añade la capa de auth de Laravel

## Open Questions

- ¿Debería limitarse el chat a ciertos roles (solo admin)? Por ahora la propuesta lo deja abierto a todos los roles.
- ¿Persistir historial de chat en base de datos en el futuro? Podría ser útil para auditoría, pero queda fuera de este cambio.
