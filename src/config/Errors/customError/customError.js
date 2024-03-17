export default class CustomError {
    static createError({ name, cause, message, code, logger }) {
        const errorMessage = message || 'Error desconocido';
        const error = new Error(errorMessage);
        error.name = name;
        error.code = code;
        error.message = errorMessage;
        error.cause = cause ? new Error(cause) : null;

        // Asegurarse de usar el logger proporcionado
        if (logger) {
            logger.error(`${error.stack || error.message}`);
        }

        // Lanzar el error
        throw error;
    }
}
