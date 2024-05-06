/* IMPLEMENTACION CON FACTORY
import {cartService} from '../services/factory.js' 
*/

//IMPLEMENTACION CON REPOSITORY
// controllers/cartControllers.js
import { cartService, ticketService, productService } from '../services/service.js';
import CartDto from '../services/dto/cart.dto.js';
import { EErrors } from '../utils/customLogger/errors-enum.js';
import { devLogger, prodLogger } from '../utils/logger.js'
import config from '../config/config.js';

const logger = config.environment === 'production' ? prodLogger : devLogger;

 const getAllCart = async (req, res, next) => {
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

 const postCart = async (req, res, next) => {
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

        const cartExists = await cartService.getAll(CId);
        if (!cartExists) {
            const error = {
                name: "CartControllerError",
                cause: "No se puedo encontrar el carrito con _id: " + CId + " en la base de datos",
                code: EErrors.NOT_FOUND,
                message: "Carrito no encontrado",
            };
            throw error;
        }

        const prodExists = await productService.getAll(PId);
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

        res.status(200).json({ message: "Producto agregado con exito al carrito!!", cart: newCart });
    } catch (error) {
        next(error);
    }
};

 const increaseQuantityAndSubtractStock = async (req, res, next) => {
    try {
        logger.info("Agregando cantidad al carrito y restando del stock del producto");
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

        const newCart = await cartService.increaseQuantityAndSubtractStock(CId, PId, parsedQuantity);

        res.status(200).json({ message: "Datos del carrito actualizados correctamente", cart: newCart });
    } catch (error) {
        next(error);
    }
};

 const decreaseQuantityAndAddStock = async (req, res, next) => {
    try {
        logger.info("Disminuyendo cantidad del carrito y agregando al stock del producto");
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

        const newCart = await cartService.decreaseQuantityAndAddStock(CId, PId, parsedQuantity);

        res.status(200).json({ message: "Datos del carrito actualizados correctamente", cart: newCart });
    } catch (error) {
        next(error);
    }
};

 const deleteCart = async (req, res, next) => {
    try {
        logger.info("Eliminando producto del carrito");
        const { CId, PId } = req.params;

        const cartExists = await cartService.getAll(CId);
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

        const prodExists = await productService.getAll(PId);
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



export default  {
    getAllCart, 
    postCart, 
    increaseQuantityAndSubtractStock,
    decreaseQuantityAndAddStock, 
    deleteCart,
}
