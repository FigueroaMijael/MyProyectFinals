import { Router } from "express";
import usersController from '../controlers/jwt.Controllers.js';

const router = Router();

router.post("/login", usersController.login );

router.post('/:uid/logout', usersController.logoutUser);

router.post("/register", usersController.register);

router.put("/resetPassword", usersController.resetPassword);

export default router;
