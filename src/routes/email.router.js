import { Router } from "express";
import { passportCall, authorization} from '../../utils.js'
import {sendEmailFinalyPurchase, sendEmailUpdatePassword} from "../controlers/email.Controllers.js";

const router = Router();

router.post("/finalyPurchase", passportCall('jwt'), authorization(['user']), sendEmailFinalyPurchase);

router.post("/sendEmailUpdatePassword", sendEmailUpdatePassword);

export default router