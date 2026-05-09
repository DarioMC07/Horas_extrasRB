# Spec: UI Component System (shadcn/ui)

## Identificador
`ui-component-system`

## Propósito
Documenta los componentes base de shadcn/ui usados en el proyecto, su personalización y variantes.

---

## Componentes Utilizados

| Componente | Uso en el proyecto |
|---|---|
| `button` | Todos los botones de acción |
| `input` | Inputs de texto, email, password |
| `label` | Labels de formularios |
| `select` | Selects con opción searchable |
| `dialog` | Modals de creación/edición |
| `table` | Tablas de datos |
| `card` | Cards de KPIs y metricas |
| `badge` | Badges de estado |
| `avatar` | Avatares en sidebar y topbar |
| `separator` | Separadores de sección |
| `dropdown-menu` | Menús dropdown (user menu) |
| `textarea` | Campos de texto largo |
| `scroll-area` | Áreas con scroll custom |
| `tabs` | Tabs en dashboard |
| `skeleton` | Loading states |
| `toast` | Notificaciones |
| `tooltip` | Tooltips en iconos |

---

## Personalización del Tema

### Tailwind Config
```js
colors: {
  // brand colors (wise-*)
  'wise-black': '#0e0f0c',
  'wise-green': '#9fe870',
  'wise-dark-green': '#163300',
  'wise-mint': '#e2f6d5',
  // ... etc
}
```

### Font Family
- Display: Sora (headers, metrics)
- Body: DM Sans (text, UI)

---

## Variantes de Botón

| Variante | Uso |
|---|---|
| `default` (green) | Primary actions |
| `destructive` (red) | Delete, danger zone |
| `outline` | Secondary actions |
| `ghost` | Tertiary, icon-only |
| `link` | Text links |

### Tamaños
- `sm`: h-8, text-sm
- `default`: h-10
- `lg`: h-12, text-base
- `icon`: w-10, h-10

---

## Variantes de Badge

| Variante | Color |
|---|---|
| `default` | Gray |
| `success` / `approved` | Green |
| `warning` / `pending` | Yellow |
| `destructive` / `rejected` | Red |
| `outline` | Border only |
| `secondary` | Blue |

---

## Form Validation

- Error state: red border + mensaje
- Required fields: asterisk (*)
- Helper text: gray, small

---

## Responsive Behavior

- Mobile: Stack inputs vertical
- Desktop: Grid layouts según necesidad
- Tables: Horizontal scroll en mobile
