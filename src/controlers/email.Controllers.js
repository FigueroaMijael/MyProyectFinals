import transporter from "../utils/email.js";
import config from "../config/config.js";
import { prodLogger, devLogger } from "../utils/logger.js"
import { EErrors } from '../utils/customLogger/errors-enum.js';
import { userService } from "../services/service.js";
import { generateResetToken }  from "../utils/jwt.js";

const logger = config.environment === 'production' ? prodLogger : devLogger;

const sendEmailFinalyPurchase = (req, res, next) => {
    try {
        logger.info("Enviando correo de confirmación de compra");

        const userEmail = req.user.email; 

        const mailOptions = {
            from: "ecommers gigabyte Test - " + config.gmailAccount,
            to: userEmail,
            subject: 'Correo de confirmación de compra',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <h1 style="color: #333;">¡Gracias por tu compra!</h1>
                    <p>Detalles de la compra:</p>
                    <ul>
                        ${req.body.products.map(product => `
                            <li><strong>${product.title}</strong>: Cantidad: ${product.quantity}, Precio: ${product.price}</li>
                        `).join('')}
                    </ul>
                    <p style="font-size: 16px; font-weight: bold;">Precio total de la compra: ${req.body.totalAmount}</p>
                </div>
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
                throw errorData;
            } else {
                req.logger.info('Correo electrónico de confirmación enviado con éxito');
                res.status(200).json({ status: "success", payload: info });
            }
        });
    } catch (error) {
        next(error);
    }
};



 const sendEmailUpdatePassword = async (req, res, next) => {
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

const sendInactiveUserNotification = async (email) => {
};

export default {
    sendEmailFinalyPurchase,
    sendEmailUpdatePassword,
    sendInactiveUserNotification
}