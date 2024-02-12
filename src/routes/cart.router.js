import { Router } from "express";
import { getCartControllers, postCartControllers, putCartControllers, deleteCartControllers } from '../controlers/cart.Controller.js';

const router = Router();

// GET
router.get('/', getCartControllers);

// POST
router.post('/', postCartControllers);

// PUT
router.put('/:id', putCartControllers);

// DELETE
router.delete('/:id', deleteCartControllers);

export default router; 
