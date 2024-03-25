import { Router } from 'express';
import { getDatosControllers, postDatosControllers, updateDatosControllers,  deleteDatosControllers } from '../controlers/products.Controller.js'
import {authorization, passportCall} from '../../utils.js'

const router = Router();

//GET
router.get('/', getDatosControllers);

//GETById
router.get('/:_id', getDatosControllers);

//GETByCode
/* router.get('/:code', getDatosControllers); */

// POST
router.post('/create', passportCall('jwt'), authorization([ 'admin', 'premium']) ,postDatosControllers);

//PUT
router.put('/update/:_id',passportCall('jwt'), authorization([ 'admin','premium']), updateDatosControllers)

// Delete
router.delete('/delete/:_id', deleteDatosControllers);

// Delete
/* router.delete('/delete/:code', deleteDatosControllers); */


export default router; 