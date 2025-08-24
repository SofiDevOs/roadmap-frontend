import { HttpError } from "../../error/httpError";

export class EmailOrUsernameAlreadyExistsError extends HttpError {
  constructor(message: string) {
    super(message, 409);
    this.name = "EmailOrUsernameAlreadyExistsError";
  }
}
