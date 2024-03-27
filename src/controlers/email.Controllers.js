// controllers/emailController.js
import nodemailer from "nodemailer";
import config from "../config/config.js";
import { prodLogger, devLogger } from "../config/logger/logger.js"
import { EErrors } from '../config/Errors/customError/errors-enum.js';
import { userService } from "../services/service.js";
import { generateResetToken }  from "../../utils.js";

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

export const sendEmailFinalyPurchase = (req, res, next) => {
    try {
        logger.info("Enviando correo de confirmación de compra");

        const userEmail = req.user ? req.user.email : null;

        const { purchaseId, totalAmount } = req.body;

        const mailOptions = {
            from: "ecommers gigabyte Test - " + config.gmailAccount,
            to: userEmail,
            subject: 'Correo de confirmación de compra',
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
                const errorData = {
                    name: "EmailControllerError",
                    cause: "Error al enviar correo electrónico de confirmación de compra" ,
                    message: "Error al enviar correo electrónico",
                    code: EErrors.EMAIL_ERROR
                };
                throw errorData
            } else {
                req.logger.info('Correo electrónico de confirmación enviado con éxito');
                res.status(200).json({ status: "success", payload: info});
            }
        });
    } catch (error) {
        next(error);
    }
};


export const sendEmailUpdatePassword = async (req, res, next) => {
    try {
        logger.info("Enviando correo de cambio de contraseña");

        const { email } = req.body;

        const user = await userService.findByUsername(email)

        if (!user) {
            const error = {
                name: "User not found",
                cause: "Usuario no encontrado con username: " + email,
                code: EErrors.NOT_FOUND,
                message: "User Not Found"
            };
            throw error;
        }

        if (user) {
            const resetToken = generateResetToken(); 
            const resetLink = `${req.protocol}://${req.get('host')}/updatePassword/reset?token=${resetToken}&uid=${user._id}`;

            const mailOptions = {
                from: "ecommers gigabyte Test - " + config.gmailAccount,
                to: email,
                subject: 'Recuperación de contraseña',
                html: `
                    <h1>Recuperación de contraseña</h1>
                    <p>Haga clic en el siguiente enlace para restablecer su contraseña:</p>
                    <a href="${resetLink}">Restablecer contraseña</a>
                `,
                
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    const errorData = {
                        name: "EmailControllerError",
                        cause: "Error al enviar correo electrónico para resetear la contraseña",
                        message: "Error al enviar correo electrónico",
                        code: EErrors.EMAIL_ERROR
                    };
                    throw errorData;
                } else {
                    res.status(200).json({ message: "Correo electrónico enviado correctamente", payload: info });
                }
            });
        }
    } catch (error) {
        next(error);
    }
};