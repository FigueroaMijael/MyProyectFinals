import { userService } from "../services/service.js";
import { uploader } from "../utils/multer.js";
import { devLogger, prodLogger } from '../utils/logger.js'
import config from '../config/config.js';

const logger = config.environment === 'production' ? prodLogger : devLogger;

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
    const {name, lastName, age, email, role}  = req.body;
    

    const user = await userService.getAll(uid);

    if (!user) return res.status(404).send({ status: "error", error: "User not found" })

    const updatedUser = await userService.update(uid, {name, lastName, age, email, role} );
    return res.status(200).json({ message: "Dato actualizado correctamente", dato: updatedUser });
}

const deleteUser = async (req, res) => {
    const {uid} = req.params;

    const userDelete = await userService.delete(uid)

    return  res.status(200).json({ message: "Usuario eliminado correctamente", dato: userDelete });
}

const uploadDocuments = async (req, res) => {
    const { uid } = req.params;
    
    const user = await userService.getAll(uid);
    if (!user) return res.status(404).send({ status: "error", error: "User not found" });

    uploader.array('avatar')(req, res, async (err) => {
        if (err) {
            console.error("Error al subir archivos:", err);
            return res.status(500).send({ status: "error", error: "Error uploading files" });
        }

        const files = req.files;

        user.documents = files.map(file => ({
            name: file.originalname,
            reference: file.path
        }));
        
        await user.save();

        return res.status(200).json({ message: "Documentos subidos y usuario actualizado correctamente", user });
    });
};


const updateUserToPremium = async (req, res) => {
    const { uid } = req.params;

    try {
        const user = await userService.getAll(uid);
        if (!user) {
            return res.status(404).json({ status: "error", error: "Usuario no encontrado" });
        }

        if (user.role === 'premium') {
            return res.status(400).json({ status: "error", error: "El usuario ya es premium" });
        }

        const uploadFiles = new Promise((resolve, reject) => {
            uploader.array('documents')(req, res, (err) => {
                if (err) {
                    console.error("Error al subir archivos:", err);
                    reject(err);
                } else {
                    resolve(req.files);
                }
            });
        });

        uploadFiles.then(async (files) => {
            user.role = 'premium';
            user.documents = files.map(file => ({
                name: file.originalname,
                reference: file.path
            }));
            await user.save();
            return res.status(200).json({ message: "Usuario actualizado a premium correctamente", user });
        }).catch((err) => {
            console.error("Error al subir archivos:", err);
            return res.status(500).json({ status: "error", error: "Error uploading files" });
        });
    } catch (error) {
        console.error("Error al actualizar usuario a premium:", error);
        return res.status(500).json({ status: "error", error: error.message });
    }
};

const deleteUserAFK = async (req, res, next) => {
    try {
        const inactiveSince = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        console.log("Checking for inactive users since:", inactiveSince);

        const inactiveUsers = await userService.findInactiveUsers(inactiveSince);
        console.log("Inactive users found:", inactiveUsers);

        await Promise.all(inactiveUsers.map(async (user) => {
            console.log("Deleting inactive user:", user.email);
            await userService.delete(user._id);
        }));

        console.log("Inactive users deleted successfully");
    } catch (error) {
        console.error("Error checking or deleting inactive users:", error);
    }
};

setInterval(deleteUserAFK, 20 * 24 * 60 * 60 * 1000);

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    uploadDocuments,
    updateUserToPremium, 
    deleteUserAFK
};