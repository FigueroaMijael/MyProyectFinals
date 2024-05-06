import { Router } from 'express';
import {createPreference, createWebhook} from '../controlers/payment.Controller.js'

const router = Router();

router.post('/create-preference', createPreference )

router.post("/webhook", createWebhook)

export default router