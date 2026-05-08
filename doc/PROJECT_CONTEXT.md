# Contexto del Proyecto: Sistema de Horas Extras Rosa Betania

## 1. Resumen Ejecutivo
El **Sistema Web para la Gestión y Análisis de Horas Extras en la Imprenta Rosa Betania** es una aplicación desarrollada para optimizar y auditar el flujo de registro, aprobación y análisis del tiempo adicional laborado por el personal de la empresa. Su objetivo principal es resolver ineficiencias de control manual (hojas de cálculo y papeletas), reduciendo los errores de pago, brindando trazabilidad para auditorías, y facilitando el cálculo de productividad y asignación de costos laborales.

---

## 2. Modelo de Negocio Mejorado (Product Owner Perspective)
Originalmente, el modelo era un flujo básico Empleado -> Administrador. Para dotar de mayor valor, escalabilidad y alineación a mejores prácticas del sector, el modelo de negocio comprende:

### 2.1 Actores del Sistema
- **Empleado**: Registra sus solicitudes de horas extras, visualiza su historial (Auditoría propia) y recibe notificaciones del estado de sus horas.
- **Supervisor (Jefe de Turno / Área)**: Tiene autoridad para *Pre-Aprobar* o *Rechazar* las horas generadas en su respectivo turno o departamento, agregando una capa de validación operativa.
- **Administrador (RRHH / Gerencia)**: Autoriza el pago definitivo de las horas pre-aprobadas, configura reglas de validación (límites) y exporta métricas globales para planillas y auditorías.

### 2.2 Flujo de Ciclo de Vida de una Hora Extra (Estados)
1. **Pendiente**: Solicitud recién creada por el empleado.
2. **Pre-Aprobada**: (Opcional, en flujos multinivel) El supervisor de área valida operativamente que la hora fue trabajada y necesaria.
3. **Aprobada**: El administrador (RRHH) consolida y aprueba la solicitud para el cierre de planilla.
4. **Rechazada**: La hora no es válida; requiere un comentario obligatorio (Feedback para el empleado).

### 2.3 Reglas de Negocio Clave
- **Control Legal**: Alertas automáticas para administradores si un empleado sobrepasa los límites legales semanales permitidos de horas extras.
- **Centro de Costos**: Cada registro de horas extras se asigna opcionalmente a un departamento (Ej. "Impresión Offset") o una "Orden de Producción". Esto cruza los datos con la rentabilidad operativa de la imprenta.
- **Trazabilidad Continua**: El sistema bloquea modificaciones en cascada una vez aprobado un nivel; cualquier alteración de horas por parte del administrador deja registro (audit trail).

---

## 3. Arquitectura del Sistema
El proyecto está implementado bajo una arquitectura clásica de **Cliente-Servidor monorrepositorio**, aplicando el patrón de diseño de software **Modelo-Vista-Controlador (MVC)** que proporciona el framework Laravel.

- **Modelo**: Interacción con la base de datos a través de *Eloquent ORM*, protegiendo contra inyecciones SQL y gestionando las relaciones entre Empleados y Registros.
- **Controlador**: Gestiona la lógica y flujo de datos; se encuentra protegido por middleware de autenticación y de autorización (roles) integrados nativamente.
- **Vista**: Páginas renderizadas desde el backend con componentes *Blade*, pero enriquecidas dinámicamente con utilidades reactivas y modernas en el frontend.

---

## 4. Stack Tecnológico y Dependencias
El proyecto emplea herramientas orientadas a un desarrollo ágil y mantenimiento simplificado, maximizando el uso de estándares abiertos.

**Backend (Lógica & Servidor):**
- **PHP ^8.3**
- **Laravel Framework ^11.x** (Manejo de rutas, ORM, Autenticación, Middleware).
- *Laravel Breeze*: Starter Kit para scaffolding de autenticación.

**Base de Datos:**
- **MySQL**: Bases de datos relacional para integridad referencial.

**Frontend (Interfaz de Usuario):**
- **Vite** (Module Bundler y compilador de assets).
- **TailwindCSS ^3.1.0 / ^4.0.0 (plugin Vite)**: Para estilización de utilidades orientada a diseño moderno e interfaces responsivas.
- **Alpine.js ^3.4.2**: Para comportamientos interactivos ligeros (modales, dropdowns) sin requerir un marco SPA pesado como React/Vue.
- **Lightweight Charts ^5.2.0**: Para renderizar gráficos financieros o de series de tiempo de alto rendimiento (utilizado en el análisis de dashboards).

---

## 5. Estructura de Entidades (Base de Datos)
Para un Agente IA, esta es la forma principal en que la data se relaciona (según convenciones Laravel):

* `users`: Tabla principal que aloja a los Empleados, Supervisores y Administradores. Requiere un campo `role` o la implementación de un paquete como Spatie Roles/Permissions.
* `overtime_requests` (o similar): Tabla transaccional. Guarda el `user_id` asociado, `start_time`, `end_time`, `total_hours`, `reason`, `status` (pending, approved, rejected, pre-approved), `cost_center_id` (opcional), `approved_by` (user_id del administrador).
* `departments` (opcional / extensión): Tabla de centros de costo para asignaciones.

---

## 6. Instrucciones de Contexto para el Agente IA
Si vas a realizar modificaciones al código en el futuro, ten en cuenta las siguientes directrices establecidas para este repositorio:

1. **Enrutamiento y Seguridad**: Las rutas que modifiquen o agreguen información (POST/PUT/DELETE) en relación a las Horas Extras deben envolverse obligatoriamente en middleware que valide los roles (`auth` + comprobación de rol de Admin o Supervisor).
2. **Consultas a Base de Datos**: Evita en lo absoluto SQL crudo (raw). Utiliza siempre *Eloquent ORM* para aprovechar scopes, mutators y eventos del modelo.
3. **Manejo del Frontend**: No modifiques archivos CSS de forma independiente. Toda modificación de estilo debe hacerse directamente sobre las vistas Blade en `resources/views/` usando las clases utilitarias de TailwindCSS. Si usas JavaScript, dale prioridad al comportamiento declarativo de Alpine.js en los atributos de los elementos HTML en vez de escribir un archivo Vanilla JS separado, a menos que se trate del gráfico de Lightweight Charts.
4. **Exportaciones**: Las descargas de CSV deben despacharse mediante *streams* de Laravel para optimizar el consumo de memoria del servidor si se descargan miles de registros. 
5. **Estética General**: A requerimiento estricto, la aplicación web debe verse extremadamente "premium", moderna e interactiva, con diseño tipo glassmorphism o transiciones suaves donde aplique, utilizando TailwindCSS y fuentes tipográficas modernas.
