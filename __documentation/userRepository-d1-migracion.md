# Migración de UserRepository a Cloudflare D1

## Comparativa Antes vs Después

---

## Antes: Almacenamiento en Memoria

- Los usuarios se almacenaban en un array local dentro de la clase `UserRepository`.
- Todas las operaciones (crear, buscar, actualizar, eliminar) manipulaban ese array.
- Los datos se perdían al reiniciar el servidor.
- Ejemplo:

```typescript
private users: User[] = [
  {
    id: "d9f1d73d-61ba-406f-a5f1-0cf18a161352",
    username: "testuser",
    fullname: "Test User",
    email: "testemail",
    password: "hashedpassword",
    emailVerified: false,
  }
];

async create(user: User): Promise<void> {
  this.users.push(user);
}
```

---

## Después: Integración con Cloudflare D1

- Los usuarios se almacenan en una base de datos SQL gestionada por Cloudflare D1.
- Todas las operaciones usan consultas SQL sobre la base de datos.
- Los datos persisten y son accesibles desde cualquier instancia del Worker.
- El repositorio recibe el binding de la base de datos en el constructor:

```typescript
private db: D1Database;

constructor(db: D1Database) {
  this.db = db;
}

async create(user: User): Promise<void> {
  await this.db.prepare(
    `INSERT INTO users (id, username, fullname, email, password, emailVerified) VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(
    user.id,
    user.username,
    user.fullname,
    user.email,
    user.password,
    user.emailVerified ? 1 : 0
  ).run();
}
```

---

## Ventajas de la Migración

- **Persistencia real:** Los datos no se pierden al reiniciar.
- **Escalabilidad:** Acceso concurrente y seguro desde múltiples Workers.
- **Consultas SQL:** Mayor flexibilidad y potencia para búsquedas y operaciones.
- **Preparado para producción:** Compatible con despliegues en Cloudflare.

---

## Consideraciones

- Se agregó la declaración global `declare type D1Database = any;` para desarrollo local.
- Es necesario crear la tabla `users` en D1 usando un archivo `schema.sql` y el comando `wrangler d1 execute`.
- El binding de la base de datos se configura en `wrangler.toml`.

---

## Resumen

La migración transforma el repositorio de un almacenamiento temporal en memoria a una solución persistente y escalable usando Cloudflare D1, mejorando la robustez y preparación para producción del backend.
