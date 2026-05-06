# Sistema de Pruebas Automatizadas (E2E) con Selenium

El objetivo principal de esta implementación fue instalar la librería oficial `selenium-webdriver` para JavaScript, junto con `mocha` (un ejecutor de pruebas), para poder escribir y ejecutar pruebas End-to-End controlando el navegador de forma directa y simulando el comportamiento de un usuario humano real.

> [!NOTE]
> Se utilizaron las versiones más recientes de Selenium 4, las cuales incluyen "Selenium Manager". Esto permite que el sistema descargue e inyecte automáticamente el `chromedriver` por detrás, sin necesidad de configuraciones manuales complejas.

## Requisitos y Consideraciones

> [!IMPORTANT]
> 1. **URL Local de Servidor:** Las pruebas están configuradas para ejecutarse contra el servidor local de Artisan. Es indispensable tener `php artisan serve` corriendo en una terminal antes de ejecutar la prueba.
> 2. **Usuarios de Prueba:** Las pruebas requieren que existan en la base de datos local un empleado (`carlos@rosabetania.com`) y un administrador (`admin@rosabetania.com`) con contraseñas válidas, de lo contrario las pruebas fallarán por "Timeout" al no poder avanzar.

## Arquitectura de Archivos Integrados

A continuación se detallan los archivos creados o modificados en el proyecto para integrar este ecosistema.

### 1. Entorno y Dependencias

#### [MODIFY] `package.json`
Se ejecutó la instalación de paquetes a través de NPM (`npm install --save-dev selenium-webdriver mocha`). Además, se agregó un script personalizado para ejecutar la suite de manera ágil:
```json
"scripts": {
  ...
  "test:e2e": "mocha test/e2e/**/*.spec.js --timeout 45000"
}
```

### 2. Estructura de Pruebas

Se creó una carpeta `test/e2e/` en la raíz de tu proyecto para mantener los scripts automatizados organizados y separados del código fuente de Laravel.

#### [NEW] `test/e2e/login.spec.js`
Se creó el script de prueba central utilizando Selenium WebDriver puro. Este script no realiza pruebas aisladas, sino que ejecuta una secuencia **End-to-End** ininterrumpida que valida el ciclo de vida completo del negocio en una sola ventana de Chrome.

## Flujo de Pruebas Implementadas

A continuación se enumeran y detallan las 5 pruebas críticas que ejecuta el robot de forma consecutiva:

### 1. Autenticación de Empleado
- **Objetivo:** Verificar que el sistema de login permite el acceso al personal operativo.
- **Acciones:** Navega a la ruta `/login`, rellena los campos de formulario (`email` y `password` de `carlos@rosabetania.com`) e intercepta el botón de acceso.
- **Validación:** Confirma la redirección segura hacia el `/dashboard`.

### 2. Registro de Solicitud de Horas Extras
- **Objetivo:** Validar que el motor de creación de solicitudes de tiempo extra funcione correctamente.
- **Acciones:**
  - Navega hacia `/horas-extras/create`.
  - Manipula el DOM para abrir el `<select>` y elegir el primer turno de trabajo disponible.
  - Limpia e ingresa un valor numérico (`2.5`) en la cantidad de horas.
  - Rellena el motivo o justificación.
  - Ejecuta una inyección de JavaScript para forzar el clic en "Enviar Solicitud", evadiendo posibles solapamientos visuales (overlays).
- **Validación:** Espera hasta que el servidor guarde la información en la base de datos y redirija exitosamente al historial.

### 3. Cierre de Sesión Seguro (Logout)
- **Objetivo:** Garantizar que las sesiones puedan destruirse limpiamente sin cruce de datos.
- **Acciones:** Localiza dinámicamente la barra lateral inferior (`sidebar-footer`) y presiona el botón "Cerrar Sesión".
- **Validación:** Verifica la salida total del sistema y el retorno a la pantalla de bienvenida.

### 4. Autenticación de Administrador
- **Objetivo:** Comprobar el ingreso a perfiles con privilegios gerenciales.
- **Acciones:** Utiliza los mismos campos de la Prueba 1 pero con las credenciales de `admin@rosabetania.com`.
- **Validación:** Confirma la visualización del panel administrativo.

### 5. Procesamiento y Aprobación Gerencial
- **Objetivo:** Asegurar que los líderes puedan interactuar con y procesar solicitudes ajenas.
- **Acciones:**
  - Se dirige a la bandeja general de `/horas-extras`.
  - **Filtro Inteligente (XPath):** El robot escanea la tabla y hace clic en "Detalles" *única y exclusivamente* en la primera fila que contenga el estado **"Pendiente"** (ignorando las ya aprobadas o rechazadas).
  - Interactúa con el formulario de procesamiento, presiona "Procesar Solicitud" (que envía el estado "Aprobado" por defecto).
- **Validación:** Comprueba el retorno exitoso a la lista general y pausa la pantalla para que el humano valide visualmente el mensaje verde de confirmación de Laravel.

## Plan de Ejecución (Verification Plan)

### Automated Tests
Para ejecutar toda la infraestructura descrita anteriormente, abre tu terminal (asegurándote de que `php artisan serve` ya esté activo en otra pestaña) y ejecuta:

`npm run test:e2e`

### Manual Verification
1. Verificaremos visualmente que el script abra una ventana de Chrome indicando que está "Controlada por software automatizado".
2. Verificaremos que el robot reaccione ante posibles validaciones de Laravel. Si algo falla (ej. contraseña incorrecta), la prueba se detendrá y Mocha reportará en la consola de tu terminal la URL exacta donde se quedó atascado y los posibles errores rojos que hayan aparecido en pantalla.
