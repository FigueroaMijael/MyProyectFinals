import { productModel } from "./models/products.model.js";

export default class ProductService {

    getAll = async ( _id, limit = 10, page = 1, sort, query, category, availability ) => {

        const options = {
            limit,
            skip: (page - 1) * limit,
          };
        
          if (sort) {
            options.sort = { price: sort === "asc" ? 1 : -1 };
          }
        
          const queryFilter = {
        ...(query ? { title: query } : {}),
        ...(category ? { category } : {}),
        stock: { $gt: 0 },
      };
  
      if (availability === "disponible") {
  
          queryFilter.stock = { $gt: 0 };
        }
        
          const count = await productModel.countDocuments(queryFilter);
          const hasPrevPage = page > 1;
          const hasNextPage = page * limit < count;

          if (!_id) {
            const products = await productModel.find(queryFilter, null, options)
            return {
                products,
                total: count,
                hasPrevPage,
                hasNextPage,
              };
        } else {
            const product = await productModel.findById({ _id: _id })
            return product
        }
        }

    save = async ( prod ) => {

        const newProduct = await productModel.create(prod);

        return newProduct;
    }

    update = async ( _id, updateData) => {

        const newProductUpdate = await productModel.findByIdAndUpdate( _id, updateData);

        return newProductUpdate
    }

    delete = async ( _id ) => {

        const deletedProduct = await productModel.findByIdAndDelete(_id);

        return deletedProduct
    }
}
