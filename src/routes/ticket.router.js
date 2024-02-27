// router/ticketRouter.js
import { Router } from 'express';
import { finalizePurchase } from '../controlers/ticket.Controllers.js';
import {authorization} from '../../utils.js'


const ticketRouter = Router();

ticketRouter.post('/finalizePurchase', authorization(['user']), finalizePurchase);

export default ticketRouter;