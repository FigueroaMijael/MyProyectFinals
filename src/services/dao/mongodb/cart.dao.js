import { cartModel } from "./models/cart.model.js";

export default class CartService {

    getAll = async ( _id ) => {
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

    await cartModel.findByIdAndUpdate(CId, { products: cart.products });

    return cart.products;

    }

    update = async ( CId, PId, quantity ) => {
    const cart = await cartModel.findById( CId )

    if (!cart) {
        throw new Error('Cart not found');
    }

    const prod = cart.products.find(product => product.product.toString() === PId._id.toString());
    
    if (prod) {
        // Verificar si hay suficiente stock disponible
        if (quantity > PId.stock) {
            throw new Error('Insufficient stock');
        }

        prod.quantity = quantity;
        await cart.save();
        return cart.products;
    } else {
        throw new Error('Product not found in cart');
    }

    }

    delete = async ( CId, PId ) => {
        const cart = await cartModel.findById( CId._id );

        if (!cart) {
            throw new Error('Cart not found');
        }

        cart.products.pull({ _id: PId });
        await cart.save();

        return cart;
    }

    
}