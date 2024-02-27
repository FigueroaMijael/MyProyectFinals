import { Router } from "express";
import { getCartControllers, postCartControllers, putCartControllers, deleteCartControllers } from '../controlers/cart.Controller.js';
import {authorization} from '../../utils.js'

const router = Router();

router.get('/', authorization(['user']), getCartControllers);

// GETById
router.get('/:_id', getCartControllers);

// POST
router.post('/:CId/product/:PId/:quantity',authorization(['user']), postCartControllers);

// PUT
router.put('/update/:CId/product/:PId/:quantity', putCartControllers);

// DELETE ONE PRODUCT
router.delete('/delete/:CId/product/:PId', deleteCartControllers);

// DELETE CART
router.delete('/delete/:CId', deleteCartControllers);

export default router; 
