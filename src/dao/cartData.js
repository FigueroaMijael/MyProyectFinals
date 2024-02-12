import { cartModel } from '../models/cart.model.js';

export const recuperarDatosCart = async () => {
    try {
        // Recuperar todos los documentos de la colección de carritos
        return await cartModel.find();
    } catch (error) {
        throw new Error("Error al recuperar los datos del carrito: " + error.message);
    }
}

export const guardarDatosCart = async (dato) => {
    try {
        // Crear un nuevo documento de carrito en la base de datos
        const newCart = new cartModel(dato);
        await newCart.save();
        return newCart;
    } catch (error) {
        throw new Error("Error al guardar los datos del carrito: " + error.message);
    }
}

export const actualizarDatosCart = async (id, dato) => {
    try {
        // Actualizar el documento de carrito con el ID dado
        const updatedCart = await cartModel.findByIdAndUpdate(id, dato, { new: true });
        if (!updatedCart) {
            throw new Error("Carrito no encontrado");
        }
        return updatedCart;
    } catch (error) {
        throw new Error("Error al actualizar los datos del carrito: " + error.message);
    }
}

export const deleteCartById = async (id) => {
    try {
        // Eliminar el documento de carrito con el ID dado
        const deletedCart = await cartModel.findByIdAndDelete(id);
        if (!deletedCart) {
            throw new Error("Carrito no encontrado");
        }
        return true;
    } catch (error) {
        throw new Error("Error al eliminar el carrito: " + error.message);
    }
}
