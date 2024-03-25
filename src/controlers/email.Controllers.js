// controllers/emailController.js
import nodemailer from "nodemailer";
import config from "../config/config.js";
import CustomError from '../config/Errors/customError/customError.js';
import { EErrors } from '../config/Errors/customError/errors-enum.js';
import { userService } from "../services/service.js";
import  __dirname, { generateResetToken, verifyResetToken }  from "../../utils.js";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        type: 'OAuth2',
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

export const sendEmailFinalyPurchase = (req, res) => {
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


export const sendEmailUpdatePassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userService.findByUsername(email);

        if (user) {
            const resetToken = generateResetToken(); 
/*             const tokenVerify = verifyResetToken(resetToken)
    
            if (tokenVerify) {
                return res.status(500).send({ status: "error", error: "El token no es valido" });
            } */
            
            const resetLink = `${req.protocol}://${req.get('host')}/updatePassword/reset?token=${resetToken}`;

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
                    CustomError.createError({ name: "EmailControllerError", cause: error, message: "Error al enviar correo electrónico", code: EErrors.EMAIL_ERROR, logger });
                    res.status(500).json({ error: "Ha ocurrido un error al enviar el correo electrónico." });
                } else {
                    console.info('Message sent: %s', info.messageId);
                    res.status(200).json({ message: "Correo electrónico enviado correctamente", payload: info });
                }
            });
        } else {
            res.status(404).json({ error: "El correo electrónico no existe en la base de datos." });
        }
    } catch (error) {
        console.error('Error al buscar el usuario:', error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};