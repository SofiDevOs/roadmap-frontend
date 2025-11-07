# Guía de Contribución

¡Gracias por tu interés en contribuir al proyecto **Roadmap Frontend**! Esta guía te ayudará a configurar tu entorno de desarrollo y seguir las mejores prácticas del proyecto.

## 🚀 Primeros Pasos



### 1. Hacer Fork del Proyecto

1. Ve al repositorio principal en GitHub
2. Haz clic en el botón **"Fork"** en la esquina superior derecha
3. Clona tu fork localmente:

```bash
git clone https://github.com/TU-USUARIO/roadmap-frontend.git
cd roadmap-frontend
```

### 2. Configurar el Entorno de Desarrollo

```bash
# Instalar dependencias
pnpm install

# Crear archivo de configuración desde el ejemplo
cp example.env .env

# Iniciar el servidor de desarrollo
pnpm dev
```

## Consulta el Diseño en Figma
Puedes revisar los diseños y prototipos del proyecto en Figma para asegurarte de que tus contribuciones estén alineadas con la visión del producto.
[Consulta el diseño completo en Figma](https://www.figma.com/design/xB7C3V6C7NVH9TM3UpOsob/RoadmapPatata?node-id=4001-4&t=rLQfYceExslDj7sD-1)

## 🌿 Flujo de Trabajo con Git

### 1. Crear una Rama Descriptiva

Siempre crea una nueva rama desde `develop` con un nombre descriptivo:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nueva-funcionalidad
```

**Convención de nombres de ramas:**
- `feature/descripcion-corta` - Para nuevas características
- `fix/descripcion-del-bug` - Para corrección de errores
- `docs/actualizacion-readme` - Para cambios en documentación
- `refactor/mejora-componente` - Para refactorización de código

### 2. Hacer Commits con Conventional Commits

Utilizamos la especificación [Conventional Commits](https://www.conventionalcommits.org/). Cada commit debe seguir el formato:

```
<tipo>[ámbito opcional]: <descripción>

[cuerpo opcional]

[pie opcional]
```

**Tipos de commit permitidos:**
- `feat` - Nueva característica
- `fix` - Corrección de errores
- `docs` - Cambios en documentación
- `style` - Cambios de formato (espacios, punto y coma, etc.)
- `refactor` - Refactorización de código
- `test` - Agregar o modificar pruebas
- `chore` - Tareas de mantenimiento

**Ejemplos:**
```bash
git commit -m "feat: agregar componente de navegación lateral"
git commit -m "fix: corregir validación de formulario de login"
git commit -m "docs: actualizar guía de instalación"
git commit -m "refactor(auth): mejorar manejo de tokens JWT"
```

### 3. Crear Pull Request

1. Sube tu rama al fork:
```bash
git push origin feature/nueva-funcionalidad
```

2. Crea un Pull Request desde GitHub con:
   - **Título descriptivo** siguiendo Conventional Commits
   - **Descripción detallada** de los cambios
   - **Referencias** a issues relacionados
   - **Screenshots** si aplica para cambios visuales

3. **Dividir cambios en múltiples commits** cuando sea apropiado:
   - Un commit por funcionalidad/arreglo específico
   - Commits con mensajes claros y descriptivos
   - Evitar commits masivos con múltiples cambios no relacionados

## 🏗️ Estándares de Código

### 1. Componentes Astro

- **Usar exclusivamente componentes `.astro`** - No se permiten otros tipos de componentes
- **Nomenclatura PascalCase** para archivos de componentes: `MiComponente.astro`
- **Prefijo `_`** para archivos/directorios que no deben ser rutas: `_components/`, `_MiComponente.astro`

> [!NOTE]
> Esto aplica cuando se crea dentro del directorio de **src/pages**
```astro
---
// ✅ Correcto
import Button from '../_components/Button.astro';
---

<Button>Texto del botón</Button>
```

### 2. Estilos CSS

- **Solo Vanilla CSS** - No instalar frameworks como Tailwind
- **CSS Modules o estilos scoped** cuando sea posible
- **Variables CSS** para colores y espaciados consistentes

```astro
<style>
  .mi-componente {
    color: var(--primary-color);
    padding: var(--spacing-md);
  }
</style>
```

### 3. Estructura de Archivos

```astro
---
// 1. Imports
import Layout from '../layouts/Layout.astro';
import Component from '../components/Component.astro';

// 2. Props y tipos
interface Props {
  title: string;
}

const { title } = Astro.props;

// 3. Lógica del componente
const processedData = someLogic(title);
---

<!-- 4. Markup HTML -->
<Layout>
  <Component title={processedData} />
</Layout>

<!-- 5. Estilos -->
<style>
  /* Estilos del componente */
</style>

<!-- 6. Scripts (si es necesario) -->
<script>
  // JavaScript del lado del cliente
</script>
```

## 📦 Gestión de Dependencias

### ⚠️ Regla Importante: No Instalar Dependencias Sin Consultar

Antes de instalar cualquier nueva dependencia:

1. **Consulta con el equipo** en un issue o discusión
2. **Justifica la necesidad** de la nueva dependencia
3. **Considera alternativas** ya presentes en el proyecto
4. **Evalúa el impacto** en el tamaño del bundle

```bash
# ❌ No hagas esto sin consultar
pnpm add nueva-libreria

# ✅ Primero abre un issue para discusión
# Luego instala solo si es aprobado
```

## 🧪 Testing

### Cypress E2E

```bash
# Ejecutar pruebas en modo headless
pnpm test

# Abrir interfaz de Cypress
pnpm test:open

# Ejecutar pruebas sin interfaz gráfica
pnpm test:headless
```

Antes de hacer un PR, asegúrate de que todas las pruebas pasen:

```bash
pnpm test:headless
```

## 📋 Checklist de Pull Request

Antes de enviar tu PR, verifica:

- [ ] ✅ La rama tiene un nombre descriptivo
- [ ] ✅ Los commits siguen Conventional Commits
- [ ] ✅ Solo uso componentes `.astro`
- [ ] ✅ No se instalaron dependencias sin consultar
- [ ] ✅ Se usa solo Vanilla CSS
- [ ] ✅ Archivos/directorios privados llevan prefijo `_`
- [ ] ✅ Agregar pruebas unitarias si aplica
- [ ] ✅ El código está documentado cuando es necesario
- [ ] ✅ Se solicita revisión a @SofiDevO y @elstron

## 👥 Proceso de Revisión

### Solicitar Revisión

Siempre solicita revisión de:
- **@SofiDevO** - Developer
- **@elstron** - Developer

### Criterios de Aceptación

El PR será fusionado cuando:
- ✅ Tenga al menos una aprobación de revisor asignado
- ✅ Mínimo un test unitario
- ✅ Cumpla con los estándares de código
- ✅ No introduzca breaking changes sin discusión previa

## 🐛 Reportar Issues

Al reportar un bug o solicitar una característica:

1. **Usa las plantillas** de issue apropiadas
2. **Proporciona contexto** suficiente
3. **Incluye pasos** para reproducir (en caso de bugs)
4. **Agrega screenshots** si es relevante



---

## 📚 Recursos Adicionales

- [Astro Documentation](https://docs.astro.build)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [Cypress Documentation](https://docs.cypress.io)

¡Gracias por contribuir al proyecto! 🚀