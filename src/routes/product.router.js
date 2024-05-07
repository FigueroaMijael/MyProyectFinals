import { Router } from 'express';
import productController from '../controlers/products.Controller.js'
import {authorization, passportCall} from '../utils/passport.js'
import {uploader} from '../utils/multer.js'

const router = Router();

router.get('/', productController.getProd);

router.get('/:_id', productController.getProd);

router.get('/code/:code', productController.getProd);

router.get('/category/:category', productController.getProd);

router.post('/create',  uploader.single('thumbnail'), passportCall('jwt'), authorization([ 'admin', 'premium']) , productController.postProd);

router.put('/update/:_id', passportCall('jwt'), authorization([ 'admin','premium']),  productController.updateProd)

router.delete('/delete/:_id', passportCall('jwt'), authorization([ 'admin','premium']), productController.deleteProd);

router.delete('/delete/:code', passportCall('jwt'), authorization([ 'admin','premium']), productController.deleteProd); 

router.post('/:uid/documents', passportCall('jwt'), authorization([ 'admin','premium']), productController.uploadDocumentsProd);

export default router; 