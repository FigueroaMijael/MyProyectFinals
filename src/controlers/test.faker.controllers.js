import { generateUser, generateProduct } from "../../utils.js";

export const getAllUser = (req, res) => {
    try {
        let users = [];
        for (let i = 0; i < 5; i++) {
            users.push(generateUser());
        }
        res.send({ status: "success", payload: users });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener los usuarios:" });
    }
};

export const getAllProduct = (req, res) => {
    try {
        let product = [];
        for (let i = 0; i < 5; i++) {
            product.push(generateProduct());
        }
        res.send({ status: "success", payload: users });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener los usuarios:" });
    }
};