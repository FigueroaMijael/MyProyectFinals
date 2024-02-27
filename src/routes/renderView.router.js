import { Router } from "express";
import { passportCall} from "../../utils.js";
import {getDatosRenderViewControllers, getDatosCartRenderViewControllers, getDatosProductRenderViewControllers, renderLoginControllers, renderRegisterControllers,  getDatosUserRenderViewControllers, renderUpdatePasswordControllers, renderGtiHubControllers} from '../controlers/viewControllers.js'
import {authorization} from '../../utils.js'

const router = Router();

// VIEWS PRODUCTS
//products (home)
router.get("/", getDatosRenderViewControllers)

//detalle
router.get("/detail/:PId", getDatosProductRenderViewControllers )

//VIEWS CART
//carrito
router.get("/cart/:CId", getDatosCartRenderViewControllers);

//VIEWS USERS
//login
router.get("/login", renderLoginControllers)

//register
router.get("/register", renderRegisterControllers)

//profile
router.get("/profile", passportCall('jwt'),authorization(['user']), getDatosUserRenderViewControllers)

// Cambio de contraseña
router.get("/updatePassword",authorization(['user']), renderUpdatePasswordControllers)

//GitHub login
router.get("/github/login", renderGtiHubControllers)


export default router