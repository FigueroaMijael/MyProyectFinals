import { productModel } from '../models/product.model.js';

export const recuperarDatos = async () => {
    try {
        // Recupera todos los documentos de la colección de productos
        return await productModel.find();
    } catch (error) {
        throw new Error("Error al recuperar los datos de productos: " + error.message);
    }
}

export const guardarDato = async (dato) => {
    try {
        // Crea un nuevo documento de producto en la base de datos
        const newProduct = new productModel(dato);
        await newProduct.save();
        return newProduct;
    } catch (error) {
        throw new Error("Error al guardar el producto: " + error.message);
    }
}

export const deleById = async (id) => {
    try {
        // Elimina el documento de producto con el ID dado
        const deletedProduct = await productModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            throw new Error("Producto no encontrado");
        }
        return true;
    } catch (error) {
        throw new Error("Error al eliminar el producto: " + error.message);
    }
}
