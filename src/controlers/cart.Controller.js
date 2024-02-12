import { obtenerDatos, crearDato, actualizarCart, deleteServices } from '../services/cart.Services.js';

export const getCartControllers = async (req, res) => {
    try {
        const dataCart = await obtenerDatos();
        res.json(dataCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const postCartControllers = async (req, res) => {
    try {
        const dataCart = req.body;
        const newCart = await crearDato(dataCart);
        res.json(newCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const putCartControllers = async (req, res) => {
    try {
        const { id } = req.params;
        const dataCart = req.body;
        await actualizarCart(id, dataCart);
        res.json({ id, dataCart });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const deleteCartControllers = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteServices(id);
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}