/* IMPLEMENTACION CON FACTORY
import {productService} from '../services/factory.js' 
*/

//IMPLEMENTACION CON REPOSITORY
// controllers/productControllers.js
import { productService } from '../services/service.js';
import { EErrors } from '../config/Errors/customError/errors-enum.js';
import config from '../config/config.js';
import { prodLogger ,devLogger } from '../config/logger/logger.js';

const logger = config.environment === 'production' ? prodLogger : devLogger;


export const getDatosControllers = async (req, res, next) => {
    try {
        logger.info("Obteniendo datos de productos");
        const { _id } = req.params;

        let datos;

        if (_id) {
            datos = await productService.getAll(_id);
        } else {
            datos = await productService.getAll();
        }

        res.json(datos);
    } catch (error) {
        next(error); 
    }
};

export const postDatosControllers = async (req, res, next) => {
    try {
        logger.info("Creando nuevo producto");

        const { title, description, category, thumbnail, code } = req.body;
        let { price, stock } = req.body;

        price = parseInt(price);
        stock = parseInt(stock);

        if (!title || !description || !price || !category || !thumbnail || !code || !stock) {
            const error = { 
                name: "ValidationError",
                cause: "El usuario no completo todos lo campos",
                message: "Todos los campos son obligatorios",
                code: EErrors.VALIDATION_ERROR
            };
            throw error
        }

        if (typeof price !== 'number' || price <= 0) {
            const error = { 
                name: "InvalidTypeError",
                cause: "El precio debe ser un numero y no un string",
                message: "El precio no es válido",
                code: EErrors.INVALID_TYPES_ERROR,
            };
            throw error
        }

        if (typeof stock !== 'number' || stock < 0) {
            const error = { 
                name: "InvalidTypeError",
                cause: "El stock debe ser un numero y no un string",
                message: "El stock no es válido",
                code: EErrors.INVALID_TYPES_ERROR,
            };
            throw error
        }

        const { user } = req;
        const { role, email } = user;

        const owner = (role === 'premium') ? email : 'admin';
        
        const productoACrear = { title, description, price, category, thumbnail, code, stock, owner };

        const nuevoDato = await productService.save(productoACrear);
        res.status(200).json({ dato: nuevoDato });
    } catch (error) {
        next(error); 
    }
};

export const updateDatosControllers = async (req, res, next) => {
    try {
        logger.info("Actualizando datos de producto");

        const { _id } = req.params;
        const newData = req.body;

        const existingProduct = await productModel.findById(_id);
        if (!existingProduct) {
            const error = {
                name: "Not Found",
                cause: "Producto no encontrado con _id: " + _id,
                code: EErrors.NOT_FOUND,
                message: "Product Not Found"
            };
            throw error;
        }

        const updateProd = await productService.update(_id, newData);
        res.status(200).json({ message: "Dato actualizado correctamente", dato: updateProd });
    } catch (error) {
        next(error); 
    }
};

export const deleteDatosControllers = async (req, res, next) => {
    try {
        logger.info("Eliminando producto");

        let { id } = req.params;

        const deleteProd = await productService.delete(id);

        res.status(200).json({ message: `Producto con id: ${id} eliminado con éxito`, deletedProduct: deleteProd });
    } catch (error) {
        next(error); 
    }
};