/* IMPLEMENTACION CON FACTORY
import {productService} from '../services/factory.js' 
*/

//IMPLEMENTACION CON REPOSITORY
// controllers/productControllers.js
import { productService } from '../services/service.js';
import { EErrors } from '../utils/customLogger/errors-enum.js';
import config from '../config/config.js';
import { prodLogger ,devLogger } from '../utils/logger.js';

const logger = config.environment === 'production' ? prodLogger : devLogger;


 const getProd = async (req, res, next) => {
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

 const postProd = async (req, res, next) => {
    try {
        logger.info("Creando nuevo producto");
        
        //descomentar owner y comentar el codigo de la linea 75 a la 78 para testing
        const { title, description, category, thumbnail, code,  /* owner */ } = req.body;
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

 const updateProd = async (req, res, next) => {
    try {
        logger.info("Actualizando datos de producto");

        const { _id } = req.params;
        const newData = req.body;

        const existingProduct = await productService.getAll(_id);

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

 const deleteProd = async (req, res, next) => {
    try {
        logger.info("Eliminando producto");

        let { _id } = req.params;

        const deleteProd = await productService.delete(_id);

        res.status(200).json({ message: `Producto con id: ${_id} eliminado con éxito`, deletedProduct: deleteProd });
    } catch (error) {
        next(error); 
    }
};

const uploadDocumentsProd = async (req, res) => {
    const { uid } = req.params;
    
    // Verificar si el usuario existe
    const user = await userService.getAll(uid);
    if (!user) return res.status(404).send({ status: "error", error: "User not found" });

    // Utilizar el middleware de Multer para cargar los archivos
    uploader.array('productImage')(req, res, async (err) => {
        if (err) {
            console.error("Error al subir archivos:", err);
            return res.status(500).send({ status: "error", error: "Error uploading files" });
        }

        // Obtener los archivos cargados
        const files = req.files;

        // Actualizar el estado del usuario para indicar que se han cargado documentos
        user.documents = files.map(file => ({
            name: file.originalname,
            reference: file.path // Podrías cambiar esto dependiendo de cómo quieras guardar las referencias de los archivos
        }));
        
        // Guardar los cambios en el usuario
        await user.save();

        return res.status(200).json({ message: "Documentos subidos y usuario actualizado correctamente", user });
    });
};

export default {
    getProd,
    postProd,
    updateProd,
    deleteProd,
    uploadDocumentsProd
}