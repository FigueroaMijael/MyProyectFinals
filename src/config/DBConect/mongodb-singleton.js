import mongoose from "mongoose";
import config from "../config.js";
import { prodLogger, devLogger } from "../../utils/logger.js";

const logger = config.environment === 'production' ? prodLogger : devLogger;

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

    #connectMongoDB = async (next) => {
        try {
            await mongoose.connect(config.urlMongo);
            logger.info("Conectado con éxito a MongoDB usando Mongoose.");
        } catch (error) {
           next(error)
        }
    };
}
