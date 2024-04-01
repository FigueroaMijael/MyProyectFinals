import { Router } from "express";
import { getCartControllers, postCartControllers, increaseQuantityAndSubtractStockController,decreaseQuantityAndAddStockController, deleteCartControllers,finalizePurchase } from '../controlers/cart.Controller.js';
import {authorization, passportCall} from '../../utils.js'

const router = Router();

router.get('/', getCartControllers);

// GETById
router.get('/:_id', getCartControllers);

// POST
router.post('/:CId/product/:PId/:quantity', /* passportCall('jwt'), authorization(['user', 'premium']), */ postCartControllers);

// PUT
router.put('/increase/:CId/product/:PId/:quantity', increaseQuantityAndSubtractStockController);
router.put('/decrease/:CId/product/:PId/:quantity', decreaseQuantityAndAddStockController);

// DELETE ONE PRODUCT
router.delete('/delete/:CId/product/:PId', deleteCartControllers);

// DELETE CART
router.delete('/delete/:CId', deleteCartControllers);


router.post('/finalizePurchase',passportCall('jwt'), authorization(['user', 'premium']), finalizePurchase);

export default router; 
