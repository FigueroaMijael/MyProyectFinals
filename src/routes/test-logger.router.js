import { Router } from "express";
import {loginUser, registerUser} from '../controllers/sessions.controller.js';

const router = Router();

router.post("/login", loginUser);

router.post("/register", registerUser);

router.get("/operation/simple", (req, res) => {
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
        sum += i;
    };
    res.send({sum});
});

router.get("/operation/complex", (req, res) => {
    let sum = 0;
    for (let i = 0; i < 5e8; i++) {
        sum += i;
    }
    res.send({sum});
});

export default router;