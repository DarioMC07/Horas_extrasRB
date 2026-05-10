# Spec: Frontend Profile

## Identificador
`frontend-profile`

## Propósito
Define la gestión del perfil del usuario autenticado.

---

## Editar Perfil (`/profile`)

### Formulario
| Campo | Tipo | Validación |
|---|---|---|
| Nombre | Input text | Required |
| Email | Input email | Required, unique |

### Submit
- Botón "Guardar Cambios"
- Success: Toast "Perfil actualizado"
- Error: Inline messages

---

## Cambiar Contraseña

### Formulario
| Campo | Tipo | Validación |
|---|---|---|
| Contraseña actual | Password | Required |
| Nueva contraseña | Password | Required, min 8, 1 mayúscula, 1 número |
| Confirmar contraseña | Password | Required, debe coincidir |

### Submit
- Botón "Actualizar Contraseña"
- Success: Toast + clear fields
- Error: Inline messages

---

## Eliminar Cuenta

### Sección danger zone
- Message: "Esta acción es permanente"
- Botón: "Eliminar mi cuenta"
- Confirm password antes de eliminar

### Confirm Dialog
- Title: "¿Eliminar cuenta?"
- Message: "Tu cuenta y todos tus datos serán eliminados permanentemente."
- Input: Confirmar password
- Botón: "Eliminar Cuenta" (destructive)

---

## Estados de Error

- Email ya existe: "Este email ya está registrado"
- Contraseña incorrecta: "La contraseña actual es incorrecta"
- Contraseñas no coinciden: "Las contraseñas no coinciden"
