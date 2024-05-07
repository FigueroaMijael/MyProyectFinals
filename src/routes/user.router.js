import { Router } from 'express';
import userController from '../controlers/user.Controller.js';
import { passportCall, authorization } from '../utils/passport.js';
const router = Router();

router.get('/', userController.getAllUsers);

router.get('/:uid', userController.getUser);

router.put('/:uid', userController.updateUser);

router.delete('/:uid', passportCall('jwt'), authorization(['admin']), userController.deleteUser);

router.delete('/deleteUserAFK', userController.deleteUserAFK)

router.post('/premium/:uid', userController.updateUserToPremium);

router.post('/:uid/documents', userController.uploadDocuments);

export default router;

