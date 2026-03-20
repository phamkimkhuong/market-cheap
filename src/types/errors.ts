export class AppError extends Error {
    readonly code: string;
    readonly status: number;
    readonly details?: unknown;

    constructor(message: string, code = 'APP_ERROR', status = 500, details?: unknown) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.status = status;
        this.details = details;
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: unknown) {
        super(message, 'VALIDATION_ERROR', 422, details);
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends AppError {
    constructor(message: string, details?: unknown) {
        super(message, 'NOT_FOUND', 404, details);
        this.name = 'NotFoundError';
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string, details?: unknown) {
        super(message, 'UNAUTHORIZED', 401, details);
        this.name = 'UnauthorizedError';
    }
}

export class ConfigurationError extends AppError {
    constructor(message: string, details?: unknown) {
        super(message, 'CONFIGURATION_ERROR', 500, details);
        this.name = 'ConfigurationError';
    }
}

export class ApiRouteError extends AppError {
    constructor(message: string, status = 500, details?: unknown) {
        super(message, 'API_ROUTE_ERROR', status, details);
        this.name = 'ApiRouteError';
    }
}
