import { productService, cartService} from "../services/service.js";
import UsersDto from "../services/dto/users.dto.js";
import Handlebars from "handlebars";
import CartDto from '../services/dto/cart.dto.js'
;

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
        
        res.render("home", {
        fileCss: "styles_products.css",
          products: result.products,
          total: result.total,
          hasPrevPage: result.hasPrevPage,
          hasNextPage: result.hasNextPage,
          page: parseInt(pageInt),
          add: Handlebars.helpers.add
      });
      
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
}

export const realTimeViewControllers = async (req,res) => {
     try {
    const result = await productService.getAll();

    res.render("realTimeProduct", {
      title: "Lista de Productos en Tiempo Real",
      products: result.products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
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
          fileCss: "cartStyle.css",
          cartDto,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
      }
}

export const getDatosProductRenderViewControllers = async (req, res) => {
    try {
        const { PId } = req.params;
    
        const ProdId = await productService.getAll(PId);
    
        res.render("detail", {
          title: "Detalle del producto",
          ProdId,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
      }
}

export const getDatosUserRenderViewControllers = async (req, res) => {
    try {
        const user = req.user;
        console.log("Usuario logueado: ", user);

        const userDto = new UsersDto(user);

        res.render("profile", { user: userDto });
    } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        res.status(500).send("Error interno del servidor");
    }
};


export const renderUpdatePasswordControllers = async (req, res) => {
    res.render("updatePassword", {
        title: "update Password",
        fileCss: "updatePassword.css",
    }) 
}

export const renderLoginControllers = async (req, res) => {
    res.render("login", {
        title: "vista del login",
        /* fileCss: "loginStyle.css" */
    })
}

export const renderRegisterControllers = async (req, res) => {
    res.render("register.hbs", {
        title: "vista del resgister",
        /* fileCss: "registerStyle.css" */
    }) 
}

export const renderGtiHubControllers = async (req, res) => {
    res.render("github-login");
}