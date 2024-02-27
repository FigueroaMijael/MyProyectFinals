import __dirname from '../../../../utils.js';
import fileSystem from 'fs';
import Cart from './models/cart.model.fs.js';

export default class CartService {
    #cart;
    #dirPath;
    #filePath;
    #fileSystem;

    constructor() {
        this.#cart = new Cart(__dirname + '/files/cart.json');
        this.#dirPath = __dirname + '/files';
        this.#filePath = this.#dirPath + "/cart.json";
        this.#fileSystem = fileSystem;

        this.#prepararDirectorioBase();
    }

    async #prepararDirectorioBase() {
        await this.#fileSystem.promises.mkdir(this.#dirPath, { recursive: true });
        if (!this.#fileSystem.existsSync(this.#filePath)) {
            await this.#fileSystem.promises.writeFile(this.#filePath, "[]");
        }
    }


    async getAll() {
        return await this.#cart.getAllProducts(); 
    }

    
    async save() {
        await this.#cart.save();
    }

    async saveProduct(product) {
        await this.#cart.addProduct(product); 
        await this.save();
    }

    async update(productId, updatedProduct) {
        await this.#cart.updateProductQuantity(productId, updatedProduct.quantity); 
        await this.save(); 
    }

    async delete(productId) {
        if (productId) {
            await this.#cart.removeProduct(productId); 
            await this.save(); 
        } else {
            await this.clearCart()
            await this.save()
        }
    }
}