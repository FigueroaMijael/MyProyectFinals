import { cartModel } from '../models/cart.model.js';

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

export const guardarDatosCart = async (cartExists, prodExists, parsedQuantity ) => {
    
    try {
        
        const cart = await cartModel.findById(cartExists).populate('products.product');
    
    if (!cart) {
        throw new Error('Cart not found');
    }

    const existingProductIndex = cart.products.findIndex(p => p.product && p.product.equals(prodExists._id));

    if (existingProductIndex !== -1) {

        cart.products[existingProductIndex].quantity += parsedQuantity;

    } else {

        cart.products.push({
            product: prodExists._id,
            title: prodExists.title,
            price: prodExists.price,
            thumbnail: prodExists.thumbnail,
            quantity: parsedQuantity
        });
    }

    await cartModel.findByIdAndUpdate(cartExists, { products: cart.products });

    return cart.products;
    } catch (error) {
        throw new Error("Error al agregar el producto al carrito: " + error.message);
    }
}


export const actualizarDatosCart = async (cartExists, prodExists, quantity) => {
   try {
    const updateCart = await cartModel.findById(cartExists)

    if (!updateCart) {
        throw new Error('Cart not found');
    }

    const existingProduct = updateCart.products.find(product => product.product.toString() === prodExists._id.toString());

    console.log(existingProduct);

    
    if (existingProduct) {
        // Verificar si hay suficiente stock disponible
        if (quantity > prodExists.stock) {
            throw new Error('Insufficient stock');
        }

        existingProduct.quantity = quantity;
        await updateCart.save();
        return updateCart.products;
    } else {
        throw new Error('Product not found in cart');
    }
   } catch (error) {
    throw new Error('Product not found in cart');
   }
}

export const deleteCartById = async (cartExists, prodExists) => {
    try {
        const cart = await cartModel.findById(cartExists._id);

        if (!cart) {
            throw new Error('Cart not found');
        }

        cart.products.pull({ _id: prodExists });
        await cart.save();

        return cart;
    } catch (error) {
        throw new Error("Error al eliminar el producto del carrito: " + error.message);
    }
}
