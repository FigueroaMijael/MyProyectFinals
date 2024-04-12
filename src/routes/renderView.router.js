import { Router } from "express";
import { passportCall, authorization} from "../utils/passport.js";
import viewControllers from '../controlers/viewControllers.js'

const router = Router();

// VIEWS PRODUCTS
//products (home)
router.get("/", viewControllers.prodRender)

//detalle
router.get("/detail/:PId", viewControllers.prodDetailRender )

//realTime
router.get("/realtimeproducts", passportCall('jwt'), authorization(['user', 'admin', 'premium']) , viewControllers.realTimeRender );

//VIEWS CART
//carrito
router.get("/cart/:CId", viewControllers.cartRender);

//VIEWS USERS
//login
router.get("/login", viewControllers.loginRender)

//register
router.get("/register", viewControllers.registerRender)

//profile
router.get("/profile", passportCall('jwt'),authorization(['user', 'admin', 'premium']), viewControllers.userRender)

//buscar usuario
router.get("/searchUser", (req, res) => {
res.render("serchUser", {fileCss: 'style.serchUser.css'});
});

// Cambio de contraseña
router.get("/updatePassword/reset", viewControllers.updatePasswordRender)

//GitHub login
router.get("/github/login", viewControllers.gitHubRender)

//chat
router.get('/chat', passportCall('jwt'), authorization(['user', 'admin', 'premium']), (req, res) => {
    const userName = req.user ? req.user.name : null; 
    res.render('chat', { userName, fileCss: 'styles.chat.css' });
});

router.get('/finalizePurchase/:_id',  passportCall('jwt'), authorization(['user']), viewControllers.finalizePurchaseRender) 

export default router