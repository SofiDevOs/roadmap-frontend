import { UserOrEmailAlreadyExistsError } from "src/pages/access/_errors/userOrEmailAlreadyExists";
import { AppError } from "./appError";
import { UnauthorizedError } from "src/pages/access/_errors/unauthorizedError";

const ERROR_MAP = {
    409: UserOrEmailAlreadyExistsError,
    401: UnauthorizedError,
} as const;

export function registerError(status: number): void {
    const errorName = ERROR_MAP[status as keyof typeof ERROR_MAP] || AppError;
    throw new errorName();
}