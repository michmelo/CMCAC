# Sistema CMCAC - Gestión de Comisiones de Auditores

Sistema web para la gestión y cálculo de comisiones mensuales para auditores de CMC AUDITORES Y CONSULTORES.

## 📁 Estructura del Proyecto

```
front bd/
├── index.html              # Página principal
├── README.md              # Este archivo
│
├── css/
│   └── styles.css         # Estilos personalizados
│
├── js/
│   ├── main.js           # JavaScript principal
│   ├── navbar.js         # Componente de navegación
│   ├── procesar.js       # Lógica de procesamiento
│   ├── consultas.js      # Lógica de consultas
│   ├── reportes.js       # Lógica de reportes
│   └── errores.js        # Lógica de gestión de errores
│
└── pages/
    ├── procesar.html     # Procesamiento de comisiones
    ├── consultas.html    # Consultas y calculadora
    ├── reportes.html     # Generación de reportes
    ├── reglas.html       # Reglas de negocio
    └── errores.html      # Log de errores
```

## 🚀 Tecnologías Utilizadas

- **HTML5**: Estructura de las páginas
- **CSS3**: Estilos personalizados
- **Bootstrap 5.3.2**: Framework CSS responsivo
- **Bootstrap Icons**: Iconografía
- **JavaScript (Vanilla)**: Lógica del frontend

## 📋 Características

### 1. **Página de Inicio** (`index.html`)
- Dashboard con estadísticas clave
- Información de la empresa
- Características del sistema

### 2. **Procesamiento de Comisiones** (`pages/procesar.html`)
- Formulario para procesar comisiones mensuales
- Barra de progreso en tiempo real
- Visualización de reglas aplicadas
- Tablas generadas

### 3. **Consultas** (`pages/consultas.html`)
- Consulta de comisiones por auditor
- Calculadora de comisiones interactiva
- Tabla de resultados

### 4. **Reportes** (`pages/reportes.html`)
- Generación de resumen por profesión
- Detalle individual por auditor
- Vista previa de datos
- Estadísticas del mes

### 5. **Reglas de Negocio** (`pages/reglas.html`)
- Documentación completa de las reglas
- 9 reglas de negocio detalladas
- Información técnica del sistema

### 6. **Log de Errores** (`pages/errores.html`)
- Consulta de errores del sistema
- Filtros por tipo, mes y año
- Estadísticas de errores
- Códigos de error comunes

## 🎨 Características de Diseño

- **Diseño Responsivo**: Compatible con dispositivos móviles, tablets y desktop
- **Bootstrap 5**: Framework moderno y optimizado
- **Gradientes Personalizados**: Paleta de colores corporativa
- **Animaciones Suaves**: Transiciones y efectos visuales
- **Componentes Reutilizables**: Navbar y footer compartidos

## 📦 Componentes JavaScript

### `navbar.js`
- Carga dinámica de la barra de navegación
- Carga dinámica del footer
- Ejecuta automáticamente al cargar el DOM

### `main.js`
- Configuración global
- Array de nombres de meses
- Funciones de utilidad

### `procesar.js`
- `procesarComisiones()`: Simula el procesamiento con barra de progreso
- `simularProceso()`: Modo simulación
- `limpiarResultados()`: Limpia formularios y resultados

### `consultas.js`
- `consultarPorAuditor()`: Consulta comisiones de auditores
- `calcularComision()`: Calculadora interactiva de comisiones

### `reportes.js`
- `generarReporte()`: Genera reportes en formato Excel

### `errores.js`
- `consultarErrores()`: Consulta log de errores
- `limpiarErrores()`: Limpia tabla de errores

## 🎯 Reglas de Negocio Implementadas

1. ✅ Comisión por Auditoría Finalizada
2. ✅ Comisión por Volumen de Auditorías
3. ✅ Incentivo por Tipo de Contrato
4. ✅ Bonificación por Nivel de Profesión
5. ✅ Límite de Comisión Mensual
6. ✅ Tablas de Resumen y Detalle
7. ✅ Gestión de Errores
8. ✅ Bono por Afiliación ISAPRE
9. ✅ Procesos Técnicos (Cursores, VARRAY, Triggers)

## 🚀 Cómo Usar

1. Abrir `index.html` en un navegador web
2. Navegar entre las diferentes secciones usando el menú
3. Cada página es independiente y funcional

## 🔧 Configuración

No se requiere instalación ni configuración adicional. El sistema utiliza CDN para Bootstrap y Bootstrap Icons.

### CDN Utilizados:
- Bootstrap CSS: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css`
- Bootstrap JS: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js`
- Bootstrap Icons: `https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css`

## 📱 Compatibilidad

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Dispositivos móviles (iOS/Android)

## 👥 Información de la Empresa

**CMC AUDITORES Y CONSULTORES**
- Fundada: 2012
- Servicios: Auditorías Financiera, Económica, Administrativa, Estratégica, Informática
- Alcance: Nacional e Internacional

## 📄 Licencia

© 2024 CMC AUDITORES Y CONSULTORES - Versión 1.0

---

**Desarrollado con ❤️ usando Bootstrap 5 y JavaScript Vanilla**



