import { AppError } from "src/errors/appError";

export class InvalidCredentialsError extends AppError {
  constructor(message: string = "Credenciales inválidas") {
    super(message, { status: 401, code: 'UNAUTHORIZED' });
    this.name = "UnauthorizedError";
  }
}
