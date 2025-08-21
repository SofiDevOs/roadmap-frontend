import { User } from "../models/UserModel";
import type { interfaceUserRepository } from "../models/IUserRepository";

export class UserRepository implements interfaceUserRepository {
  private users: User[] = [];

  constructor() {}

  async create(user: User): Promise<User>  {
    const users = this.users;
    users.push(user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async findByUserName(name: string): Promise<User | null> {
    return this.users.find((user) => user.username === name) || null;
  }

  async delete(id: string): Promise<void> {
    const users = this.users;

    const newUsers = users.filter((user) => user.id !== id);
    this.users = newUsers;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

}
