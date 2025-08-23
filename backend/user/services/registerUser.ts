import bcrypt from "bcryptjs";
import {SignJWT} from "jose";
import type { RegisterUserDTO } from "../dtos/RegisterUserDTO";
import type { UserResponseDTO } from "../dtos/UserResponseDTO";
import { User } from "../models/UserModel";
import { UserRepository } from "../repositories/userRepository";
import { isValidEmail } from "../../shared/emailValidator";
import { InvalidEmailError } from "../errors/invalidEmailError";
import { EmailOrUsernameAlreadyExistsError } from "../errors/EmailOrUsernameAlreadyExistsError";

export class createUserService {
  constructor(private readonly repository: UserRepository) {}

  async execute(user: RegisterUserDTO, env: ImportMetaEnv): Promise<UserResponseDTO> {
    if (!isValidEmail(user.email) || user.password.length < 8)
      throw new InvalidEmailError("El email no es válido.");

    const existingUser = await this.repository.findByEmail(user.email);
    if (existingUser)
      throw new EmailOrUsernameAlreadyExistsError(
        "El email o username ya están en uso.",
      );

    const hash = await bcrypt.hash(user.password, 10);

    const userToCreate = new User(
      user.username,
      user.fullname,
      user.email,
      hash,
    );

    await this.repository.create(userToCreate);

    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const token  = await new SignJWT({
        username: user.username,
        email: user.email,
        type: "email_verification",
      },)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);
   
    return {
      id: userToCreate?.id,
      username: userToCreate.username,
      fullname: userToCreate.fullname,
      email: userToCreate.email,
      token,
    };
  }
}
