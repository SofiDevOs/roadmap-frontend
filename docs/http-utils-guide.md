# Guía Completa: Utilidad HTTP (`http.ts`)

## Índice
1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Interfaces y Tipos](#interfaces-y-tipos)
4. [Clase HttpClient](#clase-httpclient)
5. [Funciones Helper](#funciones-helper)
6. [Ejemplos de Uso](#ejemplos-de-uso)
7. [Manejo de Errores](#manejo-de-errores)
8. [Configuración Avanzada](#configuración-avanzada)

---

## Introducción

La utilidad `http.ts` es un cliente HTTP robusto y tipado construido sobre la API nativa `fetch` de JavaScript. Proporciona una interfaz consistente y amigable para realizar peticiones HTTP con características avanzadas como timeout, interceptores automáticos y manejo de diferentes tipos de contenido.

### Características Principales
- ✅ **TypeScript nativo** con tipado completo
- ✅ **Timeout configurable** por petición
- ✅ **Manejo automático de JSON y FormData**
- ✅ **Headers personalizables** por defecto y por petición
- ✅ **Soporte para credentials** (cookies, autenticación)
- ✅ **Funciones shorthand** para métodos HTTP comunes
- ✅ **URL building** automático con baseURL

---

## Arquitectura del Sistema

El sistema está compuesto por tres capas principales:

```
┌─────────────────────────────────────┐
│        Funciones Helper             │
│  httpGet, httpPost, httpPut, etc.   │
├─────────────────────────────────────┤
│         HttpClient Class            │
│    Lógica principal de HTTP         │
├─────────────────────────────────────┤
│          Fetch API                  │
│     API nativa del navegador        │
└─────────────────────────────────────┘
```

### Flujo de Funcionamiento

1. **Llamada inicial**: El usuario utiliza una función helper (ej: `httpGet()`)
2. **Construcción de URL**: Se construye la URL completa usando `getFullUrl()`
3. **Procesamiento**: `HttpClient` procesa la configuración y opciones
4. **Petición HTTP**: Se ejecuta `fetch()` con los parámetros preparados
5. **Respuesta**: Se parsea y estructura la respuesta en formato `HttpResponse`

---

## Interfaces y Tipos

### 1. `HttpConfig`
Configuración por defecto para todas las peticiones del cliente.

```typescript
interface HttpConfig {
  baseURL?: string;           // URL base para peticiones relativas
  timeout?: number;           // Timeout en milisegundos (default: 10000)
  headers?: Record<string, string>;  // Headers por defecto
  credentials?: RequestCredentials;  // Política de credentials (default: 'include')
}
```

**Ejemplo de uso:**
```typescript
const config: HttpConfig = {
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: { 'Authorization': 'Bearer token' },
  credentials: 'include'
};
```

### 2. `HttpRequestOptions`
Opciones específicas para una petición individual.

```typescript
interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;  // Headers específicos
  body?: any;                        // Datos del cuerpo (JSON, FormData, string)
  credentials?: RequestCredentials;   // Credentials específicos
  timeout?: number;                  // Timeout específico
}
```

### 3. `HttpResponse<T>`
Estructura estándar de respuesta HTTP tipada.

```typescript
interface HttpResponse<T = any> {
  data: T;              // Datos parseados automáticamente
  status: number;       // Código de estado HTTP (200, 404, etc.)
  statusText: string;   // Texto descriptivo del estado
  headers: Headers;     // Headers de respuesta
  ok: boolean;          // true si status 200-299
}
```

---

## Clase HttpClient

### Constructor

```typescript
constructor(config: HttpConfig = {})
```

Crea una nueva instancia con configuración por defecto:
- `credentials: 'include'` - Incluye cookies en peticiones
- `headers: { 'Content-Type': 'application/json' }` - JSON por defecto
- `timeout: 10000` - 10 segundos de timeout

### Método Principal: `request()`

```typescript
async request<T>(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<T>>
```

**Proceso paso a paso:**

1. **Preparación de URL**:
   ```typescript
   const fullUrl = this.config.baseURL ?
     new URL(url, this.config.baseURL).toString() : url;
   ```

2. **Merge de Headers**:
   ```typescript
   const requestHeaders = {
     ...this.config.headers,  // Headers por defecto
     ...headers,              // Headers específicos (sobrescriben)
   };
   ```

3. **Procesamiento del Body**:
   - `FormData`: Se envía tal como está, sin Content-Type
   - `Object`: Se serializa a JSON con `JSON.stringify()`
   - `String`: Se envía directamente

4. **Setup de Timeout**:
   ```typescript
   const controller = new AbortController();
   const timeoutId = setTimeout(() => controller.abort(), timeout);
   ```

5. **Ejecución de Fetch**:
   ```typescript
   const response = await fetch(fullUrl, {
     method,
     headers: requestHeaders,
     body: requestBody,
     credentials,
     signal: controller.signal,
   });
   ```

6. **Parsing de Respuesta**:
   ```typescript
   if (contentType && contentType.includes('application/json')) {
     data = await response.json();
   } else {
     data = await response.text();
   }
   ```

### Métodos Shorthand

| Método | Descripción | Uso |
|--------|-------------|-----|
| `get()` | Petición GET | Obtener datos |
| `post()` | Petición POST | Crear recursos |
| `put()` | Petición PUT | Actualizar completamente |
| `patch()` | Petición PATCH | Actualizar parcialmente |
| `delete()` | Petición DELETE | Eliminar recursos |

---

## Funciones Helper

### Función Principal: `http()`

```typescript
async function http<T>(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<T>>
```

**Funcionalidad especial:**
- Si la URL comienza con `http`, se usa tal como está
- Si es relativa, se construye usando `getFullUrl()` del archivo `consts.ts`

### Funciones Shorthand Globales

```typescript
// GET
export const httpGet = <T>(url: string, options?) =>
  http<T>(url, { ...options, method: 'GET' });

// POST
export const httpPost = <T>(url: string, data?: any, options?) =>
  http<T>(url, { ...options, method: 'POST', body: data });

// PUT
export const httpPut = <T>(url: string, data?: any, options?) =>
  http<T>(url, { ...options, method: 'PUT', body: data });

// DELETE
export const httpDelete = <T>(url: string, options?) =>
  http<T>(url, { ...options, method: 'DELETE' });

// PATCH
export const httpPatch = <T>(url: string, data?: any, options?) =>
  http<T>(url, { ...options, method: 'PATCH', body: data });
```

---

## Ejemplos de Uso

### 1. GET Requests

```typescript
// Obtener lista de usuarios
const users = await httpGet<User[]>('/users');
if (users.ok) {
  console.log('Usuarios:', users.data);
}

// Obtener usuario específico
const user = await httpGet<User>('/users/123');
```

### 2. POST Requests

```typescript
// Crear usuario
const newUser = await httpPost<User>('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// Upload de archivo
const formData = new FormData();
formData.append('file', file);
const uploadResponse = await httpPost('/upload', formData);
```

### 3. Autenticación

```typescript
// Login
const loginResponse = await httpPost<AuthResponse>('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// Petición autenticada
const protectedData = await httpGet('/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### 4. Uso de HttpClient Directamente

```typescript
// Cliente personalizado
const apiClient = new HttpClient({
  baseURL: 'https://api.myapp.com',
  headers: {
    'X-API-Key': 'my-api-key'
  },
  timeout: 15000
});

const response = await apiClient.get<Product[]>('/products');
```

---

## Manejo de Errores

### Tipos de Errores

1. **Timeout Error**:
   ```typescript
   try {
     const response = await httpGet('/slow-endpoint');
   } catch (error) {
     if (error.message.includes('timeout')) {
       console.log('La petición tardó demasiado');
     }
   }
   ```

2. **Network Error**:
   ```typescript
   try {
     const response = await httpGet('/api/data');
   } catch (error) {
     console.log('Error de red:', error.message);
   }
   ```

3. **HTTP Error Status**:
   ```typescript
   const response = await httpGet('/api/data');
   if (!response.ok) {
     console.log(`Error ${response.status}: ${response.statusText}`);
     // Manejar error según status
     switch (response.status) {
       case 401:
         // Redirect to login
         break;
       case 404:
         // Show not found message
         break;
       case 500:
         // Show server error
         break;
     }
   }
   ```

### Patrón de Manejo Recomendado

```typescript
async function safeApiCall<T>(url: string, options?: HttpRequestOptions): Promise<T | null> {
  try {
    const response = await http<T>(url, options);

    if (response.ok) {
      return response.data;
    } else {
      console.error(`HTTP Error ${response.status}:`, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Network Error:', error);
    return null;
  }
}
```

---

## Configuración Avanzada

### 1. Cliente con Interceptores Personalizados

```typescript
class CustomHttpClient extends HttpClient {
  async request<T>(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
    // Pre-request interceptor
    console.log(`Making request to: ${url}`);

    const response = await super.request<T>(url, options);

    // Post-request interceptor
    if (!response.ok) {
      console.error(`Request failed: ${response.status}`);
    }

    return response;
  }
}
```

### 2. Cliente con Retry Logic

```typescript
async function httpWithRetry<T>(
  url: string,
  options: HttpRequestOptions = {},
  maxRetries = 3
): Promise<HttpResponse<T>> {
  let lastError: any;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await http<T>(url, options);
    } catch (error) {
      lastError = error;
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  throw lastError;
}
```

### 3. Cache Simple

```typescript
const cache = new Map<string, { data: any; timestamp: number }>();

async function httpWithCache<T>(
  url: string,
  options: HttpRequestOptions = {},
  cacheTime = 5 * 60 * 1000 // 5 minutos
): Promise<HttpResponse<T>> {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < cacheTime) {
    return cached.data;
  }

  const response = await http<T>(url, options);

  if (response.ok) {
    cache.set(cacheKey, { data: response, timestamp: Date.now() });
  }

  return response;
}
```

---

## Integración con el Proyecto

### Configuración Actual

El proyecto utiliza:
- `getFullUrl()` de `consts.ts` para construir URLs completas
- Instancia por defecto `httpClient` exportada
- Funciones helper exportadas para uso directo

### Recomendaciones de Uso

1. **Para operaciones simples**: Usar funciones helper (`httpGet`, `httpPost`, etc.)
2. **Para configuración específica**: Crear instancia de `HttpClient`
3. **Para autenticación**: Agregar headers de Authorization en opciones
4. **Para uploads**: Usar `FormData` como body en `httpPost`

---

## Conclusión

La utilidad `http.ts` proporciona una abstracción robusta y tipada sobre `fetch`, facilitando las comunicaciones HTTP en el proyecto Astro. Su diseño modular permite uso simple para casos básicos y extensibilidad para requerimientos avanzados.

### Beneficios Clave
- **Type Safety**: TypeScript completo
- **Consistencia**: API uniforme para todas las peticiones
- **Flexibilidad**: Configuración granular por petición
- **Robustez**: Manejo de timeouts y errores
- **Productividad**: Funciones helper para uso rápido