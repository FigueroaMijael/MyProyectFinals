import { Router } from 'express';
import { createTicket } from '../controlers/ticket.Controllers.js';

const router = Router();

router.post('/tickets', createTicket);

export default router;
