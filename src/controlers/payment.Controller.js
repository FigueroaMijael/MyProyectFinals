import { MercadoPagoConfig, Preference } from 'mercadopago';
import config from '../config/config.js';
import {ticketService} from '../services/service.js'
import { devLogger, prodLogger } from '../utils/logger.js'

const logger = config.environment === 'production' ? prodLogger : devLogger;

const client = new MercadoPagoConfig({ accessToken: config.mpAccessTokenTest });

const createPreference = async (req, res) => {
    try {
        const IdempotencyKey = req.headers["X-Idempotency-Key"]

        const products = req.body.products.map(product => ({
            title: product.title,
            quantity: product.quantity,
            unit_price: product.price,
        }));

        const totalAmount = req.body.totalAmount;

        const body = {
            items: products,
            totalAmount: totalAmount,
            back_urls: {
                success: "https://myproyectfinals-production.up.railway.app/",
                failure: "https://www.youtube.com/",
                pending: "https://translate.google.com/",
            },
            auto_return: "approved",
            notification_url: "https://myproyectfinals-production.up.railway.app/api/payments/webhook"
        };

        const preference = new Preference(client);

        const result = await preference.create({ body , IdempotencyKey});

        res.json({
            id: result.id
        });
        
    } catch (error) {
        res.status(500).json({
            error: "Error al crear la preferencia :("
        });
    }
}

const createWebhook = async (req, res) => {
    const paymentId = req.query.id;

    try {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${client.accessToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const ticketObjet = {
                date_created: data.date_created,
                date_approved: data.date_approved,
                collector_id: data.collector_id,
                currency_id: data.currency_id,
                description: data.description,
                order: data.order,
                payer:{
                    id: data.payer.id,
                    email: data.payer.email,
                    first_name: data.payer.first_name,
                    last_name: data.payer.last_name,
                    identification: data.payer.identification,
                    phone: data.payer.phone,
                },
                status: data.status,
                statusDetail: data.status_detail,
                transaction_amount: data.transaction_amount,
            };
            
            await ticketService.save(ticketObjet)

            
        const emailData = {
            products: ticketObjet.description,
            totalAmount: ticketObjet.transaction_amount,
        };


            const emailResponse = await fetch("https://myproyectfinals-production.up.railway.app/api/email/finalyPurchase", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(emailData),
            });
    
            if (!emailResponse.ok) {
                throw new Error("Error al enviar el correo electrónico de confirmación");
            }
    
            console.log("Correo electrónico enviado con éxito");

        }

        res.sendStatus(200);
    } catch (error) {
        console.error("error: ", error);
        res.sendStatus(500)
    }
}


export {createPreference, createWebhook};