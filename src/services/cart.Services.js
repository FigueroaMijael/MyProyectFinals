import { recuperarDatosCart, guardarDatosCart, actualizarDatosCart, deleteCartById } from '../dao/cartData.js'
import { cartModel } from '../models/cart.model.js';
import { productModel } from '../models/products.model.js';

export const obtenerDatos = async ( _id ) => {
    // Lógica de negocio, validación de stock, etc.

    return await recuperarDatosCart( _id );
}

export const agregarDato = async (CId, PId, quantity ) => {
    // Lógica de negocio, validación de datos, etc.

    //parsea la cantidad
    const parsedQuantity = parseInt(quantity);

    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        throw new Error('Invalid quantity');
    }

    const cartExists = await cartModel.findById(CId);
    if (!cartExists) {
        throw new Error('Cart not found');
    }

    const prodExists = await productModel.findById(PId);
    if (!prodExists) {
        throw new Error('Product not found');
    }

    // Verificar si hay suficiente stock disponible
    if (parsedQuantity > prodExists.stock) {
        throw new Error('Insufficient stock');
    }

    return await guardarDatosCart(cartExists, prodExists, parsedQuantity );
}

export const actualizarCart = async (CId, PId, quantity) => {
    // Lógica de negocio para la actualización

    try {
        // Parsea la cantidad
        const parsedQuantity = parseInt(quantity);

        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            throw new Error('Invalid quantity');
        }

        // Verificar si el carrito existe antes de actualizar
        const cartExists = await cartModel.findById(CId);
        if (!cartExists) {
            throw new Error("El carrito no existe");
        }

        // Verificar si el producto existe antes de actualizar
        const prodExists = await productModel.findById(PId);
        if (!prodExists) {
            throw new Error("El producto no existe");
        }

        return await actualizarDatosCart(cartExists, prodExists, parsedQuantity);
    } catch (error) {
        throw new Error(error.message);
    }
}

export const deleteServices = async (CId, PId) => {
    try {
        const cartExists = await cartModel.findById(CId);
        if (!cartExists) {
            throw new Error("El carrito no existe");
        }

        if (!PId) {
            cartExists.products = [];
            await cartExists.save();
            return;
        }

        const prodExists = await productModel.findById(PId);
        if (!prodExists) {
            throw new Error("El producto no existe");
        }

        await deleteCartById(cartExists, PId);
    } catch (error) {
        throw new Error(error.message);
    }
}