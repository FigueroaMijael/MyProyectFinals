import winston from 'winston';
import EErrors from './errors-enum.js';

export default (error, req, res, next) => {
    const logger = req.logger || winston.createLogger(); // Inicializar el logger si no está disponible en la solicitud
    logger.error("Error detectado entrando al Error Handler");
    logger.error(error.cause);
    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            res.status(400).send({ status: "error", error: error.message });
            break;
        default:
            res.status(500).send({ status: "error", error: "Unhandled error!" });
    }
    next()
};