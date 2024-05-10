import { cartModel } from "../../../modelsMongo/cart.model.js";
import { productModel } from "../../../modelsMongo/products.model.js";

export default class CartService {

    getAll = async ( _id ) => {
        if (!_id) {

            const cart = await cartModel.findOne({ _id: _id }).populate('products.product');
        

                if (!cart) {
                    const newCart = await cartModel.create({ products: [] });
                    return { _id: newCart._id, cartData: [newCart] }; 
                }
                return { _id: cart._id, cartData: [cart] }; 
    
           } else {
            return await cartModel.findById( _id )
           }
    }

    save = async ( CId, PId, quantity ) => {
        const cart = await cartModel.findById(CId).populate('products.product');
    
    if (!cart) {
        throw new Error('Cart not found');
    }

    const existingProductIndex = cart.products.findIndex(p => p.product && p.product.equals(PId._id));

    if (existingProductIndex !== -1) {

        cart.products[existingProductIndex].quantity += quantity;

    } else {

        cart.products.push({
            product: PId._id,
            title: PId.title,
            price: PId.price,
            thumbnail: PId.thumbnail,
            quantity: quantity
        });
    }

    return await cartModel.findByIdAndUpdate(CId, { products: cart.products });

    }

    increaseQuantityAndSubtractStock = async (CId, PId, quantity) => {
        try {
            const cart = await cartModel.findById(CId);
            if (!cart) {
                const error = new Error("Carrito no encontrado");
                error.statusCode = 404;
                throw error;
            }
    
            const product = await productModel.findById(PId);
            if (!product) {
                const error = new Error("Producto no encontrado");
                error.statusCode = 404;
                throw error;
            }
    
            const productIndex = cart.products.findIndex(cartItem => cartItem.product.toString() === PId);
            if (productIndex === -1) {
                const error = new Error("El producto no está en el carrito");
                error.statusCode = 404;
                throw error;
            }
    
            const productInCart = cart.products[productIndex];
    
            productInCart.quantity += quantity;
    
            const stockDifference = quantity; 
    
            if (stockDifference > product.stock) {
                const error = new Error("No hay suficiente stock disponible");
                error.statusCode = 400;
                throw error;
            }
    
            product.stock -= stockDifference;
            await product.save();
    
            const nuevoCarritoActualizado = await cart.save();
    
            return nuevoCarritoActualizado;
        } catch (error) {
            throw error;
        }
    }

    decreaseQuantityAndAddStock = async (CId, PId, quantity) => {
        try {
            const cart = await cartModel.findById(CId);
            if (!cart) {
                const error = new Error("Carrito no encontrado");
                error.statusCode = 404;
                throw error;
            }
    
            const product = await productModel.findById(PId);
            if (!product) {
                const error = new Error("Producto no encontrado");
                error.statusCode = 404;
                throw error;
            }
    
            const productIndex = cart.products.findIndex(cartItem => cartItem.product.toString() === PId);
            if (productIndex === -1) {
                const error = new Error("El producto no está en el carrito");
                error.statusCode = 404;
                throw error;
            }
    
            const productInCart = cart.products[productIndex];
    
            productInCart.quantity -= quantity;
    
            product.stock += quantity;
            await product.save();
    
            const nuevoCarritoActualizado = await cart.save();
    
            return nuevoCarritoActualizado;
        } catch (error) {
            throw error;
        }
    }
    

    delete = async ( CId, PId ) => {
        const cart = await cartModel.findById( CId._id );

        if (!cart) {
            throw new Error('Cart not found');
        }

        cart.products.pull({ product: PId });
        await cart.save();

        return cart;
    }

    
}