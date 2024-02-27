export default class CartDto {
    constructor(cart) {
        this.products = cart.products || [];
        this.totalAmount = this.calculateTotalAmount();
    }

    calculateTotalAmount() {
        return this.products.reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0);
    }
}
