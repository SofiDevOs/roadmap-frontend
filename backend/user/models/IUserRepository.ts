import { User } from "./UserModel";

export interface interfaceUserRepository {
  create(user: User): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByUserName(name: string): Promise<User | null>;
}


