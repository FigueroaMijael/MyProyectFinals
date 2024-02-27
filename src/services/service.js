import CartDao from './dao/mongodb/cart.dao.js';;
import ProductDao from './dao/mongodb/product.dao.js';
import UserDao from './dao/mongodb/users.dao.js'; 

import ProductRepository from './repository/product.repository.js'
import CartRepository from './repository/cart.repository.js'
import UsersRepository from './repository/users.repository.js'

// Generamos las instancias de las clases
const productDao = new ProductDao()
const cartDao = new CartDao();
const usersDao = new UserDao();

export const productService = new ProductRepository(productDao);
export const cartService = new CartRepository(cartDao);
export const userService = new UsersRepository(usersDao);