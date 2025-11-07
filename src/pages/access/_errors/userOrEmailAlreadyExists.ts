import { AppError } from "src/errors/appError";

export class UserOrEmailAlreadyExistsError extends AppError {
  constructor(message: string = "El nombre de usuario o correo electrónico ya existe.") {
    super(message, { status: 409, code: 'USER_OR_EMAIL_ALREADY_EXISTS' });
    this.name = "UserOrEmailAlreadyExistsError";
  }
}