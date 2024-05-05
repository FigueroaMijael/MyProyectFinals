import { productModel } from "../../../modelsMongo/products.model.js";
import usersModel from "../../../modelsMongo/users.model.js";
import transporter from "../../../utils/email.js";

export default class ProductService {
  
    getAll = async (_id, limit, page, sort, query, category, availability, code) => {

        const options = {
            limit,
            skip: (page - 1) * limit,
        };
    
        if (sort) {
            options.sort = { price: sort === "asc" ? -1 : 1  };
        }
    
        const queryFilter = {
            ...(query ? { title: query } : {}),
            ...(category ? { category } : {}),
            ...(code ? { code } : {}),
            stock: { $gt: 0 },
        };
    
        if (availability === "disponible") {
            queryFilter.stock = { $gt: 0 };
        }
    
        if (code) {
            queryFilter.code = code;
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
            const product = await productModel.findById(_id)
            return product
        }
    }

        save = async (prod, ) => {      
          const newProduct = await productModel.create(prod);
      
          return newProduct;
      }
      

    update = async ( _id, updateData) => {

        const newProductUpdate = await productModel.findByIdAndUpdate( _id, updateData);

        return newProductUpdate
    }

    delete = async (_id) => {
        try {
            const deletedProduct = await productModel.findById(_id);
            if (!deletedProduct) {
                throw new Error("Producto no encontrado");
            }

            if (deletedProduct.owner !== 'admin') {
                const user = await usersModel.findOne({ email: deletedProduct.owner });
                if (!user) {
                    throw new Error("Usuario no encontrado");
                }

                if (user.role === 'premium') {
                    const userEmail = user.email;
                    const mailOptions = {
                        from: "Tu aplicación",
                        to: userEmail,
                        subject: "Notificación de eliminación de producto",
                        text: "Hola, tu producto ha sido eliminado."
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error("Error al enviar correo electrónico:", error);
                        } else {
                            console.log("Correo electrónico enviado:", info.response);
                        }
                    });
                }
            }
            await productModel.findByIdAndDelete(_id);
    
            return deletedProduct;
        } catch (error) {
            throw error;
        }
    };    
}
