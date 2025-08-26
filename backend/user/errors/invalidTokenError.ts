import { HttpError } from "../../error/httpError";

export class InvalidTokenError extends HttpError {

  constructor(message: string = "Invalid or expired token.") {

    super(message, 401);
    this.name = "InvalidTokenError";
  }
}
