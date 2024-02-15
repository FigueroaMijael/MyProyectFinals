import { recuperarDatos, guardarDato, actualizarDato, deleById } from '../dao/productData.js'
import { productModel } from '../models/products.model.js';



// obtenerDatos, crearDato, deleteServices

export const obtenerDatos = async (_id) => {
    // Logica de negocio
    // Validar si tengo stock

    return await recuperarDatos(_id)

}

export const crearDato = async (dato) => {
    // logica de negocio
    // Validar si el producto ya existe

    try {
        const nuevoDato = await guardarDato(dato);
        return nuevoDato;
    } catch (error) {
        throw new Error("Error en el servicio al crear el producto: " + error.message);
    }
}

export const updateDato = async (_id, dato) => {
    console.log('id que llega desde controller '+ _id);
    try {
        const existingProduct = await productModel.findById(_id);

        console.log("existe el producto... " + existingProduct);

        if (!existingProduct) {
            throw new Error("Producto no encontrado");
        }

        return await actualizarDato( _id, dato)
        
    } catch (error) {
        throw new Error("Error en el servicio al actualizar el producto: " + error.message);
    }
}

export const deleteServices = async (_id) => {
    console.log('id que llega desde controller '+ _id);
    try {
        const existingProduct = await productModel.findById(_id);

        console.log("existe el producto... " + existingProduct);

        if (!existingProduct) {
            throw new Error("Producto no encontrado");
        }

        return await deleById(_id);
    } catch (error) {
        console.error("Error en deleteServices:", error);
        throw error;
    }
}