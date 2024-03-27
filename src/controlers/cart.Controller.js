/* IMPLEMENTACION CON FACTORY
import {cartService} from '../services/factory.js' 
*/

//IMPLEMENTACION CON REPOSITORY
// controllers/cartControllers.js
import { cartService, ticketService } from '../services/service.js';
import { cartModel } from '../services/dao/mongodb/models/cart.model.js';
import { productModel } from '../services/dao/mongodb/models/products.model.js';
import CartDto from '../services/dto/cart.dto.js';
import { EErrors } from '../config/Errors/customError/errors-enum.js';
import { devLogger, prodLogger } from '../config/logger/logger.js'
import config from '../config/config.js';

const logger = config.environment === 'production' ? prodLogger : devLogger;

export const getCartControllers = async (req, res, next) => {
    try {
        logger.info("Obteniendo datos del carrito");
        const { _id } = req.params;

        const dataCart = await cartService.getAll(_id);

        const cartDto = new CartDto(dataCart);

        res.json(cartDto);
    } catch (error) {
        next(error);
    }
};

export const postCartControllers = async (req, res, next) => {
    try {
        logger.info("Creando nuevo producto en el carrito");
        const { CId, PId, quantity = 1 } = req.params;

        const parsedQuantity = parseInt(quantity);

        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {

            const error = {
                name: "CartControllerError",
                cause: "Quantity debe ser un numero y no un string",
                code: EErrors.VALIDATION_ERROR,
                message: "Cantidad no válida",
            };
            throw error;
        }

        const cartExists = await cartModel.findById(CId);
        if (!cartExists) {
            const error = {
                name: "CartControllerError",
                cause: "No se puedo encontrar el carrito con _id: " + CId + " en la base de datos",
                code: EErrors.NOT_FOUND,
                message: "Carrito no encontrado",
            };
            throw error;
        }

        const prodExists = await productModel.findById(PId);
        if (!prodExists) {
            const error = {
                name: "CartControllerError",
                cause: "No se puedo encontrar el producto con _id: " + PId + " en la base de datos",
                code: EErrors.NOT_FOUND,
                message: "Producto no encontrado",
            };
            throw error;
        }

        if (parsedQuantity > prodExists.stock) {

            const error = {
                name: "CartControllerError",
                cause: "La cantidad no puede ser mayor que el stock",
                message: "Stock insuficiente",
                code: EErrors.VALIDATION_ERROR
            };
            throw error;
        }

        prodExists.stock -= parsedQuantity;
        await prodExists.save();

        const newCart = await cartService.save(cartExists, prodExists, parsedQuantity);

        res.status(200).json(newCart);
    } catch (error) {
        next(error);
    }
};

export const putCartControllers = async (req, res, next) => {
    try {
        logger.info("Actualizando datos del carrito");
        const { CId, PId, quantity = 1 } = req.params;

        const parsedQuantity = parseInt(quantity);

        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {

            const error = {
                name: "CartControllerError",
                cause: "Quantity debe ser un numero y no un string",
                code: EErrors.VALIDATION_ERROR,
                message: "Cantidad no válida",
            };
            throw error;
        }

        const cartExists = await cartModel.findById(CId);
        if (!cartExists) {
            const error = {
                name: "CartControllerError",
                cause: "No se puedo encontrar el carrito con _id: " + CId + " en la base de datos",
                code: EErrors.NOT_FOUND,
                message: "Carrito no encontrado",
            };
            throw error;
        }

        const prodExists = await productModel.findById(PId);
        if (!prodExists) {
            const error = {
                name: "CartControllerError",
                cause: "No se puedo encontrar el producto con _id: " + PId + " en la base de datos",
                code: EErrors.NOT_FOUND,
                message: "Producto no encontrado",
            };
            throw error;
        }

        prodExists.stock += parsedQuantity;
        await prodExists.save();

        const newCartUpdate = await cartService.update(cartExists, prodExists, parsedQuantity);

        res.status(200).json({ message: "Datos del carrito actualizados correctamente", cart: newCartUpdate });
    } catch (error) {
        next(error);
    }
};

export const deleteCartControllers = async (req, res, next) => {
    try {
        logger.info("Eliminando producto del carrito");
        const { CId, PId } = req.params;

        const cartExists = await cartModel.findById(CId);
        if (!cartExists) {
            const error = {
                name: "CartControllerError",
                cause: "No se puedo encontrar el carrito con _id: " + CId + " en la base de datos",
                code: EErrors.NOT_FOUND,
                message: "Carrito no encontrado",
            };
            throw error;
        }

        if (!PId) {
            cartExists.products = [];
            await cartExists.save();
            res.send('Carrito vaciado con éxito.');
            return;
        }

        const prodExists = await productModel.findById(PId);
        if (!prodExists) {
            const error = {
                name: "CartControllerError",
                cause: "No se puedo encontrar el producto con _id: " + PId + " en la base de datos",
                code: EErrors.NOT_FOUND,
                message: "Producto no encontrado",
            };
            throw error;
        }

        const deleteCart = await cartService.delete(cartExists, prodExists);

        res.status(200).json({ message: "Producto eliminado del carrito", deletedCart: deleteCart });
    } catch (error) {
        next(error);
    }
};

export const finalizePurchase = async (req, res, next) => {
    try {
        logger.info("Finalizando compra");
        const { amount } = req.body;
        
        const purchaser = req.user ? req.user.email : null; 

        const generateRandomCode = () => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const length = 10; 
            let code = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                code += characters.charAt(randomIndex);
            }
            return code;
        };
        
        const code = generateRandomCode();

        const ticket = await ticketService.save({ amount, purchaser, code });

        res.status(200).json({ purchaseId: ticket._id });
    } catch (error) {
        next(error);
    }
};

