export class AppError extends Error {
    status: number;
    code: string;
    details: any;
    constructor(message = 'Error interno del servidor', { status = 500, code = 'APP_ERROR', details = null } = {}) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.code = code;
        this.details = details;
        Error.captureStackTrace?.(this, this.constructor);
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            status: this.status,
            details: this.details,
        };
    }
}

export function isAppError(error: any): boolean {
    return error instanceof AppError;
}
