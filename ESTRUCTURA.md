# Estructura del Proyecto - Caja Menor

## Organización General

Este proyecto está organizado de manera modular para facilitar el mantenimiento, escalabilidad y comprensión del código.

```
frontend/
├── static/
│   ├── css/                    # Estilos CSS
│   │   ├── variables.css       # Variables y tokens de diseño
│   │   ├── reset.css           # Reset CSS y estilos base
│   │   ├── components.css      # Componentes globales reutilizables
│   │   └── views/              # Estilos específicos por vista
│   │       ├── panel-solicitudes.css
│   │       └── enlace-solicitudes.css
│   │
│   ├── js/                     # JavaScript modular
│   │   ├── utils/              # Utilidades y helpers
│   │   │   ├── config.js       # Configuración y constantes
│   │   │   ├── helpers.js      # Funciones auxiliares
│   │   │   └── storage.js      # Gestión de localStorage
│   │   │
│   │   ├── modules/            # Módulos de componentes UI
│   │   │   ├── modales.js      # Gestión de modales
│   │   │   ├── progress-tracker.js  # Componente de progreso
│   │   │   └── solicitud-card.js    # Tarjetas de solicitud
│   │   │
│   │   └── views/              # Lógica específica por vista
│   │       ├── panel-solicitudes.js
│   │       └── enlace-solicitudes.js
│   │
│   └── img/                    # Imágenes y assets
│
└── templates/                  # Archivos HTML
    ├── panel_solicitudes.html  # Vista del solicitante
    └── enlace_solicitudes.html # Vista del aprobador

```

---

## Descripción de Archivos

### CSS

#### **variables.css**
- **Propósito**: Define todas las variables CSS globales
- **Contenido**: 
  - Colores (primarios, secundarios, estados)
  - Sombras y efectos
  - Radios de borde
  - Espaciados
  - Transiciones
  - Z-index
- **Uso**: Se carga primero para que esté disponible en todos los demás archivos

#### **reset.css**
- **Propósito**: Reset CSS básico y estilos base
- **Contenido**:
  - Reset de márgenes, padding, box-sizing
  - Estilos del body
  - Reset de listas, enlaces, botones, inputs

#### **components.css**
- **Propósito**: Componentes UI reutilizables en toda la aplicación
- **Contenido**:
  - Header y navegación
  - Botones (primary, secondary, danger, FAB)
  - Badges de estado
  - Modales y overlays
  - Formularios (inputs, textareas, labels)
  - Alertas
- **Uso**: Estilos que se usan en múltiples vistas

#### **views/panel-solicitudes.css**
- **Propósito**: Estilos específicos para la vista del solicitante
- **Contenido**:
  - Stats cards (5 columnas)
  - Filtros específicos
  - Tarjetas de solicitud
  - Progress tracker
  - Responsive breakpoints específicos
- **Nota**: Solo se carga en panel_solicitudes.html

#### **views/enlace-solicitudes.css**
- **Propósito**: Estilos específicos para la vista del aprobador
- **Contenido**:
  - Stats cards (4 columnas)
  - Filtros con datalist
  - Tarjetas con estilo clickeable
  - Acciones de aprobación
  - Responsive breakpoints específicos
- **Nota**: Solo se carga en enlace_solicitudes.html

---

### JavaScript

#### **utils/config.js**
- **Propósito**: Configuración global y constantes
- **Exports**:
  - `APP_CONFIG`: Configuración de la app
  - `ESTADOS`: Constantes de estados de solicitud
  - `CLASES_ESTADO`: Mapeo estado → clase CSS
  - `ICONOS`: Biblioteca de iconos SVG
  - `STEPS_PROGRESO`: Definición de pasos del tracker
- **Uso**: Se importa en todas las vistas que necesiten constantes

#### **utils/helpers.js**
- **Propósito**: Funciones auxiliares reutilizables
- **Funciones principales**:
  - `formatearMonto()`: Formatea números como moneda
  - `generarId()`: Genera IDs únicos
  - `obtenerFechaActual()`: Fecha en formato dd/mm/yyyy
  - `obtenerClaseEstado()`: Obtiene clase CSS por estado
  - `obtenerIconoEstado()`: Obtiene icono SVG por estado
  - `esMontoValido()`: Valida montos
  - `escaparHTML()`: Prevención de XSS
  - `compararFechas()`: Comparación de fechas
  - `debounce()`: Optimización de búsquedas

#### **utils/storage.js**
- **Propósito**: Gestión de persistencia en localStorage
- **Funciones principales**:
  - `guardarEnLocalStorage()`: Guarda solicitudes
  - `cargarDeLocalStorage()`: Carga solicitudes
  - `limpiarLocalStorage()`: Elimina datos
  - `exportarSolicitudes()`: Exporta como JSON
  - `importarSolicitudes()`: Importa desde JSON

#### **modules/modales.js**
- **Propósito**: Gestión de modales y overlays
- **Funciones principales**:
  - `abrirModal(id)`: Abre modal por ID
  - `cerrarModal(id)`: Cierra modal por ID
  - `cerrarTodosLosModales()`: Cierra todos
  - `inicializarEventosModales()`: Config eventos (click fuera, ESC)

#### **modules/progress-tracker.js**
- **Propósito**: Componente visual de progreso de solicitud
- **Funciones principales**:
  - `crearProgressTracker(estado)`: Genera HTML del tracker
  - `obtenerIndiceEstado(estado)`: Calcula paso actual
