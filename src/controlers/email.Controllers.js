import nodemailer from "nodemailer";
import config from "../config/config.js";
import __dirname from "../../utils.js";

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
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
})



export const sendEmail = (req, res) => {
    try {

        const userEmail = req.user ? req.user.email : null;

const mailOptions = {
    from: "ecommers gigabyte Test - " + config.gmailAccount,
    to: userEmail,
    subject: 'Correo de prueba de la finalización de la compra',
    html: `
        <h1>¡Gracias por tu compra!</h1>
        <p>Detalles de la compra:</p>
        <ul>
            <li>ID de la compra: ${req.body._id}</li>
            <li>Producto: ${req.body.title}</li>
            <li>Precio: ${req.body.price}</li>
            <li>Precio total de la compra: ${req.body.totalAmount}</li>
        </ul>
    `,
};

        let result = transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ message: "Error", payload: error });
            }
            console.log('Message sent: %s', info.messageId);
            res.send({ message: "Success", payload: info })
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
}
