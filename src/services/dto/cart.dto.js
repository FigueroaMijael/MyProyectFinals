export default class CartDto {
    constructor(cart) {
        this._id = cart._id;
        this.products = cart.products || [];
        this.totalAmount = this.calculateTotalAmount();
    }

    calculateTotalAmount() {
        return this.products.reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0);
    }
}

