/* IMPLEMENTACION CON FACTORY
import {cartService} from '../services/factory.js' 
*/

//IMPLEMENTACION CON REPOSITORY
// controllers/cartControllers.js
import { cartService, ticketService } from '../services/service.js';
import { cartModel } from '../services/dao/mongodb/models/cart.model.js';
import { productModel } from '../services/dao/mongodb/models/products.model.js';
import CartDto from '../services/dto/cart.dto.js';
import CustomError from '../config/Errors/customError/customError.js';
import { EErrors } from '../config/Errors/customError/errors-enum.js';

export const getCartControllers = async (req, res) => {
    try {
        req.logger.info("Obteniendo datos del carrito");
        const { _id } = req.params;

        const dataCart = await cartService.getAll(_id);

        const cartDto = new CartDto(dataCart);

        res.json(cartDto);
    } catch (error) {
        CustomError.createError({ name: "CartControllerError", cause: error, message: "Error al obtener datos del carrito", code: EErrors.DATABASE_ERROR, logger: req.logger });
    }
};

export const postCartControllers = async (req, res) => {
    try {
        req.logger.info("Creando nuevo producto en el carrito");
        const { CId, PId, quantity = 1 } = req.params;

        const parsedQuantity = parseInt(quantity);

        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            CustomError.createError({ name: "CartControllerError", message: "Cantidad no válida", code: EErrors.VALIDATION_ERROR, logger: req.logger });
        }

        const cartExists = await cartModel.findById(CId);
        if (!cartExists) {
            CustomError.createError({ name: "CartControllerError", message: "Carrito no encontrado", code: EErrors.NOT_FOUND, logger: req.logger });
        }

        const prodExists = await productModel.findById(PId);
        if (!prodExists) {
            CustomError.createError({ name: "CartControllerError", message: "Producto no encontrado", code: EErrors.NOT_FOUND, logger: req.logger });
        }

        if (parsedQuantity > prodExists.stock) {
            CustomError.createError({ name: "CartControllerError", message: "Stock insuficiente", code: EErrors.VALIDATION_ERROR, logger: req.logger });
        }

        prodExists.stock -= parsedQuantity;
        await prodExists.save();

        const newCart = await cartService.save(cartExists, prodExists, parsedQuantity);

        res.json(newCart);
    } catch (error) {
        CustomError.createError({ name: "CartControllerError", cause: error, message: "Error al agregar producto al carrito", code: EErrors.DATABASE_ERROR, logger: req.logger });
    }
};

export const putCartControllers = async (req, res) => {
    try {
        req.logger.info("Actualizando datos del carrito");
        const { CId, PId, quantity = 1 } = req.params;

        const parsedQuantity = parseInt(quantity);

        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            CustomError.createError({ name: "CartControllerError", message: "Cantidad no válida", code: EErrors.VALIDATION_ERROR, logger: req.logger });
        }

        const cartExists = await cartModel.findById(CId);
        if (!cartExists) {
            CustomError.createError({ name: "CartControllerError", message: "El carrito no existe", code: EErrors.NOT_FOUND, logger: req.logger });
        }

        const prodExists = await productModel.findById(PId);
        if (!prodExists) {
            CustomError.createError({ name: "CartControllerError", message: "El producto no existe", code: EErrors.NOT_FOUND, logger: req.logger });
        }

        prodExists.stock += parsedQuantity;
        await prodExists.save();

        const newCartUpdate = await cartService.update(cartExists, prodExists, parsedQuantity);

        res.json({ message: "Datos del carrito actualizados correctamente", cart: newCartUpdate });
    } catch (error) {
        CustomError.createError({ name: "CartControllerError", cause: error, message: "Error al actualizar datos del carrito", code: EErrors.DATABASE_ERROR, logger: req.logger });
    }
};

export const deleteCartControllers = async (req, res) => {
    try {
        req.logger.info("Eliminando producto del carrito");
        const { CId, PId } = req.params;

        const cartExists = await cartModel.findById(CId);

        if (!cartExists) {
            CustomError.createError({ name: "CartControllerError", message: "El carrito no existe", code: EErrors.NOT_FOUND, logger: req.logger });
        }

        if (!PId) {
            cartExists.products = [];
            await cartExists.save();
            res.send('Carrito vaciado con éxito.');
            return;
        }

        const prodExists = await productModel.findById(PId);
        if (!prodExists) {
            CustomError.createError({ name: "CartControllerError", message: "El producto no existe", code: EErrors.NOT_FOUND, logger: req.logger });
        }

        const deleteCart = await cartService.delete(cartExists, prodExists);

        res.json({ message: "Producto eliminado del carrito", deletedCart: deleteCart });
    } catch (error) {
        CustomError.createError({ name: "CartControllerError", cause: error, message: "Error al eliminar producto del carrito", code: EErrors.DATABASE_ERROR, logger: req.logger });
    }
};

export const finalizePurchase = async (req, res) => {
    try {
        req.logger.info("Finalizando compra");
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

        res.status(201).json({ purchaseId: ticket._id });
    } catch (error) {
        CustomError.createError({ name: "CartControllerError", cause: error, message: "Error al finalizar la compra", code: EErrors.DATABASE_ERROR, logger: req.logger });
    }
};
