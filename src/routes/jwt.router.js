import { Router } from "express";
import { loginUser, registerUser, resetPassword } from '../controlers/jwt.Controllers.js';

const router = Router();

router.post("/login", loginUser);

router.post("/register", registerUser);

router.put("/resetPassword", resetPassword);

export default router;
