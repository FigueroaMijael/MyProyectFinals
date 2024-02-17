import { recuperarDatosCart, guardarDatosCart, actualizarDatosCart, deleteCartById } from '../dao/cartData.js'
import { cartModel } from '../models/cart.model.js';
import { productModel } from '../models/products.model.js';

export const obtenerDatos = async ( _id ) => {
    // Lógica de negocio, validación de stock, etc.

    return await recuperarDatosCart( _id );
}

export const agregarDato = async (CId, PId, quantity ) => {
    // Lógica de negocio, validación de datos, etc.

        // Verificar si el carrito existe antes de actualizar
        const cartExists = await cartModel.findById( CId );
        if (!cartExists) {
            return res.status(404).json({ error: "El carrito no existe" });
        }

        // Verificar si el carrito existe antes de actualizar
        const prodExists = await productModel.findById( PId);
        if (!prodExists) {
             return res.status(404).json({ error: "El producto no existe" });
        }

    return await guardarDatosCart(cartExists, prodExists, quantity );
}

export const actualizarCart = async (CId, PId) => {
    // Lógica de negocio para la actualización
            // Verificar si el carrito existe antes de actualizar
            const cartExists = await cartModel.findById( CId );
            if (!cartExists) {
                return res.status(404).json({ error: "El carrito no existe" });
            }
    
            // Verificar si el carrito existe antes de actualizar
            const prodExists = await productModel.findById( PId);
            if (!prodExists) {
                 return res.status(404).json({ error: "El producto no existe" });
            }
    
        return await actualizarDatosCart(cartExists, prodExists);
}

export const deleteServices = async (_id) => {
    // Lógica para eliminar
    // Verificar si el carrito existe antes de actualizar
    const cartExists = await cartModel.findById( _id );
    if (!cartExists) {
        return res.status(404).json({ error: "El carrito no existe" });
    }

    return await deleteCartById(_id);
}