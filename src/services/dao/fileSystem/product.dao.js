import ProductManager from './models/products.model.fs.js';

export default class productService {
    #productManager;

    constructor(filePath) {
        this.#productManager = new ProductManager(filePath);
    }

    async getAll(_id, code) {
        try {
           if(_id){
            return await this.#productManager.getProductById(_id)
           }if(code){
            return await this.#productManager.getProductByCode(code)
           }else {
            return await this.#productManager.getAllProducts();
           }
        } catch (error) {
            console.error(`Error consultando los productos: ${error}`);
            throw Error(`Error consultando los productos: ${error}`);
        }
    }

    async save(prod) {
        try {
            return await this.#productManager.addProduct(prod);
        } catch (error) {
            console.error(`Error guardando el producto: ${error}`);
            throw Error(`Error guardando el producto: ${error}`);
        }
    }

    async update(_id, updateData) {
        try {
            const updatedProduct = await this.#productManager.updateProductStock(_id, updateData.stock);
            return updatedProduct;
        } catch (error) {
            console.error(`Error actualizando el producto: ${error}`);
            throw Error(`Error actualizando el producto: ${error}`);
        }
    }

    async delete(_id, code) {
        try {
            if(_id){
                return await this.#productManager.deleteProductById(_id)
            }if(code){
                return await this.#productManager.deleteProductByCode(code)
               }
        } catch (error) {
            console.error(`Error eliminando el producto: ${error}`);
            throw Error(`Error eliminando el producto: ${error}`);
        }
    }
}
