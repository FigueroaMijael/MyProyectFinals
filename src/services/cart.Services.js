import { recuperarDatosCart, guardarDatosCart, actualizarDatosCart, deleteCartById } from '../dao/cartData.js'

export const obtenerDatos = async () => {
    // Lógica de negocio, validación de stock, etc.
    return await recuperarDatosCart();
}

export const crearDato = async (dato) => {
    // Lógica de negocio, validación de datos, etc.
    dato.id = Math.random();
    await guardarDatosCart(dato);
    return dato;
}

export const actualizarCart = async (id, dato) => {
    // Lógica de negocio para la actualización
    return await actualizarDatosCart(id, dato);
}

export const deleteServices = async (id) => {
    // Lógica para eliminar
    return await deleteCartById(id);
}