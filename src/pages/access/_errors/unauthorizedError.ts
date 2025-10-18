import { AppError } from "src/errors/appError";

export class UnauthorizedError extends AppError {
  constructor(message: string = "No autorizado.") {
    super(message, { status: 401, code: 'UNAUTHORIZED' });
    this.name = "UnauthorizedError";
  }
}