import { Router } from "express";
import { getAllUser, getAllProduct } from "../controlers/test.faker.controllers.js";

const router = Router();

router.get("/user", getAllUser);
router.get("/product", getAllProduct);

export default router;