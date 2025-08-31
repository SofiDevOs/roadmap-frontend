import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { JWT_SECRET } from "../../../src/config";
import { isValidEmail } from "../../shared/emailValidator";
import type { RegisterUserDTO, UserResponseDTO } from "../dtos";
import { EmailOrUsernameAlreadyExistsError, InvalidEmailError } from "../errors";
import { User } from "../models/UserModel";
import { UserRepository } from "../repositories/userRepository";

export class CreateUserService {
  constructor(private readonly repository: UserRepository) {}

  async execute(user: RegisterUserDTO): Promise<UserResponseDTO> {
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

    const secret = new TextEncoder().encode(JWT_SECRET);
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
