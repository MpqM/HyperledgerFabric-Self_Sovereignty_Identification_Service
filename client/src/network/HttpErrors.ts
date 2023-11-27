class HttpError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class UnauthorizedError extends HttpError { }

export class ConflictError extends HttpError { }

export class InternalError extends HttpError { }
