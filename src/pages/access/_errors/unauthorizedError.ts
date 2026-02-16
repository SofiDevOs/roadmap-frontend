import { AppError } from "src/errors/appError";

export class UnauthorizedError extends AppError {
  constructor(message: string = "Credenciales inválidas. Acceso no autorizado.") {
    super(message, { status: 401, code: 'UNAUTHORIZED' });
    this.name = "UnauthorizedError";
  }
}
