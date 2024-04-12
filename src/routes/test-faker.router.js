import { Router } from "express";
import fakerController from "../controlers/test.faker.controllers.js";

const router = Router();

router.get("/user", fakerController.getAllUser);
router.get("/product", fakerController.getAllProduct);

export default router;