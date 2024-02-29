import { Router } from "express";
import { passportCall, authorization} from "../../utils.js";
import {finalizePurchase ,getDatosRenderViewControllers, realTimeViewControllers, getDatosCartRenderViewControllers, getDatosProductRenderViewControllers, renderLoginControllers, renderRegisterControllers,  getDatosUserRenderViewControllers, renderUpdatePasswordControllers, renderGtiHubControllers} from '../controlers/viewControllers.js'


const router = Router();

// VIEWS PRODUCTS
//products (home)
router.get("/", getDatosRenderViewControllers)

//detalle
router.get("/detail/:PId", getDatosProductRenderViewControllers )

//realTime
router.get("/realtimeproducts", passportCall('jwt'), authorization(['user']) , realTimeViewControllers );

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

// Renderizar la página del chat con el nombre de usuario como dato dinámico
router.get('/chat', passportCall('jwt'), authorization(['user']), (req, res) => {
    const userName = req.user ? req.user.name : null; // Obtener el nombre de usuario si está autenticado
    res.render('chat', { userName, fileCss: 'styles.chat.css' });
});

router.get('/finalizePurchase/:_id',  passportCall('jwt'), authorization(['user']), finalizePurchase) 

export default router