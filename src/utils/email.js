// controllers/emailController.js
import nodemailer from "nodemailer";
import config from "../config/config.js";
import { prodLogger, devLogger } from "../utils/logger.js"
import { EErrors } from '../utils/customLogger/errors-enum.js';


const logger = config.environment === 'production' ? prodLogger : devLogger;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword   
    }
});

transporter.verify(function (error, success, next) {
    try {
        if (error) {
            const errorData = {
                name: "EmailControllerError",
                cause: "No se pudo verificar el servidor de correo",
                message: "Error al verificar el servidor de correo",
                code: EErrors.INTERNAL_SERVER_ERROR
            };
            throw errorData
        } else {
            logger.info('Server is ready to take our messages' + success);
        }
    } catch (error) {
        next(error);
    }
    
});

export default transporter