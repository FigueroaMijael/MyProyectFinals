import { Router } from "express";
import cartController from '../controlers/cart.Controller.js';


const router = Router();

router.get('/', cartController.getAllCart);

// GETById
router.get('/:_id', cartController.getAllCart);

// POST
router.post('/:CId/product/:PId/:quantity', cartController.postCart);

// PUT
router.put('/increase/:CId/product/:PId/:quantity', cartController.increaseQuantityAndSubtractStock);

router.put('/decrease/:CId/product/:PId/:quantity', cartController.decreaseQuantityAndAddStock);

// DELETE ONE PRODUCT
router.delete('/delete/:CId/product/:PId', cartController.deleteCart);

// DELETE CART
router.delete('/delete/:CId', cartController.deleteCart);

export default router;