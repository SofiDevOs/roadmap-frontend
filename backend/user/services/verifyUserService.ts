import { UserRepository } from '../repositories/userRepository';
import { jwtVerify } from "jose";
import { JWT_SECRET } from '../../../src/config';
import { InvalidTokenError } from '../errors';
import { JOSEError } from 'jose/errors';

export class VerifyUserService {
  constructor(private readonly repository: UserRepository) {}

  async execute(token: string): Promise<void> {
    
    const secret = new TextEncoder().encode(JWT_SECRET);

    try {
      const { payload } = await jwtVerify(token, secret);
      const userEmail = payload.email as string;
      const user =  await this.repository.findByEmail(userEmail);
        
      if (!user) throw new Error("User not found");

      const newUser = {
        ...user,
        emailVerified: true,
      }

      await this.repository.update(newUser);

    } catch (error) {
      if (error instanceof JOSEError) throw new InvalidTokenError();
      throw error;
    }
    
  }
}
