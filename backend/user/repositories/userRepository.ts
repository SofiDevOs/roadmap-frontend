import { User } from "../models/UserModel";
import type { interfaceUserRepository } from "../models/IUserRepository";

export class UserRepository implements interfaceUserRepository {
  private users: User[] = [
    {
      id: "d9f1d73d-61ba-406f-a5f1-0cf18a161352", // este es un urser de ejemplo
      username: "testuser",
      fullname: "Test User",
      email: "testemail",
      password: "hashedpassword",
      emailVerified: false,
    }
  ];

  constructor() {}

  async create(user: User): Promise<void>  {

    const users = this.users;
    users.push(user);


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
