/* IMPLEMENTACION CON FACTORY
import {cartService} from '../services/factory.js' 
*/

//IMPLEMENTACION CON REPOSITORY
import {cartService, ticketService} from '../services/service.js'
import { cartModel } from '../services/dao/mongodb/models/cart.model.js';
import { productModel } from '../services/dao/mongodb/models/products.model.js';
import CartDto from '../services/dto/cart.dto.js'


export const getCartControllers = async (req, res) => {
    try {
        const { _id } = req.params;

        const dataCart = await cartService.getAll( _id );

        const cartDto = new CartDto(dataCart);

        console.log(cartDto);

        res.json(cartDto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const postCartControllers = async (req, res) => {
    try {
        const { CId, PId, quantity = 1 } = req.params;

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

        if (parsedQuantity > prodExists.stock) {
            throw new Error('Insufficient stock');
        }

        // Restar la cantidad del producto al stock en la base de datos
        prodExists.stock -= parsedQuantity;
        await prodExists.save();

        const newCart = await cartService.save(cartExists, prodExists, parsedQuantity);

        res.json(newCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const putCartControllers = async (req, res) => {
    try {
    
        const { CId, PId, quantity = 1 } = req.params;


        console.log(quantity);

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
          
         // Restar la cantidad del producto al stock en la base de datos
         prodExists.stock += parsedQuantity;
         await prodExists.save();
 
        const newCartUpdate = await cartService.update(cartExists, prodExists, parsedQuantity);

        res.json({ message: "Datos del carrito actualizados correctamente" + newCartUpdate});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const deleteCartControllers = async (req, res) => {
    try {
        const { CId, PId } = req.params;

        const cartExists = await cartModel.findById(CId);

        if (!cartExists) {
            throw new Error("El carrito no existe");
        }

        if (!PId) {
            let clearCart = cartExists.products = [];
            await cartExists.save();
            res.send('carrito vaciado con exito.')
            return clearCart;
        }

        const prodExists = await productModel.findById(PId);
        if (!prodExists) {
            throw new Error("El producto no existe");
        }

        const deleteCart = await cartService.delete( cartExists, prodExists );

        res.json({ message: "Product deleted" + deleteCart});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const finalizePurchase = async (req, res) => {
    try {
        const { amount } = req.body;
        
        const purchaser = req.user ? req.user.email : null; // Obtener el nombre de usuario si está autenticado

        const generateRandomCode = () => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const length = 10; 
            let code = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                code += characters.charAt(randomIndex);
            }
            return code;
        };
        
        const code = generateRandomCode();

        console.log("Creando ticket...");

        const ticket = await ticketService.save({ amount, purchaser, code });

        console.log("Ticket creado:", ticket);

        // Redirigir a la vista de finalizePurchase con el ID del ticket
        res.status(201).json({ purchaseId: ticket._id });
    } catch (error) {
        console.error("Error al finalizar la compra:", error);
        res.status(400).json({ message: error.message });
    }
};