- **Renderiza**: 5 pasos con iconos y estados (completed, active, pending)

#### **modules/solicitud-card.js**
- **Propósito**: Genera tarjetas de solicitud
- **Funciones principales**:
  - `crearTarjetaSolicitud()`: Tarjeta para solicitante
  - `crearTarjetaSolicitudEnlace()`: Tarjeta para aprobador
  - `crearEstadoVacio()`: Mensaje cuando no hay datos
- **Incluye**: Iconos, detalles, progress tracker, acciones

#### **views/panel-solicitudes.js**
- **Propósito**: Lógica de la vista del solicitante
- **Responsabilidades**:
  - Inicialización de la vista
  - Renderizado de solicitudes
  - Actualización de estadísticas
  - Configuración de filtros
  - Creación de nuevas solicitudes
  - Visualización de detalles
- **Variables globales**: `solicitudesData`

#### **views/enlace-solicitudes.js**
- **Propósito**: Lógica de la vista del aprobador
- **Responsabilidades**:
  - Inicialización de la vista
  - Renderizado de solicitudes para aprobación
  - Actualización de estadísticas
  - Configuración de filtros con datalist
  - Aprobación/rechazo de solicitudes
  - Visualización de detalles para aprobar
- **Variables globales**: `solicitudesData`, `solicitudActualId`

---

## Flujo de Carga

### Panel Solicitudes (Solicitante)
```
1. variables.css      → Define tokens de diseño
2. reset.css          → Reset básico
3. components.css     → Componentes globales
4. panel-solicitudes.css → Estilos específicos

5. config.js          → Constantes y configuración
6. helpers.js         → Funciones auxiliares
7. storage.js         → Gestión de datos
8. modales.js         → Sistema de modales
9. progress-tracker.js → Componente de progreso
10. solicitud-card.js  → Generador de tarjetas
11. panel-solicitudes.js → Lógica de la vista
```

### Enlace Solicitudes (Aprobador)
```
1. variables.css      → Define tokens de diseño
2. reset.css          → Reset básico
3. components.css     → Componentes globales
4. enlace-solicitudes.css → Estilos específicos

5. config.js          → Constantes y configuración
6. helpers.js         → Funciones auxiliares
7. storage.js         → Gestión de datos
8. modales.js         → Sistema de modales
9. progress-tracker.js → Componente de progreso
10. solicitud-card.js  → Generador de tarjetas
11. enlace-solicitudes.js → Lógica de la vista
```

---

## 🛠️ Cómo Modificar

### Para cambiar colores o estilos globales:
📝 Edita: `frontend/static/css/variables.css`

### Para modificar componentes comunes (botones, modales, etc):
📝 Edita: `frontend/static/css/components.css`

### Para ajustar estilos del panel de solicitante:
📝 Edita: `frontend/static/css/views/panel-solicitudes.css`

### Para ajustar estilos del panel de aprobador:
📝 Edita: `frontend/static/css/views/enlace-solicitudes.css`

### Para cambiar constantes (estados, iconos, etc):
📝 Edita: `frontend/static/js/utils/config.js`

### Para agregar/modificar funciones auxiliares:
📝 Edita: `frontend/static/js/utils/helpers.js`

### Para cambiar cómo se guardan los datos:
📝 Edita: `frontend/static/js/utils/storage.js`

### Para modificar lógica de panel solicitante:
📝 Edita: `frontend/static/js/views/panel-solicitudes.js`

### Para modificar lógica de panel aprobador:
📝 Edita: `frontend/static/js/views/enlace-solicitudes.js`

---

## Ventajas de esta Estructura

 **Modularidad**: Cada archivo tiene una responsabilidad clara
 **Mantenibilidad**: Fácil encontrar y modificar código específico
 **Reutilización**: Componentes y utilidades compartidas
 **Escalabilidad**: Fácil agregar nuevas vistas o módulos
 **Performance**: Solo carga los estilos/scripts necesarios por vista
 **Claridad**: Nombres descriptivos y organización lógica
 **Documentación**: Cada archivo tiene comentarios explicativos

---

## 📚 Convenciones de Código

### CSS
- Variables con prefijo `--` (ej: `--color-primary`)
- Clases en kebab-case (ej: `.solicitud-card`)
- BEM para componentes complejos (ej: `.card__header--active`)

### JavaScript
- Funciones en camelCase (ej: `formatearMonto()`)
- Constantes en UPPER_SNAKE_CASE (ej: `ESTADOS.PENDIENTE`)
- Comentarios JSDoc para funciones públicas
- Uso de `const` y `let`, nunca `var`

### HTML
- Atributos en kebab-case (ej: `data-solicitud-id`)
- IDs en camelCase (ej: `modalDetalleSolicitud`)
- Clases descriptivas y semánticas

---

## 🔧 Próximas Mejoras Sugeridas

1. **Módulos ES6**: Convertir a módulos con `import/export`
2. **Build System**: Agregar webpack/vite para bundling
3. **TypeScript**: Agregar tipado estático
4. **Testing**: Agregar tests unitarios
5. **Backend**: Conectar con API REST
6. **Estado Global**: Implementar state management (Redux, Zustand)

---

**Fecha de organización**: 4 de diciembre de 2025
**Versión**: 1.0.0
