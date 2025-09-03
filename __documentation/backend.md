# Backend - Roadmap Frontend

## Arquitectura General

Este backend implementa una **arquitectura por capas** para el manejo de usuarios, con un patrón de **repositorio** y **servicios**. Está diseñado para funcionar dentro de un proyecto Astro como API endpoints.

## Estructura del Proyecto

```
backend/
├── error/
│   └── httpError.ts          # Clase base para errores HTTP
├── shared/
│   ├── emailValidator.ts     # Validador de emails
│   └── messages.ts           # Mensajes de respuesta
└── user/
    ├── controllers/
    │   └── userController.ts # Controlador de usuarios
    ├── dependencies.ts       # Inyección de dependencias
    ├── dtos/                 # Data Transfer Objects
    ├── errors/               # Errores específicos de usuario
    ├── models/
    │   ├── IUserRepository.ts # Interfaz del repositorio
    │   └── UserModel.ts      # Modelo de usuario
    ├── repositories/
    │   └── userRepository.ts # Implementación del repositorio
    └── services/
        ├── registerUser.ts   # Servicio de registro
        └── verifyUserService.ts # Servicio de verificación
```

## Componentes Principales

### 1. **Modelo de Usuario (`UserModel.ts`)**

```typescript
export class User {
  constructor(
    readonly username: string,
    readonly fullname: string,
    readonly email: string,
    readonly password: string,
    readonly id?: string,
    readonly emailVerified: boolean = false,
  ) {
    this.id = crypto.randomUUID(); // Genera ID único automáticamente
  }
}
```

**Características:**
- Genera un ID único automáticamente usando `crypto.randomUUID()`
- Propiedades inmutables (`readonly`)
- Campo `emailVerified` para verificación de email

### 2. **Repositorio de Usuarios (`userRepository.ts`)**

Implementa la interfaz `IUserRepository` y maneja el almacenamiento en memoria de usuarios.

**Métodos principales:**
- `create(user: User)`: Agrega un nuevo usuario
- `findById(id: string)`: Busca usuario por ID
- `findByEmail(email: string)`: Busca usuario por email
- `findByUserName(name: string)`: Busca usuario por username
- `delete(id: string)`: Elimina usuario por ID
- `update(user: User)`: Actualiza usuario existente
- `findAll()`: Retorna todos los usuarios

**Nota:** Actualmente usa almacenamiento en memoria con un usuario de ejemplo predefinido.

### 3. **Servicio de Registro (`registerUser.ts`)**

Maneja la lógica de negocio para crear nuevos usuarios.

**Proceso:**
1. **Validación**: Verifica email válido y contraseña de al menos 8 caracteres
2. **Verificación de duplicados**: Comprueba si el email ya existe
3. **Encriptación**: Hash de la contraseña con bcrypt (10 rounds)
4. **Creación**: Crea nuevo usuario en el repositorio
5. **Token JWT**: Genera token para verificación de email (1h de expiración)

**Retorna:** `UserResponseDTO` con datos del usuario y token de verificación

### 4. **Servicio de Verificación (`verifyUserService.ts`)**

Maneja la verificación de email de usuarios.

**Funcionalidades:**
- `verify(token: string)`: Verifica token JWT y marca email como verificado
- `sendVerificationEmail(email, token)`: Envía email de verificación usando Resend

**Proceso de verificación:**
1. Decodifica el token JWT
2. Busca el usuario por email
3. Actualiza `emailVerified` a `true`
4. Maneja errores de token inválido

### 5. **Controlador de Usuario (`userController.ts`)**

Maneja las peticiones HTTP y coordina los servicios.

**Endpoints implementados:**

#### POST `/api/register`
- Recibe datos del formulario (`username`, `fullname`, `email`, `password`)
- Valida campos requeridos
- Ejecuta servicio de registro
- Envía email de verificación
- Retorna datos del usuario creado

#### GET `/api/verify?token=...`
- Verifica token de email
- Redirige con mensaje de éxito o error

#### GET `/api/register?test=...` (en desarrollo)
- Endpoint de prueba para obtener usuario por ID

### 6. **Inyección de Dependencias (`dependencies.ts`)**

Configura e instancia todos los servicios y controladores:

```typescript
const userRepository = new UserRepository();
const createUserService = new CreateUserService(userRepository);
const verifyUserService = new VerifyUserService(userRepository);

export const userController = new UserController(
  createUserService,
  verifyUserService,
);
```

## Flujo de Registro Completo

1. **Usuario llena formulario** → POST `/api/register`
2. **Validación de datos** → UserController
3. **Verificación de duplicados** → CreateUserService
4. **Encriptación de contraseña** → bcrypt
5. **Creación de usuario** → UserRepository
6. **Generación de token** → JWT
7. **Envío de email** → Resend API
8. **Respuesta al cliente** → UserResponseDTO

## Flujo de Verificación de Email

1. **Usuario hace clic en enlace** → GET `/api/verify?token=...`
2. **Verificación de token** → VerifyUserService
3. **Actualización de usuario** → `emailVerified = true`
4. **Redirección** → `/access?message=account_verified`

## Manejo de Errores

### Errores Personalizados:
- `EmailOrUsernameAlreadyExistsError`: Email/username duplicado
- `InvalidEmailError`: Email o contraseña inválidos
- `InvalidTokenError`: Token JWT inválido
- `HttpError`: Clase base para errores HTTP

### Respuestas de Error:
- **400**: Campos requeridos faltantes, datos inválidos
- **500**: Error interno del servidor

## Configuración Externa

El backend depende de variables de entorno:
- `JWT_SECRET`: Secreto para firmar tokens JWT
- `RESEND_API_KEY`: API key para envío de emails

## Estado Actual y Limitaciones

### ✅ Implementado:
- Registro de usuarios con validación
- Encriptación de contraseñas
- Verificación de email con JWT
- Manejo de errores personalizado
- Arquitectura modular y escalable

### ⚠️ Limitaciones:
- **Almacenamiento en memoria**: Los datos se pierden al reiniciar
- **Sin persistencia**: No hay base de datos
- **Usuario de ejemplo**: Datos hardcodeados para testing

### 🔄 En desarrollo:
- Endpoint `getUserById` (marcado como "working progress")
- Sistema de autenticación completo
- Migración a base de datos real

## Próximos Pasos Recomendados

1. **Integrar base de datos** (PostgreSQL, MongoDB, etc.)
2. **Implementar autenticación completa** (login, logout, sessions)
3. **Agregar middleware de autorización**
4. **Implementar tests unitarios**
5. **Configurar variables de entorno para producción**