# Spec: Frontend SPA Authentication

## Identificador
`frontend-spa-auth`

## Propósito
Define el comportamiento de autenticación del usuario en el frontend React SPA, incluyendo login, registro, logout, recuperación de contraseña y verificación de email.

---

## Vistas de Auth

### Login (`/login`)
- Email input con validación de formato
- Password input con toggle show/hide
- "Recordarme" checkbox (opcional, 2 semanas)
- Botón "Iniciar Sesión" con loading state
- Link a "Olvidaste tu contraseña?"
- Error messages inline bajo cada campo
- Redirect a `/dashboard` tras login exitoso

### Registro (`/register`)
- Name input
- Email input con validación uniqueness (API)
- Password input + confirm password
- Términos y condiciones checkbox (requerido)
- Botón "Crear Cuenta" con loading state
- Link a "Ya tienes cuenta?"

### Logout
- POST a `/logout` vía Inertia
- Redirect a `/login` con sesión invalidada

### Forgot Password (`/forgot-password`)
- Email input
- Botón "Enviar enlace de recuperación"
- Mensaje de éxito si el email existe (no revelar si existe o no por seguridad)

### Reset Password (`/reset-password`)
- Token desde URL
- Email input (readonly, pre-poblado)
- Password + confirm password
- Botón "Restablecer contraseña"

### Email Verification (`/email/verify`)
- Mensaje "Revisa tu email" con link re-enviar
- Botón "Reenviar verificación"

### Confirm Password (`/user/confirm-password`)
- Password input para acciones sensibles
- Botón "Confirmar"

---

## Validaciones Client-side

| Campo | Regla |
|---|---|
| Email | Formato válido, max 255 caracteres |
| Password | Min 8 caracteres, 1 mayúscula, 1 número |
| Name | Min 2 caracteres, max 255 |

---

## Estados de Error

- Credenciales inválidas: "Las credenciales no coinciden nuestros registros"
- Rate limiting: "Demasiados intentos. Espera X minutos"
- Validación: Mensajes inline específicos por campo

---

## Casos Borde

- Usuario ya autenticado accede a `/login`: Redirect a `/dashboard`
- Token de reset expirado: Mensaje de error + link a forgot-password
- Email no verificado accede a rutas protegidas: Redirect a `/email/verify`
