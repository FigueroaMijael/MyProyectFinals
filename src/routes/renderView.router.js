import { Router } from "express";
import { passportCall, authorization} from "../utils/passport.js";
import viewControllers from '../controlers/viewControllers.js'

const router = Router();

router.get("/", passportCall('jwt') ,viewControllers.prodRender)

router.get("/detail/:PId", viewControllers.prodDetailRender )

router.get("/realtimeproducts", passportCall('jwt'), authorization([ 'admin', 'premium']) , viewControllers.realTimeRender );

router.get("/cart/:CId", viewControllers.cartRender);

router.get("/login", viewControllers.loginRender)

router.get("/register", viewControllers.registerRender)

router.get("/profile", passportCall('jwt'), authorization(['user', 'admin', 'premium']), viewControllers.userRender)

router.get("/searchUser", (req, res) => {
res.render("serchUser", {fileCss: 'style.serchUser.css'});
});

router.get("/updatePassword/reset", viewControllers.updatePasswordRender)

router.get("/github/login", viewControllers.gitHubRender)

router.get('/chat', passportCall('jwt'), authorization([ 'admin', 'premium']), (req, res) => {
    const userName = req.user ? req.user.name : null; 
    res.render('chat', { userName, fileCss: 'styles.chat.css' });
});

router.get('/finalizePurchase/:_id',  passportCall('jwt'), authorization(['user','premium', 'admin']), viewControllers.finalizePurchaseRender) 

router.get("/formularioPremium", passportCall('jwt'), authorization(['user','premium', 'admin']), viewControllers.userRenderFormPremium)

router.get("/administrarApp", passportCall('jwt'), authorization(['admin']), viewControllers.adminRender)

router.get("/administrarApp", passportCall('jwt'), authorization(['admin']), (req, res) => {
    res.render('payFailed')
})

export default router