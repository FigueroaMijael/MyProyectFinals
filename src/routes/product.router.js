import { Router } from 'express';
import { getDatosControllers, postDatosControllers, updateDatosControllers,  deleteDatosControllers } from '../controlers/products.Controller.js'

const router = Router();

//GET
router.get('/', getDatosControllers);

//GETById
router.get('/:_id', getDatosControllers);

// POST
router.post('/create', postDatosControllers);

//PUT
router.put('/update/:_id', updateDatosControllers)

// Delete
router.delete('/delete/:_id', deleteDatosControllers);

// TEST
router.get('/test', (req, res) => {
    res.send({ message: "success", payload: "Success!!" });
});


export default router; 