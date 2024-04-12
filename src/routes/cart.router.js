import { Router } from "express";
import cartController from '../controlers/cart.Controller.js';
import {authorization, passportCall} from '../utils/passport.js'

const router = Router();

router.get('/', passportCall('jwt'), authorization(['user', 'premium']), cartController.getAllCart);

// GETById
router.get('/:_id', passportCall('jwt'), authorization(['user', 'premium']), cartController.getAllCart);

// POST
router.post('/:CId/product/:PId/:quantity', passportCall('jwt'), authorization(['user', 'premium']), cartController.postCart);

// PUT
router.put('/increase/:CId/product/:PId/:quantity', cartController.increaseQuantityAndSubtractStock);

router.put('/decrease/:CId/product/:PId/:quantity', cartController.decreaseQuantityAndAddStock);

// DELETE ONE PRODUCT
router.delete('/delete/:CId/product/:PId', passportCall('jwt'), authorization(['user', 'premium']), cartController.deleteCart);

// DELETE CART
router.delete('/delete/:CId', passportCall('jwt'), authorization(['user', 'premium']), cartController.deleteCart);


router.post('/finalizePurchase',passportCall('jwt'), authorization(['user', 'premium']), cartController.finalizePurchase);

export default router;