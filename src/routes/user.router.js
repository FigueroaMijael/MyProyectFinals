import { Router } from 'express';
import userController from '../controlers/user.Controller.js';
const router = Router();

router.get('/', userController.getAllUsers);
router.get('/:uid', userController.getUser);
router.put('/:uid', userController.updateUser);
router.delete('/:uid', userController.deleteUser);
router.post('/:uid/logout', userController.logoutUser);

router.post('/premium/:uid', userController.updateUserToPremium);

router.post('/:uid/documents', userController.uploadDocuments);

export default router;

