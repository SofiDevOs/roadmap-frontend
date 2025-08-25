# Contributing

Este documento describe el flujo de trabajo, las convenciones y las validaciones automáticas que usamos para garantizar la calidad del código.

---

## 🚀 Flujo de Contribución

### 1. Crear una Rama
1. Asegúrate de tener tu rama local actualizada:
   ```bash
   git pull origin main
   ```
2. Crea una nueva rama para tu cambio:
   ```bash
   git checkout -b nombre-descriptivo-del-cambio
   ```

> ⚠ No se permite hacer push directo a ramas protegidas.  
> Todos los cambios se integran mediante Pull Request.

---

### 2. Desarrollo!~
1. Sigue las **convenciones de proyecto** y la **estructura de carpetas** indicadas más abajo.
2. Escribe tests para cualquier funcionalidad nueva o modificada.
3. Mantén la salida de los tests limpia (sin logs ni advertencias).
4. Asegúrate de que el lint y las traducciones estén correctos antes de hacer commit.
5. Valida que el coverage de los archivos modificados cumpla el mínimo requerido.

---

### 3. Commit y Push
1. Usa mensajes de commit siguiendo [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add payment form validations
   fix: correct event date formatting
   docs: update configuration guide
   ```
2. Haz commit de tus cambios:
   ```bash
   git add .
   git commit -m "tipo: descripción breve"
   ```
3. Sube tu rama:
   ```bash
   git push origin nombre-descriptivo-del-cambio
   ```

---

### 4. Pull Request
1. Abre un Pull Request hacia la rama base.
2. Describe claramente los cambios realizados.
3. Incluye cualquier información relevante para la revisión.

---

## 📂 Convenciones del Proyecto

### Estructura de Archivos
- **Componentes**: `src/components/ComponentName/ComponentName.tsx`
- **Hooks**: `src/hooks/hook-name.hook.ts`
- **Servicios**: `src/services/service-name/service-name.ts`
- **Utilidades**: `src/utils/util-name/util-name.ts`
- **Configuraciones**: `src/configs/config-name.ts`

### Convenciones de Nomenclatura
- **Componentes**: UpperCamelCase  
- **Archivos de utilidades**: kebab-case  
- **Hooks**: kebab-case con sufijo `.hook.ts`  
- **Servicios**: kebab-case  
- **Stores**: kebab-case con sufijo `.store.ts`  
- **Contextos**: kebab-case con sufijo `.context.ts`  

---

## 📌 Convención Especial: Prefijo `_` en Carpetas No Relacionadas  

Para mejorar la **navegación** y **claridad visual**, las carpetas **no directamente relacionadas** con el contenido principal deben iniciar con `_`.

**Objetivos:**
1. Evitar que carpetas auxiliares se mezclen con las principales.
2. Mantenerlas visibles en la parte superior.
3. Servir como indicador visual de carpeta auxiliar.

**⚠ Excepción:** No se aplica en la carpeta raíz `src/`.

Ejemplo **antes**:
```
components/
 ├─ ActionButton
 ├─ BaseModal
 ├─ configs
 └─ OtherComponent
```

Ejemplo **después**:
```
components/
 ├─ _configs
 ├─ ActionButton
 ├─ BaseModal
 └─ OtherComponent
```

---

## 📌 Convención Especial: Componentes Sin Estado

La carpeta `stateless-components` se renombra así:
- `stateless` → Relacionados directamente.
- `_stateless` → No relacionados directamente.

**Criterio:**
- Sin `_` → relacionado.
- Con `_` → auxiliar/no relacionado.

---

## 🛡 Validaciones Automáticas (Husky)

Husky se encarga de ejecutar validaciones **antes de cada commit y push**, y de verificar que los commits sigan el formato correcto.

### `pre-commit`
1. **Lint** → Código debe cumplir las reglas de ESLint.
2. **Traducciones** → No se admiten traducciones faltantes (`npx ltr lint`).
3. **Coverage mínimo** →  
   - Solo analiza archivos modificados.  
   - Requiere 99% mínimo en Statements, Branches, Functions y Lines.
4. **Salida limpia** → No se admiten `console.log`, advertencias ni mensajes extra en la salida de tests.

### `pre-push`
1. **Chequeo de Tipos** → `tsc` debe pasar sin errores.
2. **Tests completos** → Todos los tests deben pasar sin fallos ni advertencias.

### `commit-msg`
- Valida que el mensaje cumpla con el estándar **Conventional Commits**.

---

## 📌 Uso de `/* istanbul ignore */` en Vitest

Vitest soporta las anotaciones de Istanbul para excluir código del cálculo de cobertura.  
Úsalo **solo** en casos donde realmente no sea posible testear una línea o bloque.

Ejemplos comunes:
```ts
/* istanbul ignore next */
doSomethingThatCantBeTested()

/* istanbul ignore if */
if (isRunningOnLegacyBrowser()) {
  // código imposible de cubrir en CI
}
```

Variantes:
- `/* istanbul ignore next */` → ignora la siguiente línea.
- `/* istanbul ignore file */` → ignora todo el archivo.
- `/* istanbul ignore if */` → ignora un `if` específico.
- `/* istanbul ignore else */` → ignora el bloque `else`.

---

## 🚨 Omitir Husky en Casos Excepcionales

En circunstancias excepcionales, es posible omitir las validaciones de Husky **solo con autorización expresa** de:
- CEO: **XXXXXXX**
- Responsable del Front: **XXXXX**
- Project Manager: **XXXX**

**Comando para omitir Husky:**
```bash
HUSKY=0 git commit -m "mensaje de commit"
git push origin nombre-de-la-rama
```

**Condiciones para omitir Husky:**
- Debe tratarse de un cambio urgente (ej. hotfix crítico en producción).
- El código debe cumplir las validaciones antes de ser mergeado a la rama principal.
- El uso de esta excepción debe quedar registrado en la descripción del Pull Request.

---

## ❌ En casos normales, no se admitirá código que:
- No alcance el **99% de coverage** en cualquiera de los 4 métricos.
- Tenga **tests fallando**.
- Genere **advertencias o logs** en los tests.
- Presente **errores de linting**.
- Tenga **errores de tipado** en TypeScript.
- Presente **traducciones faltantes**.

---

## 🆘 Si tu commit/push falla
1. Lee el mensaje de error en consola.
2. Corrige según la validación que falló.
3. Repite el proceso hasta que todas pasen.
