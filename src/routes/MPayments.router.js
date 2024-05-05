import { Router } from 'express';
import createPreference from '../controlers/payment.Controller.js'

const router = Router();

router.post('/create-preference', createPreference )

export default router