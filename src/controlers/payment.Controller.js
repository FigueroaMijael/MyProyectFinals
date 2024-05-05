import { MercadoPagoConfig, Preference } from 'mercadopago';
import config from '../config/config.js';

const client = new MercadoPagoConfig({ accessToken: config.mpAccessTokenTest });

const createPreference = async (req, res) => {
    console.log(`Intentando realizar un pago con el carrito id: `);
    try {
        const products = req.body.products.map(product => ({
            title: product.title,
            quantity: product.quantity,
            unit_price: product.price,
            currency_id: "ARS",
        }));

        const totalAmount = req.body.totalAmount;

        const preferenceData = {
            items: products,
            back_urls: {
                success: "https://mail.google.com/mail/u/0/#inbox",
                failure: "https://www.youtube.com/",
                pending: "https://translate.google.com/",
            },
            auto_return: "approved",
            totalAmount: totalAmount,
        };


        const preference = new Preference(client);
        const result = await preference.create({ body: preferenceData });

        res.json({
            id: result.id
        });
    } catch (error) {
        res.status(500).json({
            error: "Error al crear la preferencia :("
        });
    }
}

export default createPreference;