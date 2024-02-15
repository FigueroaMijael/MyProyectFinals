import { obtenerDatos, crearDato, updateDato, deleteServices } from '../services/product.Services.js'


export const getDatosControllers = async (req, res) => {
    let { _id } = req.params
    let datos = await obtenerDatos( _id );
    res.json(datos);
}


export const postDatosControllers = async (req, res) => {
    try {
        const dato = req.body;
        const nuevoDato = await crearDato(dato);
        res.status(201).json({ dato: nuevoDato });
    } catch (error) {
        console.error("Error en el controlador al crear el producto: ", error.message);
        res.status(500).json({ error: "Error al crear el producto." });
    }
}

export const updateDatosControllers = async (req, res) => {
    try {
        let newDate = req.body;
        let { _id } = req.params;
        await updateDato(_id, newDate); // Actualizar el dato utilizando la función de servicio correspondiente
        res.status(201).json({ message: "Dato actualizado correctamente", dato: newDate });
    } catch (error) {
        console.error("Error en el controlador al actualizar el producto: ", error.message);
        res.status(500).json({ error: "Error al actualizar el producto." });
    }
};

export const deleteDatosControllers = async (req, res) => {
    try {
        let { _id } = req.params;
        console.log(_id)
        await deleteServices(_id);
        res.json({ message: `Producto eliminado con éxito: ${_id}` });
    } catch (error) {
        console.error("Error al eliminar el producto:", error.message);
        res.status(500).json({ error: "Error al eliminar el producto." });
    }
}