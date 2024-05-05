import { Router } from "express";
import { passportCall, authorization} from '../utils/passport.js'
import emailController from "../controlers/email.Controllers.js";

const router = Router();

router.post("/finalyPurchase", passportCall('jwt'), authorization(['user']), emailController.sendEmailFinalyPurchase);

router.post("/sendEmailUpdatePassword", emailController.sendEmailUpdatePassword);

router.post("/sendInactiveUserNotification", emailController.sendInactiveUserNotification);

export default router