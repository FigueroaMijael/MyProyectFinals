/* IMPLEMENTACION CON FACTORY
import {productService} from '../services/factory.js' 
*/

//IMPLEMENTACION CON REPOSITORY
// controllers/productControllers.js
import { productService } from '../services/service.js';
import CustomError from '../config/Errors/customError/customError.js';
import { EErrors } from '../config/Errors/customError/errors-enum.js';

export const getDatosControllers = async (req, res) => {
    try {
        req.logger.info("Obteniendo datos de productos");
        const { _id } = req.params;
        let datos;

        if (_id) {
            datos = await productService.getAll(_id);
        } else {
            datos = await productService.getAll();
        }

        res.json(datos);
    } catch (error) {
        CustomError.createError({ name: "ProductControllerError", cause: error, message: "Error al obtener datos de productos", code: EErrors.DATABASE_ERROR, logger: req.logger });
    }
};

export const postDatosControllers = async (req, res) => {
    try {
        req.logger.info("Creando nuevo producto");

        const { title, description, price, category, thumbnail, code, stock } = req.body;

        // Validaciones complejas
        if (!title || !description || !price || !category || !thumbnail || !code || !stock) {
            throw new CustomError({
                name: "ProductControllerError",
                message: "Todos los campos son obligatorios",
                code: EErrors.VALIDATION_ERROR
            });
        }

        if (typeof price !== 'number' || price <= 0) {
            throw new CustomError({
                name: "ProductControllerError",
                message: "El precio debe ser un número positivo",
                code: EErrors.VALIDATION_ERROR
            });
        }

        if (typeof stock !== 'number' || stock < 0) {
            throw new CustomError({
                name: "ProductControllerError",
                message: "El stock debe ser un número no negativo",
                code: EErrors.VALIDATION_ERROR
            });
        }

        // Guardar el nuevo producto
        const nuevoDato = await productService.save(req.body);
        res.status(201).json({ dato: nuevoDato });
    } catch (error) {
        CustomError.createError({ name: "ProductControllerError", cause: error, message: "Error al crear un nuevo producto", code: EErrors.DATABASE_ERROR, logger: req.logger });
    }
};

export const updateDatosControllers = async (req, res) => {
    try {
        req.logger.info("Actualizando datos de producto");

        const { _id } = req.params;
        const newData = req.body;

        // Validaciones complejas
        if (!newData || Object.keys(newData).length === 0) {
            throw new CustomError({
                name: "ProductControllerError",
                message: "Se requieren datos para actualizar",
                code: EErrors.VALIDATION_ERROR
            });
        }

        const allowedUpdates = ['title', 'description', 'price', 'category', 'thumbnail', 'code', 'stock'];
        const isValidOperation = Object.keys(newData).every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            throw new CustomError({
                name: "ProductControllerError",
                message: "Actualización no permitida",
                code: EErrors.VALIDATION_ERROR
            });
        }

        // Verificar si el producto existe
        const existingProduct = await productModel.findById(_id);
        if (!existingProduct) {
            throw new CustomError({
                name: "ProductControllerError",
                message: "Producto no encontrado",
                code: EErrors.NOT_FOUND
            });
        }

        // Actualizar el producto
        const updateProd = await productService.update(_id, newData);
        res.status(201).json({ message: "Dato actualizado correctamente", dato: updateProd });
    } catch (error) {
        CustomError.createError({ name: "ProductControllerError", cause: error, message: "Error al actualizar datos de producto", code: EErrors.DATABASE_ERROR, logger: req.logger });
    }
};

export const deleteDatosControllers = async (req, res) => {
    try {
        req.logger.info("Eliminando producto");
        let { id } = req.params;
        const deleteProd = await productService.delete(id);
        res.json({ message: `Producto con id: ${id} eliminado con éxito`, deletedProduct: deleteProd });
    } catch (error) {
        CustomError.createError({ name: "ProductControllerError", cause: error, message: "Error al eliminar producto", code: EErrors.DATABASE_ERROR, logger: req.logger });
    }
};
