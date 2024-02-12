import mongoose from "mongoose";
import config from "../config.js";

export default class MongoSingleton {
    static #instance;

    constructor() {
        this.#connectMongoDB();
    }

    // Implementación Singleton
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
            console.log("Conectado con éxito a MongoDB usando Mongoose.");
        } catch (error) {
            console.error("No se pudo conectar a la BD usando Mongoose:", error);
            // Aquí podrías intentar reconectar automáticamente después de un tiempo determinado
        }
    }
};
