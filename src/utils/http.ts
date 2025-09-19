/**
 * Configuración por defecto para las peticiones HTTP
 * @interface HttpConfig
 * @example
 * ```typescript
 * const config: HttpConfig = {
 *   baseURL: 'https://api.example.com',
 *   timeout: 5000,
 *   headers: { 'Authorization': 'Bearer token' },
 *   credentials: 'include'
 * };
 * ```
 */
export interface HttpConfig {
  /** URL base para todas las peticiones. Si se proporciona, se concatenará con las URLs relativas */
  baseURL?: string;
  /** Tiempo máximo de espera en milisegundos antes de cancelar la petición (por defecto: 10000ms) */
  timeout?: number;
  /** Headers HTTP que se enviarán con todas las peticiones */
  headers?: Record<string, string>;
  /** Política de credentials para las peticiones (por defecto: 'include') */
  credentials?: RequestCredentials;
}

/**
 * Opciones para una petición HTTP específica
 * @interface HttpRequestOptions
 * @example
 * ```typescript
 * const options: HttpRequestOptions = {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: { name: 'John Doe' },
 *   timeout: 3000
 * };
 * ```
 */
export interface HttpRequestOptions {
  /** Método HTTP a utilizar (por defecto: 'GET') */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** Headers HTTP específicos para esta petición */
  headers?: Record<string, string>;
  /** Datos a enviar en el cuerpo de la petición (JSON, FormData, string, etc.) */
  body?: any;
  /** Política de credentials para esta petición específica */
  credentials?: RequestCredentials;
  /** Tiempo máximo de espera para esta petición específica */
  timeout?: number;
}

/**
 * Respuesta estándar de la función HTTP
 * @interface HttpResponse
 * @template T - Tipo de los datos de respuesta
 * @example
 * ```typescript
 * const response: HttpResponse<User> = await httpGet('/users/123');
 * if (response.ok) {
 *   console.log(response.data.name); // Typesafe access
 * }
 * ```
 */
export interface HttpResponse<T = any> {
  /** Datos de la respuesta parseados automáticamente (JSON o texto) */
  data: T;
  /** Código de estado HTTP (200, 404, 500, etc.) */
  status: number;
  /** Texto descriptivo del estado HTTP */
  statusText: string;
  /** Headers de la respuesta HTTP */
  headers: Headers;
  /** true si el status está entre 200-299, false en caso contrario */
  ok: boolean;
}

/**
 * Clase para realizar peticiones HTTP de manera consistente
 * @class HttpClient
 * @example
 * ```typescript
 * const client = new HttpClient({
 *   baseURL: 'https://api.example.com',
 *   timeout: 5000
 * });
 *
 * const response = await client.get('/users');
 * ```
 */
class HttpClient {
  private config: HttpConfig;

