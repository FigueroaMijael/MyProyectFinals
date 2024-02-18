import { Router } from "express";
import { getCartControllers, postCartControllers, putCartControllers, deleteCartControllers } from '../controlers/cart.Controller.js';

const router = Router();

router.get('/', getCartControllers);

// GETById
router.get('/:_id', getCartControllers);

// POST
router.post('/:CId/product/:PId/:quantity', postCartControllers);

// PUT
router.put('/update/:CId/product/:PId/:quantity', putCartControllers);

// DELETE ONE PRODUCT
router.delete('/:CId/product/:PId', deleteCartControllers);

// DELETE CART
router.delete('/:CId', deleteCartControllers);

export default router; 
