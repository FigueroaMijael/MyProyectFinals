import { Router } from "express";
import cartController from '../controlers/cart.Controller.js';

const router = Router();

router.get('/', cartController.getAllCart);

router.get('/:_id', cartController.getAllCart);

router.post('/:CId/product/:PId/:quantity', cartController.postCart);

router.put('/increase/:CId/product/:PId/:quantity', cartController.increaseQuantityAndSubtractStock);

router.put('/decrease/:CId/product/:PId/:quantity', cartController.decreaseQuantityAndAddStock);

router.delete('/delete/:CId/product/:PId', cartController.deleteCart);

router.delete('/delete/:CId', cartController.deleteCart);

export default router;