import { productModel } from '../models/products.model.js';

export const recuperarDatos = async (_id) => {
    try {
        if (!_id) {
            // Recupera todos los documentos de la colección de productos
            return await productModel.find()
        } else {
            // Recuperar un documentos de la colección de productos
            return await productModel.findById(_id)
        }

    } catch (error) {
        console.error("Error al recuperar los datos de productos: ", error.message);
        throw new Error("Error al recuperar los datos de productos: " + error.message);
    }
}

export const guardarDato = async (dato) => {
    try {
        // Crea un nuevo documento de producto en la base de datos
        const newProduct = await productModel.create(dato);

        return newProduct;
    } catch (error) {
        console.error("Error al crear el productos: ", error.message);
        throw new Error("Error al guardar el producto: " + error.message);
    }
}

export const actualizarDato = async ( _id, dato) => {
    try {
        const newProductUpdate = await productModel.findByIdAndUpdate( _id, dato);

        return newProductUpdate
    } catch (error) {
        console.error("Error al actualizar el productos: ", error.message);
        throw new Error("Error al actualizar el producto: " + error.message);
    }
}

export const deleById = async (_id) => {
    try {
        const deletedProduct = await productModel.findByIdAndDelete(_id);

        if (!deletedProduct) {
            throw new Error("No se pudo eliminar el producto.");
        }

        console.log('Producto eliminado exitosamente:', deletedProduct);
        return deletedProduct;
    } catch (error) {
        console.error("Error en deleteById:", error);
        throw error;
    }
}
