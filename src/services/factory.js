import config from "../config/config.js";
import MongoSingleton from "../config/DBConect/mongodb-singleton.js"

let productService;
let cartService;
let userService;

async function initializeMongoService() {
    console.log('Iniciando Servicio para Mongo!!');
    try {
        await MongoSingleton.getInstance()
    } catch (error) {
        console.error("Error al iniciar MongoDB: ", error);
        process.exit(1);
    }
}

switch (config.persistence) {
    case 'mongodb':
        initializeMongoService();
        const {default: productServiceMongo } = await import('./dao/mongodb/product.dao.js');
        productService = new productServiceMongo;
        console.log("Servicio de productos cargado:");
        console.log(productService);

        const {default: cartServiceMongo } = await import('./dao/mongodb/cart.dao.js');
        cartService = new cartServiceMongo;
        console.log("Servicio de carrito de compras cargado:");
        console.log(cartService);

        const {default: usersServiceMongo } = await import('./dao/mongodb/users.dao.js');
        userService = new usersServiceMongo;
        console.log("Servicio de usuarios cargado:");
        console.log(userService);
        break;

    case 'file':
        
        const {default: productServiceFileSystem } = await import('./dao/filesystem/product.dao.js');
        productService = new productServiceFileSystem;
        console.log("Servicio de productos cargado:");
        console.log(productService);

        const {default: cartServiceFileSystem } = await import('./dao/filesystem/cart.dao.js');
        cartService = new cartServiceFileSystem;
        console.log("Servicio de carrito de compras cargado:");
        console.log(cartService);

        const {default: usersServiceFileSystem } = await import('./dao/filesystem/users.dao.js');
        userService = new usersServiceFileSystem;
        console.log("Servicio de usuarios cargado:");
        console.log(userService);
        break;
    default:
        console.error("Persistencia no valida en la configuracion:", config.persistence);
        process.exit(1);
        break;
}

export { productService, cartService, userService };