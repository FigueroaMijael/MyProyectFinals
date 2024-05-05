import { Router } from 'express';
import productController from '../controlers/products.Controller.js'
import {authorization, passportCall} from '../utils/passport.js'
import {uploader} from '../utils/multer.js'

const router = Router();

//GET
router.get('/', productController.getProd);

//GETById
router.get('/:_id', productController.getProd);

//GETByCode
router.get('/code/:code', productController.getProd);


router.get('/category/:category', productController.getProd);

// POST
router.post('/create',  uploader.single('thumbnail'), passportCall('jwt'), authorization([ 'admin', 'premium']) , productController.postProd);

//PUT
router.put('/update/:_id', passportCall('jwt'), authorization([ 'admin','premium']),  productController.updateProd)

// Delete
router.delete('/delete/:_id', passportCall('jwt'), authorization([ 'admin','premium']), productController.deleteProd);

// Delete
router.delete('/delete/:code', passportCall('jwt'), authorization([ 'admin','premium']), productController.deleteProd); 

router.post('/:uid/documents', passportCall('jwt'), authorization([ 'admin','premium']), productController.uploadDocumentsProd);

export default router; 