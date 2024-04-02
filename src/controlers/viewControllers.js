import { productService, cartService, ticketService} from "../services/service.js";
import UsersDto from "../services/dto/users.dto.js";
import Handlebars from "handlebars";
import CartDto from '../services/dto/cart.dto.js';

Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
  });


  export const getDatosRenderViewControllers = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query, category, availability } = req.query;
    
        const limitInt = parseInt(limit);
        const pageInt = parseInt(page);
    
        const result = await productService.getAll(null, {
            limit: limitInt,
            page: pageInt,
            sort,
            query,
            category,
            availability,
        });
        
        res.render("home.hbs", {
            fileCss: "styles_products.css",
            products: result.products,
            total: result.total,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            page: parseInt(pageInt),
            add: Handlebars.helpers.add
        });
      
    } catch (error) {
        next(error)
    }
}

export const realTimeViewControllers = async (req,res) => {
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

export const getDatosCartRenderViewControllers = async (req, res) => {
    try {
        const { CId } = req.params;
    
        const CartId = await cartService.getAll(CId);
        const cartDto = new CartDto(CartId);
        console.log(cartDto);
            
        res.render("cart", {
            title: "Vista del Carrito",
            fileCss: "style.cart.css",
            cartDto,
        });
    } catch (error) {
        next(error)    }
}

export const getDatosProductRenderViewControllers = async (req, res) => {
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

export const getDatosUserRenderViewControllers = async (req, res) => {
    try {
        const user = req.user;

        const userDto = new UsersDto(user);

        res.render("profile", {
            user: userDto,
            fileCss:"styles.profile.css"
        });
    } catch (error) {
        next(error)    }
};

export const renderUpdatePasswordControllers = async (req, res) => {
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

export const renderLoginControllers = async (req, res) => {
    try {
        res.render("login", {
            title: "vista del login",
            fileCss:"styles.login.css"
        });
    } catch (error) {
        next(error)    }
}

export const renderRegisterControllers = async (req, res) => {
    try {
        res.render("register.hbs", {
            title: "vista del resgister",
            fileCss: "styles.register.css"
        });
    } catch (error) {
        next(error)    }
}

export const renderGtiHubControllers = async (req, res) => {
    try {
        res.render("github-login");
    } catch (error) {
        next(error)    }
}

export const finalizePurchaseControllers = async (req, res) => {
    try {
        const { _id } = req.params;

        const ticket = await ticketService.getAll(_id);

        res.render('finalizepurchase', { ticket })
    } catch (error) {
        next(error)    }
}