import { Router } from "express";
import { passportCall, authorization} from '../../utils.js'
import {sendEmail} from "../controlers/email.Controllers.js";


const router = Router();

router.get("/", passportCall('jwt'), authorization(['user']),sendEmail);

export default router