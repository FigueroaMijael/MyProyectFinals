 class CartItem {
  constructor(product) {
      this._id = product._id;
      this.product = product.product;
      this.title = product.title;
      this.price = product.price;
      this.thumbnail = product.thumbnail;
      this.quantity = product.quantity || 1;
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