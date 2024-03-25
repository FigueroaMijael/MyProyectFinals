import { Router } from "express";
import { passportCall, authorization} from "../../utils.js";
import {finalizePurchaseControllers ,getDatosRenderViewControllers, realTimeViewControllers, getDatosCartRenderViewControllers, getDatosProductRenderViewControllers, renderLoginControllers, renderRegisterControllers,  getDatosUserRenderViewControllers, renderUpdatePasswordControllers, renderGtiHubControllers} from '../controlers/viewControllers.js'

const router = Router();

// VIEWS PRODUCTS
//products (home)
router.get("/", getDatosRenderViewControllers)

//detalle
router.get("/detail/:PId", getDatosProductRenderViewControllers )

//realTime
router.get("/realtimeproducts", passportCall('jwt'), authorization(['user', 'admin', 'premium']) , realTimeViewControllers );

//VIEWS CART
//carrito
router.get("/cart/:CId", getDatosCartRenderViewControllers);

//VIEWS USERS
//login
router.get("/login", renderLoginControllers)

//register
router.get("/register", renderRegisterControllers)

//profile
router.get("/profile", passportCall('jwt'),authorization(['user', 'admin', 'premium']), getDatosUserRenderViewControllers)

//buscar usuario
router.get("/searchUser", (req, res) => {
    res.render("serchUser");
});

// Cambio de contraseña
router.get("/updatePassword/reset", renderUpdatePasswordControllers)

//GitHub login
router.get("/github/login", renderGtiHubControllers)

//chat
router.get('/chat', passportCall('jwt'), authorization(['user']), (req, res) => {
    const userName = req.user ? req.user.name : null; 
    res.render('chat', { userName, fileCss: 'styles.chat.css' });
});

router.get('/finalizePurchase/:_id',  passportCall('jwt'), authorization(['user']), finalizePurchaseControllers) 

export default router