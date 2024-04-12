import { Router } from 'express';
import productController from '../controlers/products.Controller.js'
import {authorization, passportCall} from '../utils/passport.js'

const router = Router();

//GET
router.get('/', productController.getProd);

//GETById
router.get('/:_id', productController.getProd);

//GETByCode
router.get('/:code', productController.getProd);

// POST
router.post('/create',  passportCall('jwt'), authorization([ 'admin', 'premium']) , productController.postProd);

//PUT
router.put('/update/:_id', passportCall('jwt'), authorization([ 'admin','premium']),  productController.updateProd)

// Delete
router.delete('/delete/:_id', passportCall('jwt'), authorization([ 'admin','premium']), productController.deleteProd);

// Delete
router.delete('/delete/:code', productController.deleteProd); 

export default router; 