import { productService, cartService, ticketService} from "../services/service.js";
import UsersDto from "../services/dto/users.dto.js";
import Handlebars from "handlebars";
import CartDto from '../services/dto/cart.dto.js';
import CustomError from '../config/Errors/customError/customError.js';
import { EErrors } from '../config/Errors/customError/errors-enum.js'

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
        CustomError.createError({ name: "ViewControllerError", cause: error, message: "Error interno del servidor", code: EErrors.VIEW_INTERNAL_SERVER_ERROR });
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
        CustomError.createError({ name: "ViewControllerError", cause: error, message: "Error interno del servidor", code: EErrors.VIEW_INTERNAL_SERVER_ERROR });
    }
}

export const getDatosCartRenderViewControllers = async (req, res) => {
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
        CustomError.createError({ name: "ViewControllerError", cause: error, message: "Error interno del servidor", code: EErrors.VIEW_INTERNAL_SERVER_ERROR });
    }
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
        CustomError.createError({ name: "ViewControllerError", cause: error, message: "Error interno del servidor", code: EErrors.VIEW_INTERNAL_SERVER_ERROR });
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
        CustomError.createError({ name: "ViewControllerError", cause: error, message: "Error interno del servidor", code: EErrors.VIEW_INTERNAL_SERVER_ERROR });
    }
};

export const renderUpdatePasswordControllers = async (req, res) => {
    try {
        res.render("updatePassword", {
            title: "update Password",
            fileCss: "styles.updatePassword.css",
        });
    } catch (error) {
        CustomError.createError({ name: "ViewControllerError", cause: error, message: "Error interno del servidor", code: EErrors.VIEW_INTERNAL_SERVER_ERROR });
    }
}

export const renderLoginControllers = async (req, res) => {
    try {
        res.render("login", {
            title: "vista del login",
            fileCss:"styles.login.css"
        });
    } catch (error) {
        CustomError.createError({ name: "ViewControllerError", cause: error, message: "Error interno del servidor", code: EErrors.VIEW_INTERNAL_SERVER_ERROR });
    }
}

export const renderRegisterControllers = async (req, res) => {
    try {
        res.render("register.hbs", {
            title: "vista del resgister",
            fileCss: "styles.register.css"
        });
    } catch (error) {
        CustomError.createError({ name: "ViewControllerError", cause: error, message: "Error interno del servidor", code: EErrors.VIEW_INTERNAL_SERVER_ERROR });
    }
}

export const renderGtiHubControllers = async (req, res) => {
    try {
        res.render("github-login");
    } catch (error) {
        CustomError.createError({ name: "ViewControllerError", cause: error, message: "Error interno del servidor", code: EErrors.VIEW_INTERNAL_SERVER_ERROR });
    }
}

export const finalizePurchaseControllers = async (req, res) => {
    try {
        const { _id } = req.params;

        const ticket = await ticketService.getAll(_id);

        res.render('finalizepurchase', { ticket })
    } catch (error) {
        CustomError.createError({ name: "ViewControllerError", cause: error, message: "Error interno del servidor", code: EErrors.VIEW_INTERNAL_SERVER_ERROR });
    }
}