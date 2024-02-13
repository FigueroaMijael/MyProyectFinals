import { Router } from 'express';
import { getDatosControllers, postDatosControllers, deleteDatosControllers } from '../controlers/products.Controller.js'

const router = Router();

//GET
router.get('/', getDatosControllers);

// POST
router.post('/', postDatosControllers);


// Delete
router.delete('/:id', deleteDatosControllers);

// TEST
router.get('/test', (req, res) => {
    res.send({ message: "success", payload: "Success!!" });
});


export default router; 