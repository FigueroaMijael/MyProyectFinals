import { Router } from "express";
import { getCartControllers, postCartControllers, putCartControllers, deleteCartControllers } from '../controlers/cart.Controller.js';

const router = Router();

router.get('/', getCartControllers);

// GETById
router.get('/:_id', getCartControllers);

// POST
router.post('/:CId/product/:PId/:quantity', postCartControllers);

// PUT
router.put('/update/:CId/:PId', putCartControllers);

// DELETE
router.delete('/:_id', deleteCartControllers);

export default router; 
