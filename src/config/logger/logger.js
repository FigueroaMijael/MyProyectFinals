import winston from "winston";
import config from "../config.js";
import CustomError from "../Errors/customError/customError.js";
import {EErrors} from '../Errors/customError/errors-enum.js'

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        http: 3,
        info: 4,
        debug: 5
    }
};

// Configuración del logger para producción
const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'warn',
            format: winston.format.simple()
        })
    ]
});

// Configuración del logger para desarrollo
const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

const errorHandlerMiddleware = (error, req, res, next) => {
    console.error("Información del error en errorHandlerMiddleware:", error);

    if (config.environment === 'production') {
        req.logger = prodLogger;
    } else {
        req.logger = devLogger;
    }

    // Verificar si el error es una instancia de CustomError
    if (error instanceof CustomError) {
        req.logger.error(`${error.name}: ${error.message || 'Error desconocido'}`);
        if (error.cause) {
            req.logger.error(`Causa: ${error.cause.message || 'Causa desconocida'}`);
        }
        res.status(error.code || 500).json({ error: error.message || 'Error desconocido' });
    } else {
        // Manejar otros tipos de errores
        req.logger.error(error.stack || 'Error desconocido'); // Aquí se cambió para evitar 'undefined: Error desconocido'
        res.status(500).json({ error: 'Internal server error' });
    }

    next();
};

export { errorHandlerMiddleware, devLogger, prodLogger };
