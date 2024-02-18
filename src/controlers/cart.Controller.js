import { obtenerDatos, agregarDato, actualizarCart, deleteServices } from '../services/cart.Services.js';

export const getCartControllers = async (req, res) => {
    try {
        let { _id } = req.params;
        const dataCart = await obtenerDatos( _id );
        res.json(dataCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const postCartControllers = async (req, res) => {
    try {
        const { CId, PId, quantity } = req.params;

        const newCart = await agregarDato(CId, PId, quantity);
        res.json(newCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const putCartControllers = async (req, res) => {
    try {
    
        const { CId, PId, quantity } = req.params;
          
        await actualizarCart( CId, PId, quantity);
        res.json({ message: "Datos del carrito actualizados correctamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const deleteCartControllers = async (req, res) => {
    try {
        const { CId, PId } = req.params;
        await deleteServices( CId, PId );
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}