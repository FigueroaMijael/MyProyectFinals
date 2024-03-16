export default class CustomError {
    static createError({ name, cause, message, code, logger }) {
        const error = new Error(message);
        error.name = name;
        error.code = code;
        error.cause = cause ? new Error(cause) : null;

        if (logger) {
            logger.error(`Error: ${message}`);
            if (cause) {
                logger.error(cause);
            }
        }

        throw error;
    }
}