import { productService } from '../services/service.js';
import { EErrors } from '../utils/customLogger/errors-enum.js';
import config from '../config/config.js';
import { prodLogger ,devLogger } from '../utils/logger.js';

const logger = config.environment === 'production' ? prodLogger : devLogger;


 const getProd = async (req, res, next) => {
    try {
        logger.info("Obteniendo datos de productos");
        const { _id , code, category} = req.params;

        let datos;

        if (_id) {
            datos = await productService.getAll(_id);
        } else if (code) {
            datos = await productService.getAll(null, null, null, null, null, null, null, code);
        } else if (category) {
            datos = await productService.getAll(null, null, null, null, null, category);
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
        const { title, description, category, code } = req.body;
        let { price, stock } = req.body;

        price = parseInt(price);
        stock = parseInt(stock);

        if (!title || !description || !price || !category || !code || !stock) {
            const error = {
                name: "ValidationError",
                cause: "El usuario no completó todos los campos",
                message: "Todos los campos son obligatorios",
                code: EErrors.VALIDATION_ERROR
            };
            throw error;
        }

        if (typeof price !== 'number' || price <= 0) {
            const error = {
                name: "InvalidTypeError",
                cause: "El precio debe ser un número y no una cadena",
                message: "El precio no es válido",
                code: EErrors.INVALID_TYPES_ERROR,
            };
            throw error;
        }

        if (typeof stock !== 'number' || stock < 0) {
            const error = {
                name: "InvalidTypeError",
                cause: "El stock debe ser un número y no una cadena",
                message: "El stock no es válido",
                code: EErrors.INVALID_TYPES_ERROR,
            };
            throw error;
        }

        const { user } = req;
        const { role, email } = user;
        const owner = (role === 'premium') ? email : 'admin';

        const thumbnail = req.file;
        if (!thumbnail) {
            const error = {
                name: "FileNotFoundError",
                cause: "No se encontró el archivo thumbnail",
                message: "Se requiere un archivo thumbnail",
                code: EErrors.FILE_NOT_FOUND_ERROR,
            };
            throw error;
        }


        const productoACrear = {
            title,
            description,
            price,
            category,
            thumbnail: {
                url: thumbnail.path,
                filename: thumbnail.filename 
            },
            code,
            stock,
            owner
        };

        const nuevoDato = await productService.save(productoACrear)
        console.log("Producto creado exitosamente:", nuevoDato);

        res.status(200).json({ dato: nuevoDato });

    } catch (error) {
        console.error("Error al crear el producto:", error);
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

        const { _id } = req.params;
        const deletedProduct = await productService.delete(_id);

        res.status(200).json({ message: `Producto con id: ${_id} eliminado con éxito`, deletedProduct });
    } catch (error) {
        next(error); 
    }
};


const uploadDocumentsProd = async (req, res) => {
    const { uid } = req.params;
    
    const user = await userService.getAll(uid);
    if (!user) return res.status(404).send({ status: "error", error: "User not found" });

    uploader.array('productImage')(req, res, async (err) => {
        if (err) {
            console.error("Error al subir archivos:", err);
            return res.status(500).send({ status: "error", error: "Error uploading files" });
        }

        const files = req.files;

        user.documents = files.map(file => ({
            name: file.originalname,
            reference: file.path 
        }));
        
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