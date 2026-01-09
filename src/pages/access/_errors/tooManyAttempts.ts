import { AppError } from "src/errors/appError";

export class TooManyAttemptsError extends AppError {
  constructor(message: string = "Has excedido el número de intentos permitidos. Intenta nuevamente más tarde.") {
    super(message, { status: 429, code: 'UNAUTHORIZED' });
    this.name = "UnauthorizedError";
  }
}
