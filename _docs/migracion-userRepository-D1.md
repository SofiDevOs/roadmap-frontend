# Migración del repositorio de usuarios a D1 (Cloudflare)

## Comparativa Antes vs Después

---

### Antes: Almacenamiento en Memoria

- Los usuarios se almacenaban en un array privado dentro de la clase `UserRepository`.
- Todas las operaciones (crear, buscar, actualizar, eliminar) manipulaban ese array.
- Los datos se perdían al reiniciar el servidor.
- Ejemplo:

```typescript
private users: User[] = [ ... ];

async create(user: User): Promise<void> {
  this.users.push(user);
}

async findById(id: string): Promise<User | null> {
  return this.users.find((user) => user.id === id) || null;
}
// ...etc
```

---

### Después: Integración con D1 (Cloudflare)

- El repositorio recibe una instancia de la base de datos D1 (`D1Database`) en el constructor.
- Todas las operaciones usan consultas SQL sobre la base de datos D1.
- Los datos son persistentes y accesibles desde cualquier Worker.
- Ejemplo:

```typescript
private db: D1Database;

constructor(db: D1Database) {
  this.db = db;
}

async create(user: User): Promise<void> {
  await this.db.prepare(
    `INSERT INTO users (id, username, fullname, email, password, emailVerified) VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(...).run();
}

async findById(id: string): Promise<User | null> {
  const result = await this.db.prepare(`SELECT * FROM users WHERE id = ?`).bind(id).first();
  return result ? this.mapRowToUser(result) : null;
}
// ...etc
```

---

## Beneficios del Cambio
- Persistencia de datos.
- Escalabilidad y acceso concurrente.
- Integración directa con Cloudflare Workers y D1.
- Código más alineado con buenas prácticas de backend moderno.

## Consideraciones
- Se agregó una declaración global para el tipo `D1Database` para desarrollo local:
  ```typescript
  declare type D1Database = any;
  ```
- Es necesario crear la tabla `users` en la base de datos D1.
- El resto de la arquitectura (servicios, controladores) puede seguir igual, pero ahora usan el repositorio con D1.

---

**Directorio:** `/backend/user/repositories/userRepository.ts`
**Fecha de migración:** 2025-09-02
