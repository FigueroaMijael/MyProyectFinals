import CartDao from './dao/mongodb/cart.dao.js';;
import ProductDao from './dao/mongodb/product.dao.js';
import UserDao from './dao/mongodb/users.dao.js'; 
import TicketDao from './dao/mongodb/ticket.dao.js';
import MessagesDao from './dao/mongodb/chat.dao.js'

import ProductRepository from './repository/product.repository.js'
import CartRepository from './repository/cart.repository.js'
import UsersRepository from './repository/users.repository.js'
import TicketRepository from './repository/ticket.repository.js';
import ChatRepository from './repository/chat.repository.js';

const productDao = new ProductDao()
const cartDao = new CartDao();
const usersDao = new UserDao();
const ticketDao = new TicketDao()
const chatDao = new MessagesDao()

export const productService = new ProductRepository(productDao);
export const cartService = new CartRepository(cartDao);
export const userService = new UsersRepository(usersDao);
export const ticketService = new TicketRepository(ticketDao);
export const chatService = new ChatRepository(chatDao)