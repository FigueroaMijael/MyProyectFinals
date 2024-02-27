/* IMPLEMENTACION CON FACTORY
import {productService} from '../services/factory.js' 
*/

//IMPLEMENTACION CON REPOSITORY
import {productService} from '../services/service.js'

export const getDatosControllers = async (req, res) => {
    let { _id } = req.params;
    let datos;

    if (_id) {
        datos = await productService.getAll(_id);
    } else {
        datos = await productService.getAll();
    }

    res.json(datos);
};

export const postDatosControllers = async (req, res) => {
    try {
        const prod = req.body;
        const nuevoDato = await productService.save(prod);
        res.status(201).json({ dato: nuevoDato });
    } catch (error) {
        console.error("Error en el controlador al crear el producto: ", error.message);
        res.status(500).json({ error: "Error al crear el producto." });
    }
};

export const updateDatosControllers = async (req, res) => {
    try {
        let newDate = req.body;
        let { _id } = req.params;
        const updateProd = await productService.update(_id, newDate);
        res.status(201).json({ message: "Dato actualizado correctamente", dato: updateProd });
    } catch (error) {
        console.error("Error en el controlador al actualizar el producto: ", error.message);
        res.status(500).json({ error: "Error al actualizar el producto." });
    }
};

export const deleteDatosControllers = async (req, res) => {
    try {
        let { id } = req.params;
        const deleteProd = await productService.delete(id);
        res.json({ message: `Producto con id: ${id} eliminado con éxito`, deletedProduct: deleteProd });
    } catch (error) {
        console.error("Error al eliminar el producto:", error.message);
        res.status(500).json({ error: "Error al eliminar el producto." });
    }
};
