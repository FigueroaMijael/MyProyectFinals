import { generateUser, generateProduct } from "../utils/faker.js";

 const getAllUser = (req, res) => {
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

 const getAllProduct = (req, res) => {
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

export default {
    getAllUser,
    getAllProduct
}