  /**
   * Crea una nueva instancia del cliente HTTP
   * @param config - Configuración por defecto para todas las peticiones
   * @example
   * ```typescript
   * const client = new HttpClient({
   *   baseURL: 'https://api.example.com',
   *   headers: { 'Authorization': 'Bearer token' },
   *   timeout: 10000
   * });
   * ```
   */
  constructor(config: HttpConfig = {}) {
    this.config = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
      ...config,
    };
  }

  /**
   * Realiza una petición HTTP genérica
   * @template T - Tipo esperado de los datos de respuesta
   * @param url - URL de la petición (absoluta o relativa)
   * @param options - Opciones específicas de la petición
   * @returns Promise que resuelve con la respuesta HTTP estructurada
   * @throws {Error} Si la petición excede el timeout configurado
   * @throws {Error} Si hay un error de red o conexión
   * @example
   * ```typescript
   * // GET request
   * const users = await client.request<User[]>('/users');
   *
   * // POST request
   * const newUser = await client.request<User>('/users', {
   *   method: 'POST',
   *   body: { name: 'John', email: 'john@example.com' }
   * });
   * ```
   */
  async request<T = any>(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      credentials = this.config.credentials,
      timeout = this.config.timeout,
    } = options;

    // Construir la URL completa si hay baseURL
    const fullUrl = this.config.baseURL ? new URL(url, this.config.baseURL).toString() : url;

    // Preparar headers
    const requestHeaders = {
      ...this.config.headers,
      ...headers,
    };

    // Preparar el body
    let requestBody: string | FormData | undefined;
    if (body) {
      if (body instanceof FormData) {
        requestBody = body;
        // No establecer Content-Type para FormData, el navegador lo hará automáticamente
        delete requestHeaders['Content-Type'];
      } else if (typeof body === 'object') {
        requestBody = JSON.stringify(body);
      } else {
        requestBody = body;
      }
    }

    // Configurar AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(fullUrl, {
        method,
        headers: requestHeaders,
        body: requestBody,
        credentials,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Intentar parsear la respuesta como JSON
      let data: T;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text() as unknown as T;
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        ok: response.ok,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }

      throw error;
    }
  }

  /**
   * Realiza una petición GET
   * @template T - Tipo esperado de los datos de respuesta
   * @param url - URL de la petición
   * @param options - Opciones adicionales (excluye method y body)
   * @returns Promise que resuelve con la respuesta HTTP
   * @example
   * ```typescript
   * const users = await client.get<User[]>('/users');
   * const user = await client.get<User>('/users/123');
   * ```
   */
  async get<T = any>(url: string, options: Omit<HttpRequestOptions, 'method' | 'body'> = {}): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  /**
   * Realiza una petición POST
   * @template T - Tipo esperado de los datos de respuesta
   * @param url - URL de la petición
   * @param data - Datos a enviar en el cuerpo de la petición
   * @param options - Opciones adicionales (excluye method y body)
   * @returns Promise que resuelve con la respuesta HTTP
   * @example
   * ```typescript
   * const newUser = await client.post<User>('/users', {
   *   name: 'John Doe',
   *   email: 'john@example.com'
   * });
   *
   * // Con FormData
   * const formData = new FormData();
   * formData.append('file', file);
   * const response = await client.post('/upload', formData);
   * ```
   */
  async post<T = any>(url: string, data?: any, options: Omit<HttpRequestOptions, 'method' | 'body'> = {}): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...options, method: 'POST', body: data });
  }

  /**
   * Realiza una petición PUT (actualización completa de recurso)
   * @template T - Tipo esperado de los datos de respuesta
   * @param url - URL de la petición
   * @param data - Datos completos del recurso a actualizar
   * @param options - Opciones adicionales (excluye method y body)
   * @returns Promise que resuelve con la respuesta HTTP
   * @example
   * ```typescript
   * const updatedUser = await client.put<User>('/users/123', {
   *   id: 123,
   *   name: 'John Doe Updated',
   *   email: 'john.updated@example.com'
   * });
   * ```
   */
  async put<T = any>(url: string, data?: any, options: Omit<HttpRequestOptions, 'method' | 'body'> = {}): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...options, method: 'PUT', body: data });
  }

  /**
   * Realiza una petición DELETE (eliminación de recurso)
   * @template T - Tipo esperado de los datos de respuesta
   * @param url - URL del recurso a eliminar
   * @param options - Opciones adicionales (excluye method y body)
   * @returns Promise que resuelve con la respuesta HTTP
   * @example
   * ```typescript
   * const response = await client.delete('/users/123');
   * if (response.ok) {
   *   console.log('Usuario eliminado exitosamente');
   * }
   * ```
   */
  async delete<T = any>(url: string, options: Omit<HttpRequestOptions, 'method' | 'body'> = {}): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }

  /**
   * Realiza una petición PATCH (actualización parcial de recurso)
   * @template T - Tipo esperado de los datos de respuesta
   * @param url - URL del recurso a actualizar
   * @param data - Datos parciales del recurso a actualizar
   * @param options - Opciones adicionales (excluye method y body)
   * @returns Promise que resuelve con la respuesta HTTP
   * @example
   * ```typescript
   * const updatedUser = await client.patch<User>('/users/123', {
   *   name: 'New Name' // Solo actualiza el nombre
   * });
   * ```
   */
  async patch<T = any>(url: string, data?: any, options: Omit<HttpRequestOptions, 'method' | 'body'> = {}): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...options, method: 'PATCH', body: data });
  }
}


