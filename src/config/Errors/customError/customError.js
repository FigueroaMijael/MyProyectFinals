export default class CustomError extends Error {

    static createError(errorData) {
        const { name, cause, code } = errorData;
        const error = new CustomError( name, cause, code);
        throw error;
    }
}

