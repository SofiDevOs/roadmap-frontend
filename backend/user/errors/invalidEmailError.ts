import { HttpError } from "../../error/httpError";

export class InvalidEmailError extends HttpError {
  constructor(message: string) {
    super(message, 400);
    this.name = "InvalidEmailError";
  }
}
