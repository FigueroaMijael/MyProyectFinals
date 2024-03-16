import mongoose from "mongoose";
import config from "../config.js";
import CustomError from '../Errors/customError/customError.js';
import { EErrors } from '../Errors/customError/errors-enum.js'

const prodLogger = console;
const devLogger = console;

export default class MongoSingleton {
    static #instance;

    constructor() {
        this.#connectMongoDB();
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new MongoSingleton();
        }
        return this.#instance;
    }

    #connectMongoDB = async () => {
        try {
            await mongoose.connect(config.urlMongo, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            // Log de información de conexión exitosa a MongoDB
            prodLogger.info("Conectado con éxito a MongoDB usando Mongoose.");
            devLogger.info("Conectado con éxito a MongoDB usando Mongoose.");
        } catch (error) {
            // Manejo de error al no poder conectar a MongoDB
            CustomError.createError({
                name: "MongoDBConnectionError",
                cause: error,
                message: "No se pudo conectar a la base de datos MongoDB usando Mongoose.",
                code: EErrors.DATABASE_ERROR,
                logger: prodLogger.error // Usar el logger de producción para este tipo de error
            });
            process.exit(); // Salir del proceso en caso de error
        }
    };
}
