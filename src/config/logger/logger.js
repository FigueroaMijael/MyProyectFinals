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

export const addLogger = (req, res, next) => {
    if (config.environment === 'production') {
        req.logger = prodLogger;
    } else {
        req.logger = devLogger;
    }

    req.logger.info(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);

    res.errorHandler = (error) => {
        CustomError.createError({
            name: "CustomErrorHandler",
            cause: error,
            message: "Internal server error",
            code: EErrors.DATABASE_ERROR,
            logger: req.logger // Pasar el logger adjunto en la solicitud
        });
    };

    next();
};