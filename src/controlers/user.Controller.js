import { userService } from "../services/service.js";

const getAllUsers = async (req, res) => {
    const users = await userService.getAll();
    return res.status(200).json(users)
}

const getUser = async (req, res) => {
    const { uid } = req.params;

    const user = await userService.getAll( uid );
    if (!user) return res.status(404).send({ status: "error", error: "User not found" });
    return res.status(200).json(user)}

const updateUser = async (req, res) => {

    const {uid} = req.params;
    const {name, lastName, age}  = req.body;
    

    const user = await userService.getAll(uid);

    if (!user) return res.status(404).send({ status: "error", error: "User not found" })

    const updatedUser = await userService.update(uid, {name, lastName, age} );
    return res.status(200).json({ message: "Dato actualizado correctamente", dato: updatedUser });
}

const deleteUser = async (req, res) => {
    const {uid} = req.params;

    const userDelete = await userService.delete(uid)

    return  res.status(200).json({ message: "Usuario eliminado correctamente", dato: userDelete });
}

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
}