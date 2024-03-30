import { Router } from 'express';
import userController from '../controlers/user.Controller.js';
const router = Router();

router.get('/', userController.getAllUsers);
router.get('/:uid', userController.getUser);
router.put('/:uid', userController.updateUser);
router.delete('/:uid', userController.deleteUser);

export default router;