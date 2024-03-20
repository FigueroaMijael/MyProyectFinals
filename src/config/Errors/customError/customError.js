export default class CustomError extends Error {
    constructor(message, name, cause, code) {
        super(message);
        this.name = name;
        this.cause = cause;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);

    }

    toString() {
        return `${this.name}[${this.code}]: ${this.message}`;
    }

    static createError(errorData) {
        console.error(errorData);
    }
}

