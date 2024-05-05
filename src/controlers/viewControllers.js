import { productService, cartService, ticketService, userService} from "../services/service.js";
import Handlebars from "handlebars";
import CartDto from '../services/dto/cart.dto.js';


  const prodRender = async (req, res, next) => {
    try {
        const { limit = 10, page = 1, sort, query, category, availability, code } = req.query;
    
        const limitInt = parseInt(limit);
        const pageInt = parseInt(page);
    
        const result = await productService.getAll(
            null,
            limitInt,
            pageInt,
            sort,
            query,
            category,
            availability,
            code
        );

        // Renderizar la vista y pasar la categoría seleccionada
        res.render("home", {
            fileCss: "styles_products.css",
            products: result.products,
            total: result.total,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            page: parseInt(pageInt),
            add: Handlebars.helpers.add,
            selectedCategory: category // Pasar la categoría seleccionada a la vista
        });
      
    } catch (error) {
        next(error)
    }
}

 const realTimeRender= async (req,res) => {
    try {
        const result = await productService.getAll();

        res.render("realTimeProduct", {
            title: "Lista de Productos en Tiempo Real",
            fileCss: "styles_realtime.css",
            products: result.products,
        });
    } catch (error) {
        next(error)
    }
}

 const cartRender = async (req, res) => {
    try {
        const { CId } = req.params;
    
        const CartId = await cartService.getAll(CId);
        const cartDto = new CartDto(CartId);
            
        res.render("cart", {
            title: "Vista del Carrito",
            fileCss: "style.cart.css",
            cartDto,
        });
    } catch (error) {
        next(error)    }
}

 const prodDetailRender = async (req, res) => {
    try {
        const { PId } = req.params;
    
        const ProdId = await productService.getAll(PId);
    
        res.render("detail", {
            title: "Detalle del producto",
            fileCss:"style.detailProduct.css",
            ProdId,
        });
    } catch (error) {
        next(error)    
    }
}

 const userRender = async (req, res) => {
    try {
        const user = req.user;

        res.render("profile", {
            user,
            fileCss:"styles.profile.css"
        });
    } catch (error) {
        next(error)    }
};

const userRenderFormPremium = async (req, res) => {
    try {
        const user = req.user;

        res.render("formPremium", {
            user,
            fileCss: 'style.formPremium.css'
        });
    } catch (error) {
        next(error)    }
};

 const updatePasswordRender = async (req, res) => {
    try {
        const token = req.query.token;

        res.render("updatePassword", {
            title: "update Password",
            fileCss: "styles.updatePassword.css",
            token
        });
    } catch (error) {
        next(error)    }
}

 const loginRender = async (req, res) => {
    try {
        res.render("login", {
            title: "vista del login",
            fileCss:"styles.login.css"
        });
    } catch (error) {
        next(error)    }
}

 const registerRender = async (req, res) => {
    try {
        res.render("register.hbs", {
            title: "vista del resgister",
            fileCss: "styles.register.css"
        });
    } catch (error) {
        next(error)    }
}

 const gitHubRender = async (req, res) => {
    try {
        res.render("github-login");
    } catch (error) {
        next(error)    }
}

 const finalizePurchaseRender = async (req, res) => {
    try {
        const { _id } = req.params;

        const ticket = await ticketService.getAll(_id);

        res.render('finalizepurchase', { ticket })
    } catch (error) {
        next(error)    
    }
};

const adminRender = async (req, res) => {
    try {
        const users = await userService.getAll();
        res.render('adminUsers', { users });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).send('Error al cargar la página de administración de usuarios');
    }
};


export default {
    prodRender,
    prodDetailRender,
    cartRender,
    realTimeRender,
    userRender,
    loginRender,
    registerRender,
    updatePasswordRender,
    gitHubRender,
    finalizePurchaseRender,
    userRenderFormPremium,
    adminRender
}