import __dirname from '../../../../utils.js';
import fileSystem from 'fs';
import Cart from './models/cart.model.fs.js'; // Importa el modelo de carrito

export default class CartService {
    #cart;
    #dirPath;
    #filePath;
    #fileSystem;

    constructor() {
        this.#cart = new Cart(__dirname + '/files/cart.json'); // Inicializa el carrito con el archivo JSON
        this.#dirPath = __dirname + '/files';
        this.#filePath = this.#dirPath + "/cart.json";
        this.#fileSystem = fileSystem;

        this.#prepararDirectorioBase(); // Llamada a la función prepararDirectorioBase en el constructor
    }

    async #prepararDirectorioBase() {
        await this.#fileSystem.promises.mkdir(this.#dirPath, { recursive: true });
        if (!this.#fileSystem.existsSync(this.#filePath)) {
            await this.#fileSystem.promises.writeFile(this.#filePath, "[]");
        }
    }


    async getAll() {
        return await this.#cart.getAllProducts(); // Llama al método getAllProducts del modelo de carrito
    }

    
    async save() {
        await this.#cart.save(); // Llama al método save del modelo de carrito
    }

    async saveProduct(product) {
        await this.#cart.addProduct(product); // Llama al método addProduct del modelo de carrito
        await this.save(); // Llama al método save del servicio para guardar los cambios
    }

    async update(productId, updatedProduct) {
        await this.#cart.updateProductQuantity(productId, updatedProduct.quantity); // Llama al método updateProductQuantity del modelo de carrito
        await this.save(); // Llama al método save del servicio para guardar los cambios
    }

    async delete(productId) {
        if (productId) {
            await this.#cart.removeProduct(productId); // Llama al método removeProduct del modelo de carrito
            await this.save(); // Llama al método save del servicio para guardar los cambios
        } else {
            await this.clearCart()
            await this.save()
        }
    }
}