 class CartItem {
  constructor(product) {
      this._id = product._id; // Suponiendo que el producto tiene un ID único
      this.product = product.product;
      this.title = product.title;
      this.price = product.price;
      this.thumbnail = product.thumbnail;
      this.quantity = product.quantity || 1; // Establecer cantidad predeterminada como 1 si no se proporciona
  }
};

 class Cart {
  constructor() {
      this.products = [];
  }

  getAllProducts() {
    return this.products;
}

  addProduct(product) {
      const cartItem = new CartItem(product);
      this.products.push(cartItem);
  }

  updateProductQuantity(PId, quantity) {
      const productIndex = this.products.findIndex(item => item._id === PId);
      if (productIndex !== -1) {
          this.products[productIndex].quantity = quantity;
      } else {
          throw new Error('Product not found in cart');
      }
  }


  removeProduct(PId) {
    this.products = this.products.filter(item => item._id !== PId);
}

  clearCart() {
      this.products = [];
  }
}

export default Cart