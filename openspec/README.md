# OpenSpec — Horas Extras Rosa Betania

Sistema de desarrollo guiado por especificaciones para el proyecto **Horas Extras Rosa Betania**.
Permite que el equipo y los agentes de IA trabajen sobre cambios bien definidos antes de tocar código.

---

## ¿Qué es OpenSpec?

OpenSpec establece un flujo de trabajo donde cada cambio al sistema pasa por cuatro artefactos antes de implementarse:

```
Propuesta (qué y por qué)
    ↓
Especificación (contrato de comportamiento)
    ↓
Diseño (decisiones técnicas)
    ↓
Tareas (instrucciones accionables para el desarrollador)
```

---

## Estructura de Carpetas

```
openspec/
├── config.yaml          # Configuración global: esquema, contexto, reglas
├── README.md            # Este archivo
├── specs/               # Especificaciones base del sistema (comportamiento establecido)
│   ├── registro-horas-extras.md
│   ├── centros-de-costo.md
│   └── roles-y-permisos.md
└── changes/             # Cambios activos e histórico
    └── archive/         # Cambios completados y archivados
```

---

## Flujo de Trabajo con el Agente IA

### 1. Proponer un cambio
Describe en lenguaje natural lo que quieres construir:

```
/opsx-propose
```
El agente creará automáticamente la propuesta, el diseño y las tareas listas para implementar.

### 2. Implementar
```
/opsx-apply
```
El agente lee todos los artefactos y ejecuta las tareas una por una, actualizando el progreso.

### 3. Explorar / Pensar en voz alta
```
/opsx-explore
```
Para investigar un problema, aclarar requisitos o pensar en alternativas antes de proponer.

### 4. Archivar cuando termine
```
/opsx-archive
```
Mueve el cambio completado al historial y actualiza las specs base si corresponde.

---

## Comandos CLI Útiles

```bash
# Ver estado de todos los cambios activos
openspec list

# Ver estado detallado de un cambio específico
openspec status --change <nombre-del-cambio>

# Ver especificaciones base registradas
openspec list --specs

# Crear un nuevo cambio manualmente
openspec new change <nombre-en-kebab-case>

# Ver el dashboard interactivo
openspec view
```

---

## Convenciones del Proyecto

- **Idioma**: Todos los artefactos se escriben en **español**.
- **Nombres de cambios**: `kebab-case` (ej. `agregar-limite-horas-semanales`).
- **Specs base**: Se actualizan solo al archivar un cambio que modifique comportamiento establecido.
- **Contexto del proyecto**: Ver [`doc/PROJECT_CONTEXT.md`](../doc/PROJECT_CONTEXT.md) para el detalle completo del stack, entidades y convenciones de código.

---

## Documentación de Contexto para el Agente

El archivo [`doc/PROJECT_CONTEXT.md`](../doc/PROJECT_CONTEXT.md) contiene:
- Resumen ejecutivo del sistema
- Modelo de negocio y roles
- Flujo de ciclo de vida de estados
- Stack tecnológico completo
- Estructura de entidades (base de datos)
- Instrucciones de contexto para el agente IA

El agente lo lee automáticamente al generar cualquier artefacto (configurado en `config.yaml` bajo `docs`).
