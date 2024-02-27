import fs from 'fs';

class Product {
    constructor({ title, description, price, category, thumbnail, code, stock }) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.products = [];
    }

    async initialize() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await this.save(); 
            } else {
                throw error; 
            }
        }
    }

    async save() {
        await fs.writeFile(this.filePath, JSON.stringify(this.products, null, 2));
    }

    async getAllProducts() {
        return this.products;
    }

    async getProductById( _id ) {
        return this.products.find(product => product._id === _id);
    }

    async getProductByCode(code) {
        return this.products.find(product => product.code === code);
    }

    async addProduct(productData) {
        const product = new Product(productData);
        this.products.push(product);
        await this.save();
        return product;
    }

    async updateProduct(_id, newData) {
        try {
            const product = await this.getProductById(_id);
            if (product) {
                Object.assign(product, newData); 
                await this.save();
                return product;
            } else {
                throw new Error('Product not found');
            }
        } catch (error) {
            console.error(`Error updating product: ${error}`);
            throw new Error(`Error updating product: ${error}`);
        }
    }

    async deleteProductById(_id) {
        this.products = this.products.filter(product => product._id !== _id);
        await this.save();
    }

    async deleteProductByCode(code) {
        this.products = this.products.filter(product => product.code !== code);
        await this.save();
    }
}

export default ProductManager;
