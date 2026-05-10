## 1. Backend — Servicio NaturalQuery

- [x] 1.1 Leer variables de entorno `NATURAL_QUERY_*` desde `config/services.php` o directamente en el servicio
- [x] 1.2 Crear `app/Services/NaturalQueryService.php` con métodos:
  - `createSession()` → `POST /sessions` a NaturalQuery, retorna `sessionId`
  - `query(sessionId, question, history, interpret)` → `POST /query`, retorna respuesta completa
  - `getSchema(sessionId)` → `GET /sessions/:id/schema`
  - `deleteSession(sessionId)` → `DELETE /sessions/:id`
  - Manejo de errores HTTP (4xx, 5xx) con try/catch y logging
- [x] 1.3 Configurar timeout de HTTP Client (30s) y retry en caso de fallo de conexión

## 2. Backend — Controlador y rutas

- [x] 2.1 Crear `app/Http/Controllers/NaturalQueryController.php`:
  - `createSession()` → endpoint `POST /naturalquery/session` que inicializa sesión en NaturalQuery y guarda `sessionId` en `$request->session()`
  - `query()` → endpoint `POST /naturalquery/query` que recibe `{ question, history[], interpret }`, obtiene `sessionId` de sesión PHP, llama a `NaturalQueryService::query()`, retorna JSON
- [x] 2.2 Agregar rutas en `routes/web.php` dentro del grupo `auth`:
  - `POST /naturalquery/session` → `NaturalQueryController@createSession`
  - `POST /naturalquery/query` → `NaturalQueryController@query`
- [x] 2.3 Agregar middleware `role:admin` a ambas rutas para restringir acceso solo a administradores
- [x] 2.4 Agregar protección CSRF para las rutas (ya incluida por el middleware web)

## 3. Frontend — Dependencia npm

- [x] 3.1 Instalar `react-markdown` para renderizar `interpretation.content` Markdown
- [x] 3.2 Verificar que compile sin errores de tipos

## 4. Frontend — Componentes de renderizado

- [x] 4.1 Crear `resources/js/components/naturalquery/MetricCard.tsx`
- [x] 4.2 Crear `resources/js/components/naturalquery/ListView.tsx`
- [x] 4.3 Crear `resources/js/components/naturalquery/DataTable.tsx`
- [x] 4.4 Crear `resources/js/components/naturalquery/SqlToggle.tsx`
  - Props: `sql: string | null`
  - Toggle "Ver SQL" que expande/colapsa bloque `<code>` con botón copiar al portapapeles

## 5. Frontend — ChatBubble

- [x] 5.1 Crear `resources/js/components/naturalquery/ChatBubble.tsx`
  - Props: `role: 'user' | 'assistant'`, `content: ReactNode`, `timestamp?: string`
  - Burbuja de chat: alineada a la derecha (user, fondo `wise-mint`) o izquierda (assistant, fondo `wise-surface`)

## 6. Frontend — ChatPanel (panel principal)

- [x] 6.1 Crear `resources/js/components/naturalquery/ChatPanel.tsx`
  - Estado interno: `messages[]`, `input`, `loading`, `error`, `sessionReady`
  - Efecto al montar: llama a `POST /naturalquery/session` si no hay sesión
  - Función `sendQuestion()`: agrega mensaje usuario, llama `POST /naturalquery/query`, agrega respuesta, maneja errores
  - Props: `open: boolean`, `onClose: () => void`
  - Panel `fixed right-0 top-0 h-full w-[420px]` con slide-in/out usando `translate-x` + `transition-transform`
  - Área de scroll para mensajes con `useEffect` que hace scroll al último mensaje
  - Barra inferior con input + botón enviar
  - Tecla Escape cierra el panel, foco automático en input al abrir
- [x] 6.2 Integrar `QueryResult` (componente interno del panel que switchea según `render.type`)
  - Switch: `metric` → `MetricCard`, `list` → `ListView`, `table` → `DataTable`, `message` → texto plano
  - Renderiza `SqlToggle` debajo si `sql` no es null
  - Renderiza `react-markdown` si `interpretation` existe
  - Muestra badge de confianza (`confidence`)
  - Muestra banner de truncado si `truncated: true`

## 7. Frontend — Integración en Layout

- [x] 7.1 Modificar `AppLayout.tsx`:
  - Agregar estado `chatOpen: boolean`
  - Renderizar `<ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />` dentro del div raíz
- [x] 7.2 Modificar `Topbar.tsx`:
  - Agregar prop `onChatToggle?: () => void`
  - Agregar botón con ícono `MessageSquare` (lucide-react) que llame a `onChatToggle`, visible solo si `auth.user.role === 'admin'`, posicionado a la izquierda del dropdown de usuario

## 8. Frontend — Tipos TypeScript

- [x] 8.1 Definir tipos en un nuevo archivo `resources/js/types/naturalquery.ts`:
  - `NaturalQueryRender` — unión discriminada: `{ type: 'metric', value, label } | { type: 'list', items[] } | { type: 'table', columns[], rows[][] } | { type: 'message', text }`
  - `NaturalQueryResponse` — interfaz completa con `answer`, `sql`, `data`, `confidence`, `truncated`, `totalRows`, `intent`, `render`, `interpretation?`, `warnings?`
  - `ChatMessage` — `{ role, question?, answer?, response?: NaturalQueryResponse, timestamp }`

## 9. Verificación

- [x] 9.1 Ejecutar `npm run build` para verificar que TypeScript compila sin errores
- [x] 9.2 Ejecutar `php artisan route:list` para verificar que las rutas existen
- [ ] 9.3 Verificar que el botón de chat aparece en la Topbar para usuarios autenticados
- [ ] 9.4 Verificar que el panel abre/cierra correctamente con animación
- [ ] 9.5 Probar flujo completo con NaturalQuery corriendo: abrir chat, enviar pregunta, ver respuesta renderizada
