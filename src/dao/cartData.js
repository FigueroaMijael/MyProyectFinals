import { cartModel } from '../models/cart.model.js';
import { productModel } from '../models/products.model.js';
import mongoose from 'mongoose';

export const recuperarDatosCart = async (_id) => {
    try {
       if (!_id) {

        const cart = await cartModel.findOne({ _id: _id }).populate('products.product');
    
        if (!cart) {
            const newCart = await cartModel.create({ products: [] });
            return [newCart];
        }
    
        return [cart];

       } else {
        return await cartModel.findById( _id )
       }
    }
     catch (error) {
        throw new Error("Error al recuperar los datos del carrito: " + error.message);
    }
}

export const guardarDatosCart = async (cartExists, prodExists, quantity ) => {
    try {
        const cart = await cartModel.findOne({ _id: cartExists }).populate('products.product', 'title price thumbnail');
    
    if (!cart) {
        throw new Error('Cart not found');
    }

    const existingProductIndex = cart.products.findIndex(p => p.product && p.product.equals(prodExists));

    if (existingProductIndex !== -1) {

        cart.products[existingProductIndex].quantity += quantity;

    } else {

        const product = await productModel.findById(prodExists);

        if (!product) {
            throw new Error('Product not found');
        }

        cart.products.push({
            _id: new mongoose.Types.ObjectId(),
            product: product._id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            quantity: parseInt(quantity)
        });
    }

    console.log('Saving cart:');
    console.log('cart:', cart);

    await cartModel.findByIdAndUpdate(cartExists, { products: cart.products });

    return cart.products;
    } catch (error) {
        throw new Error("Error al agregar el producto al carrito: " + error.message);
    }
}


export const actualizarDatosCart = async (cartExists, prodExists, quantity) => {
   try {
    const updateCart = await cartModel.findById(cartExists);

    if (!updateCart) {
        throw new Error('Cart not found');
    }

    const existingProduct = cart.products.find(product => product.prodExists === prodExists);

    if (existingProduct) {
        existingProduct.quantity = quantity;

        return await updateCart.save();
    }
   } catch (error) {
    throw new Error('Product not found in cart');
   }
}

export const deleteCartById = async (_id) => {
    try {
        // Eliminar el documento de carrito con el ID dado
        const deletedCart = await cartModel.findByIdAndDelete(_id);
        if (!deletedCart) {
            throw new Error("Carrito no encontrado");
        }
        
        deletedCart.products = [];

        return await deletedCart.save();
    } catch (error) {
        throw new Error("Error al eliminar el carrito: " + error.message);
    }
}
