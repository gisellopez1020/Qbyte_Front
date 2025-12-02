# QByte - Plataforma de Cumplimiento Normativo

<p align="center">
  <img src="public/qbyte.png" alt="QByte Logo" width="200"/>
</p>

<p align="center">
  <strong>Automatiza y simplifica el cumplimiento normativo de tu empresa</strong>
</p>

<p align="center">
  <a href="#características">Características</a> •
  <a href="#tecnologías">Tecnologías</a> •
  <a href="#instalación">Instalación</a> •
  <a href="#estructura-del-proyecto">Estructura</a> •
  <a href="#uso">Uso</a> •
  <a href="#equipo">Equipo</a>
</p>

---

## 📋 Descripción

**QByte** es una plataforma web diseñada para empresas que buscan una solución ágil, confiable y automatizada para su cumplimiento normativo. Permite realizar evaluaciones de calidad, auditorías internas y externas, gestionar planes de acción siguiendo la metodología PDCA, y generar reportes y certificados de cumplimiento.

## ✨ Características

- **Evaluaciones Inteligentes de Cumplimiento**: Realiza diagnósticos detallados con estándares como ISO 9001, mediante cuestionarios estructurados y captura de evidencias.
- **Gestión de Planes de Acción (PDCA)**: Transforma hallazgos en mejoras con objetivos, tareas y seguimiento del ciclo PDCA.
- **Tableros Dinámicos y Reportes**: Visualiza métricas de cumplimiento, brechas críticas y genera reportes descargables.
- **Gestión de Roles y Permisos**: Administra accesos diferenciados para gestores, auditores internos y externos.
- **Soporte Multilenguaje**: Disponible en Español, Inglés, Francés, Alemán e Italiano.
- **Generación de Certificados**: Obtén certificados de cumplimiento normativo en formato PDF.

## 🛠️ Tecnologías

| Frontend | Backend/Servicios | Herramientas |
|----------|-------------------|--------------|
| ![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react) | ![Firebase](https://img.shields.io/badge/Firebase-11.5.0-FFCA28?logo=firebase) | ![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite) |
| ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4?logo=tailwindcss) | ![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi) | ![ESLint](https://img.shields.io/badge/ESLint-9.21.0-4B32C3?logo=eslint) |
| ![React Router](https://img.shields.io/badge/React_Router-7.5.2-CA4245?logo=reactrouter) | | ![PostCSS](https://img.shields.io/badge/PostCSS-8.5.3-DD3A0A?logo=postcss) |
| ![i18next](https://img.shields.io/badge/i18next-25.2.0-26A69A?logo=i18next) | | |
| ![Recharts](https://img.shields.io/badge/Recharts-2.15.3-FF6384) | | |

## 📦 Instalación

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/gisellopez1020/Qbyte_Front.git
   cd Qbyte_Front
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la build de producción |
| `npm run preview` | Vista previa de la build de producción |
| `npm run lint` | Ejecuta el linter ESLint |

## 📁 Estructura del Proyecto

```
Qbyte_Front/
├── public/                 # Recursos estáticos (imágenes, íconos)
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── Header.jsx      # Encabezado de la aplicación
│   │   ├── Footer.jsx      # Pie de página
│   │   ├── Hero.jsx        # Sección principal de inicio
│   │   ├── AboutUs.jsx     # Sección "Sobre nosotros"
│   │   ├── Services.jsx    # Sección de servicios
│   │   ├── Sidebar.jsx     # Barra lateral de navegación
│   │   └── Formulario.jsx  # Componente de formularios
│   ├── config/             # Configuraciones
│   │   └── sidebarConfig.js
│   ├── context/            # Contextos de React
│   │   └── AuthContext.jsx # Contexto de autenticación
│   ├── layouts/            # Layouts de la aplicación
│   │   ├── SidebarLayout.jsx
│   │   └── FormsRedirect.jsx
│   ├── locales/            # Archivos de internacionalización
│   │   ├── es/             # Español
│   │   ├── en/             # Inglés
│   │   ├── fr/             # Francés
│   │   ├── de/             # Alemán
│   │   └── it/             # Italiano
│   ├── pages/              # Páginas de la aplicación
│   │   ├── auth/           # Páginas de autenticación
│   │   │   ├── Login.jsx
│   │   │   └── Sign.jsx
│   │   ├── admin/          # Páginas de administración
│   │   │   ├── forms/      # Gestión de formularios
│   │   │   └── users/      # Gestión de usuarios
│   │   ├── Index.jsx       # Página principal (dashboard)
│   │   ├── Plan.jsx        # Planes de acción
│   │   ├── Reports.jsx     # Reportes y certificados
│   │   └── PlanesExterno.jsx
│   ├── App.jsx             # Componente principal
│   ├── main.jsx            # Punto de entrada
│   ├── i18n.js             # Configuración de internacionalización
│   └── index.css           # Estilos globales
├── firebaseConfig.js       # Configuración de Firebase
├── tailwind.config.js      # Configuración de Tailwind CSS
├── vite.config.js          # Configuración de Vite
├── eslint.config.js        # Configuración de ESLint
└── package.json            # Dependencias y scripts
```

## 🚀 Uso

### Roles de Usuario

La aplicación cuenta con tres roles principales:

| Rol | Descripción | Funcionalidades |
|-----|-------------|-----------------|
| **Administrador** | Gestiona el sistema completo | Crear usuarios, administrar formularios, supervisar auditores |
| **Auditor Interno** | Realiza auditorías internas | Completar formularios, generar reportes, crear planes de acción |
| **Auditor Externo** | Evalúa auditorías externas | Revisar formularios, agregar comentarios, actualizar estados |

### Flujo de Trabajo

1. **Registro/Login**: Crear cuenta o iniciar sesión con credenciales
2. **Dashboard**: Visualizar resumen según rol asignado
3. **Formularios**: Seleccionar y completar formularios de auditoría
4. **Planes de Acción**: Crear y gestionar planes PDCA
5. **Reportes**: Generar y descargar reportes de cumplimiento
6. **Certificados**: Obtener certificados al alcanzar el puntaje requerido

## 👥 Equipo

<table>
  <tr>
    <td align="center">
      <img src="public/Monica.png" width="100px;" alt="Mónica Chicangana"/><br />
      <sub><b>Mónica Chicangana</b></sub><br />
      <sub>Desarrolladora Frontend</sub>
    </td>
    <td align="center">
      <img src="public/JeanE.png" width="100px;" alt="Jean Pool Esguerra"/><br />
      <sub><b>Jean Pool Esguerra</b></sub><br />
      <sub>Desarrollador Backend</sub>
    </td>
    <td align="center">
      <img src="public/JeanA.png" width="100px;" alt="Jean Alfred Gargano"/><br />
      <sub><b>Jean Alfred Gargano</b></sub><br />
      <sub>Desarrollador Backend</sub>
    </td>
    <td align="center">
      <img src="public/Gisel.png" width="100px;" alt="Karen Gisel López"/><br />
      <sub><b>Karen Gisel López</b></sub><br />
      <sub>Desarrolladora Frontend</sub>
    </td>
    <td align="center">
      <img src="public/JeanP.png" width="100px;" alt="Jean Paul Ordoñez"/><br />
      <sub><b>Jean Paul Ordoñez</b></sub><br />
      <sub>Desarrollador Backend</sub>
    </td>
  </tr>
</table>

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos.

---

<p align="center">
  Hecho con ❤️ por el equipo QByte
</p>
