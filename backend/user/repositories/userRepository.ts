declare type D1Database = any;
import { User } from "../models/UserModel";
import type { interfaceUserRepository } from "../models/IUserRepository";

export class UserRepository implements interfaceUserRepository {
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

  async findById(id: string): Promise<User | null> {
    const result = await this.db.prepare(`SELECT * FROM users WHERE id = ?`).bind(id).first();
    return result ? this.mapRowToUser(result) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.prepare(`SELECT * FROM users WHERE email = ?`).bind(email).first();
    return result ? this.mapRowToUser(result) : null;
  }

  async findByUserName(name: string): Promise<User | null> {
    const result = await this.db.prepare(`SELECT * FROM users WHERE username = ?`).bind(name).first();
    return result ? this.mapRowToUser(result) : null;
  }

  async delete(id: string): Promise<void> {
    await this.db.prepare(`DELETE FROM users WHERE id = ?`).bind(id).run();
  }

  async update(user: User): Promise<void> {
    await this.db.prepare(
      `UPDATE users SET username = ?, fullname = ?, email = ?, password = ?, emailVerified = ? WHERE id = ?`
    ).bind(
      user.username,
      user.fullname,
      user.email,
      user.password,
      user.emailVerified ? 1 : 0,
      user.id
    ).run();
  }

  async findAll(): Promise<User[]> {
    const { results } = await this.db.prepare(`SELECT * FROM users`).all();
    return results.map(this.mapRowToUser);
  }

  private mapRowToUser(row: any): User {
    return new User(
      row.username,
      row.fullname,
      row.email,
      row.password,
      row.id,
      !!row.emailVerified
    );
  }
}
