import { UserOrEmailAlreadyExistsError } from "src/pages/access/_errors/userOrEmailAlreadyExists";
import { AppError } from "./appError";
import { InvalidCredentialsError } from "@pages/access/_errors/invalidCredentialsError";
import { TooManyAttemptsError } from "@pages/access/_errors/tooManyAttempts";

const ERROR_MAP = {
    409: UserOrEmailAlreadyExistsError,
    401: InvalidCredentialsError,
    429: TooManyAttemptsError,
} as const;

export function registerError(status: number): void {
    const errorName = ERROR_MAP[status as keyof typeof ERROR_MAP] || AppError;
    throw new errorName();
}
