/* IMPLEMENTACION CON FACTORY
import {productService} from '../services/factory.js' 
*/

//IMPLEMENTACION CON REPOSITORY
// controllers/productControllers.js
import { productService } from '../services/service.js';
import CustomError from '../config/Errors/customError/customError.js';
import { EErrors } from '../config/Errors/customError/errors-enum.js';
import { devLogger } from '../config/logger/logger.js';

export const getDatosControllers = async (req, res, next) => {
    try {
        devLogger.info("Obteniendo datos de productos");
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
        devLogger.info("Creando nuevo producto");

        const { title, description, category, thumbnail, code } = req.body;
        let { price, stock } = req.body;

        price = parseInt(price);
        stock = parseInt(stock);

        // Validaciones complejas
        if (!title || !description || !price || !category || !thumbnail || !code || !stock) {
            throw new CustomError("Todos los campos son obligatorios", "ValidationError", "Hay un campo sin completar al momento de crear el producto", EErrors.VALIDATION_ERROR, devLogger);
        }

        if (typeof price !== 'number' || price <= 0) {
            throw new CustomError("El precio no es válido", "InvalidTypeError", "", EErrors.INVALID_TYPES_ERROR, devLogger);
        }

        if (typeof stock !== 'number' || stock < 0) {
            throw new CustomError("El stock no es válido", "InvalidTypeError", "El stock debe ser un número no negativo", EErrors.INVALID_TYPES_ERROR, devLogger);
        }

         const { user } = req;
         const { role, email } = user;
 
         const owner = (role === 'premium') ? email : 'admin';
        
         const productoACrear = { title, description, price, category, thumbnail, code, stock, owner };

        const nuevoDato = await productService.save(productoACrear);
        res.status(201).json({ dato: nuevoDato });
    } catch (error) {
        next(error); 
    }
};

export const updateDatosControllers = async (req, res, next) => {
    try {
        devLogger.info("Actualizando datos de producto");

        const { _id } = req.params;
        const newData = req.body;

        // Verificar si el producto existe
        const existingProduct = await productModel.findById(_id);
        if (!existingProduct) {
            throw new CustomError("Product Not Found", "NOT FOUND", "El producto no se encontro en la base de datos", EErrors.NOT_FOUND, devLogger);
        }

        // Actualizar el producto
        const updateProd = await productService.update(_id, newData);
        res.status(201).json({ message: "Dato actualizado correctamente", dato: updateProd });
    } catch (error) {
        next(error); 
    }
};

export const deleteDatosControllers = async (req, res, next) => {
    try {
        devLogger.info("Eliminando producto");
        let { id } = req.params;
        const deleteProd = await productService.delete(id);
        res.json({ message: `Producto con id: ${id} eliminado con éxito`, deletedProduct: deleteProd });
    } catch (error) {
        next(error); 
    }
};