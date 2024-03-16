// controllers/emailController.js
import nodemailer from "nodemailer";
import config from "../config/config.js";
import CustomError from '../config/Errors/customError/customError.js';
import { EErrors } from '../config/Errors/customError/errors-enum.js';
import  __dirname  from "../../utils.js";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword
    }
});

transporter.verify(function (error, success) {
    if (error) {
        CustomError.createError({ name: "EmailControllerError", cause: error, message: "Error al verificar el servidor de correo", code: EErrors.SERVER_ERROR, logger: console });
    } else {
        console.info('Server is ready to take our messages');
    }
});

export const sendEmail = (req, res) => {
    try {
        const userEmail = req.user ? req.user.email : null;
        const { purchaseId, totalAmount } = req.body;

        const mailOptions = {
            from: "ecommers gigabyte Test - " + config.gmailAccount,
            to: userEmail,
            subject: 'Correo de prueba de la finalización de la compra',
            html: `
                <h1>¡Gracias por tu compra!</h1>
                <p>Detalles de la compra:</p>
                <ul>
                    <li>ID de la compra: ${purchaseId}</li>
                    <li>Precio total de la compra: ${totalAmount}</li>
                </ul>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                CustomError.createError({ name: "EmailControllerError", cause: error, message: "Error al enviar correo electrónico", code: EErrors.EMAIL_ERROR, logger: console });
            } else {
                console.info('Message sent: %s', info.messageId);
                res.send({ message: "Correo electrónico enviado correctamente", payload: info });
            }
        });
    } catch (error) {
        CustomError.createError({ name: "EmailControllerError", cause: error, message: "Error al enviar correo electrónico", code: EErrors.EMAIL_ERROR, logger: console });
    }
};
