import { Router } from "express";
import { getCartControllers, postCartControllers, putCartControllers, deleteCartControllers,finalizePurchase } from '../controlers/cart.Controller.js';
import {authorization, passportCall} from '../../utils.js'

const router = Router();

router.get('/', getCartControllers);

// GETById
router.get('/:_id', getCartControllers);

// POST
router.post('/:CId/product/:PId/:quantity',passportCall('jwt'), authorization(['user']), postCartControllers);

// PUT
router.put('/update/:CId/product/:PId/:quantity', putCartControllers);

// DELETE ONE PRODUCT
router.delete('/delete/:CId/product/:PId', deleteCartControllers);

// DELETE CART
router.delete('/delete/:CId', deleteCartControllers);


router.post('/finalizePurchase',passportCall('jwt'), authorization(['user']), finalizePurchase);

export default router; 