/**
 * Instancia por defecto del cliente HTTP configurada para la API
 * @constant httpClient
 * @example
 * ```typescript
 * import { httpClient } from 'src/utils/http';
 *
 * const response = await httpClient.get('/users');
 * ```
 */
import { getFullUrl } from '../consts';

export const httpClient = new HttpClient({
  baseURL: '', // Usamos getFullUrl para construir URLs completas
});

/**
 * Función helper para hacer peticiones HTTP rápidas
 * @template T - Tipo esperado de los datos de respuesta
 * @param url - URL de la petición (puede ser relativa o absoluta)
 * @param options - Opciones de la petición
 * @returns Promise que resuelve con la respuesta HTTP estructurada
 * @throws {Error} Si la petición excede el timeout configurado
 * @throws {Error} Si hay un error de red o conexión
 * @example
 * ```typescript
 * // GET request
 * const users = await http<User[]>('/users');
 *
 * // POST request
 * const newUser = await http<User>('/users', {
 *   method: 'POST',
 *   body: { name: 'John Doe' }
 * });
 *
 * // Con headers personalizados
 * const response = await http('/protected', {
 *   headers: { 'Authorization': 'Bearer token' }
 * });
 * ```
 */
export async function http<T = any>(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
  // Construir URL completa usando getFullUrl si la URL es relativa
  const fullUrl = url.startsWith('http') ? url : getFullUrl(url);
  return httpClient.request<T>(fullUrl, options);
}

/**
 * Funciones shorthand para cada método HTTP
 */

/**
 * Realiza una petición GET usando la función helper http
 * @template T - Tipo esperado de los datos de respuesta
 * @param url - URL de la petición
 * @param options - Opciones adicionales (excluye method y body)
 * @returns Promise que resuelve con la respuesta HTTP
 */
export const httpGet = <T = any>(url: string, options?: Omit<HttpRequestOptions, 'method' | 'body'>) =>
  http<T>(url, { ...options, method: 'GET' });

/**
 * Realiza una petición POST usando la función helper http
 * @template T - Tipo esperado de los datos de respuesta
 * @param url - URL de la petición
 * @param data - Datos a enviar en el cuerpo de la petición
 * @param options - Opciones adicionales (excluye method y body)
 * @returns Promise que resuelve con la respuesta HTTP
 */
export const httpPost = <T = any>(url: string, data?: any, options?: Omit<HttpRequestOptions, 'method' | 'body'>) =>
  http<T>(url, { ...options, method: 'POST', body: data });

/**
 * Realiza una petición PUT usando la función helper http
 * @template T - Tipo esperado de los datos de respuesta
 * @param url - URL de la petición
 * @param data - Datos completos del recurso a actualizar
 * @param options - Opciones adicionales (excluye method y body)
 * @returns Promise que resuelve con la respuesta HTTP
 */
export const httpPut = <T = any>(url: string, data?: any, options?: Omit<HttpRequestOptions, 'method' | 'body'>) =>
  http<T>(url, { ...options, method: 'PUT', body: data });

/**
 * Realiza una petición DELETE usando la función helper http
 * @template T - Tipo esperado de los datos de respuesta
 * @param url - URL del recurso a eliminar
 * @param options - Opciones adicionales (excluye method y body)
 * @returns Promise que resuelve con la respuesta HTTP
 */
export const httpDelete = <T = any>(url: string, options?: Omit<HttpRequestOptions, 'method' | 'body'>) =>
  http<T>(url, { ...options, method: 'DELETE' });

/**
 * Realiza una petición PATCH usando la función helper http
 * @template T - Tipo esperado de los datos de respuesta
 * @param url - URL del recurso a actualizar
 * @param data - Datos parciales del recurso a actualizar
 * @param options - Opciones adicionales (excluye method y body)
 * @returns Promise que resuelve con la respuesta HTTP
 */
export const httpPatch = <T = any>(url: string, data?: any, options?: Omit<HttpRequestOptions, 'method' | 'body'>) =>
  http<T>(url, { ...options, method: 'PATCH', body: data });

export default httpClient;