import winston from "winston";
import config from "../config/config.js";

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
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.colorize({ all: true })
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'warn',
            format: winston.format.uncolorize()
        })
    ]
});

const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.colorize({ all: true })
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'warn',
            format: winston.format.uncolorize()
        })
    ]
});

const customErrorMiddleware = (error, req, res, next) => {
    const logger = config.environment === 'production' ? prodLogger : devLogger;

    const errorData = {
        name: error.name || "Fatal",
        cause: error.cause || "Error interno del servidor",
        code: error.code || 500,
        message: error.message || "Internal server error",
    };

    logger.error(`${req.method} en ${req.url} - Causa del error: ${errorData.cause} - Code error: ${errorData.code} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);

    res.status(errorData.code).json({
        error: {
            cause: errorData.cause,
            message: errorData.message,
            code: errorData.code,
        }
    });
};


export { customErrorMiddleware, devLogger, prodLogger };
