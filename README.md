# Roadmap Frontend

Una aplicación web moderna construida con Astro que proporciona una plataforma educativa para gestión de roadmaps, cursos y lecciones.


## 🏗️ Arquitectura

Este proyecto sigue una **arquitectura híbrida basada en componentes** que combina elementos de:

- **Arquitectura por Capas (Layered Architecture)**: Separación clara entre presentación, lógica de negocio y servicios
- **Component-Based Architecture**: Componentes reutilizables con responsabilidades específicas
- **Feature-Based Structure**: Organización por características/funcionalidades

### Estructura del Proyecto

```text
/
├── astro.config.mjs           # Configuración de Astro
├── package.json               # Dependencias y scripts
├── tsconfig.json              # Configuración de TypeScript
├── cypress.config.js          # Configuración de pruebas E2E
├── public/                    # Archivos estáticos
│   ├── assets/
│   │   ├── icons/
│   │   └── levels/
│   └── images/
├── src/
│   ├── config.ts              # Configuración de la app
│   ├── consts.ts              # Constantes globales
│   ├── middleware.js          # Middleware de autenticación y rutas
│   ├── actions/               # Server Actions
│   │   └── index.ts
│   ├── components/            # Componentes reutilizables
│   │   ├── Button.astro
│   │   ├── ToastAlert.astro
│   │   ├── cards/
│   │   ├── input/
│   │   └── TinyMCE/
│   ├── context/               # Contextos de páginas específicas
│   │   ├── dashboard/
│   │   └── index/
│   │       ├── call-to-action/
│   │       ├── hero/
│   │       └── roadmaps/
│   ├── data/                  # Datos mock y estáticos
│   │   ├── nav-menu.js
│   │   ├── roadmap.mock.json
│   │   └── roadmaps.mock.js
│   ├── errors/                # Manejo de errores
│   │   ├── appError.ts
│   │   └── registerError.ts
│   ├── layouts/               # Layouts base
│   │   ├── BaseHead.astro
│   │   └── Layout.astro
│   ├── pages/                 # Rutas de la aplicación
│   │   ├── index.astro
│   │   ├── logout.astro
│   │   ├── access/            # Autenticación
│   │   │   ├── login.astro
│   │   │   ├── register.astro
│   │   │   ├── _components/
│   │   │   └── _errors/
│   │   ├── dashboard/         # Panel administrativo
│   │   │   ├── index.astro
│   │   │   ├── _Layout.astro
│   │   │   ├── _LayoutStudents.astro
│   │   │   ├── _components/
│   │   │   ├── _data/
│   │   │   ├── cursos/
│   │   │   ├── lecciones/
│   │   │   ├── roadmaps/
│   │   │   └── student/
│   │   ├── settings/          # Configuraciones de usuario
│   │   │   ├── index.astro
│   │   │   ├── [tab].astro
│   │   │   ├── _Tabs.astro
│   │   │   ├── _components/
│   │   │   └── _sections/
│   │   └── ui-test/           # Componentes de prueba
│   ├── services/              # Servicios API
│   │   └── roadmaps/
│   │       ├── delete-roadmap.service.ts
│   │       ├── get-roadmap-by-id.service.ts
│   │       ├── get-roadmaps.service.ts
│   │       └── post-roadmap.service.ts
│   ├── styles/                # Estilos globales
│   │   └── main.css
│   ├── types/                 # Definiciones de tipos TypeScript
│   │   └── roadmap.type.ts
│   └── utils/                 # Utilidades
│       ├── apiClient.ts
│       ├── http.ts
│       ├── toastAlerts.controller.ts
│       └── auth/
│           └── isLoggedIn.ts
├── cypress/                   # Pruebas E2E
│   ├── e2e/
│   └── support/
└── docs/                      # Documentación
    └── http-utils-guide.md
```

## 🛠️ Stack Tecnológico

### Framework Principal
- **Astro 5.14.1** - Meta-framework moderno para sitios web rápidos

### Integración Frontend
- **@astrojs/cloudflare** - Adapter para despliegue en Cloudflare
- **@sofidevo/astro-dynamic-header** - Header dinámico personalizado

### Estilos
- **Vanilla CSS** - Sin frameworks CSS, solo CSS puro
- **@fontsource/poppins** - Tipografía Poppins

### Herramientas de Desarrollo
- **TypeScript** - Tipado estático
- **Sharp** - Procesamiento de imágenes
- **Chart.js** - Gráficos y visualización de datos
- **@formkit/drag-and-drop** - Funcionalidad drag & drop
- **@faker-js/faker** - Generación de datos mock
- **Jose** - Manejo de JWT
- **TinyMCE** - Editor de texto enriquecido

### Testing
- **Cypress 13.15.2** - Pruebas end-to-end

### Gestión de Paquetes
- **pnpm** - Gestor de paquetes rápido y eficiente

## 🚀 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando                   | Descripción                                      |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`            | Instala las dependencias                         |
| `pnpm dev`                | Inicia el servidor de desarrollo en `localhost:4321` |
| `pnpm build`              | Construye el sitio para producción en `./dist/` |
| `pnpm preview`            | Previsualiza la construcción localmente         |
| `pnpm test`               | Ejecuta las pruebas de Cypress                   |
| `pnpm test:open`          | Abre la interfaz de Cypress                      |
| `pnpm test:headless`      | Ejecuta las pruebas sin interfaz gráfica        |

## 🏛️ Patrones de Arquitectura

### 1. **Separation of Concerns**
- **Components**: Componentes UI reutilizables
- **Services**: Lógica de negocio y comunicación con APIs
- **Utils**: Funciones auxiliares y helpers
- **Types**: Definiciones de tipos y interfaces

### 2. **Feature-Based Organization**
- Cada módulo principal (`dashboard`, `access`, `settings`) tiene su propia estructura
- Componentes privados con prefijo `_` para evitar rutas accidentales

### 3. **Middleware Pattern**
- Autenticación y autorización centralizada
- Redirección basada en roles de usuario

### 4. **Service Layer**
- Abstracción de llamadas a APIs
- Cliente HTTP reutilizable (`apiClient`)

## 🔐 Sistema de Autenticación

El proyecto implementa un sistema de autenticación basado en roles:

- **Admin**: Acceso completo al dashboard administrativo
- **Student**: Acceso a dashboard de estudiante
- **Teacher**: Acceso a funciones de profesor

## 🎯 Características Principales

- 📚 **Gestión de Roadmaps**: Creación y administración de rutas de aprendizaje
- 👥 **Panel de Usuario**: Dashboards diferenciados por rol
- 🎓 **Cursos y Lecciones**: Sistema completo de educación online
- ⚙️ **Configuraciones**: Panel de ajustes personalizables
- 📊 **Analytics**: Seguimiento de progreso con gráficos
- 🔒 **Autenticación**: Sistema seguro con JWT
- 📱 **Responsive**: Diseño adaptativo para todos los dispositivos

## 📋 Contribuir

Para contribuir al proyecto, consulta nuestra [Guía de Contribución](./docs/ContributionGuidelines.md).

## 📄 Licencia
Este proyecto está bajo la Licencia Apache 2.0 - ver el archivo [LICENSE](LICENSE) para más detalles.

### Apache License 2.0

Copyright (c) 2024 Roadmap Frontend

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## 👥 Equipo

- **@SofiDevO** - patata
- **@elstron** - Fullstack
- **rickytodev** - fullstack

## 📚 Documentación Adicional

- [Guía de Utilidades HTTP](./docs/http-utils-guide.md)
- [Guía de Contribución](./docs/ContributionGuidelines.md)