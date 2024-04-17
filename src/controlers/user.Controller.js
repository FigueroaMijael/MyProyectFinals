import { userService } from "../services/service.js";
import { uploader } from "../utils/multer.js";

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

const logoutUser = async (req, res) => {
    const { uid } = req.params;

    try {
        const user = await userService.getAll(uid);

        if (!user) {
            return res.status(404).json({ status: "error", error: "User not found" });
        }

        // Limpiar la cookie de autenticación
        res.clearCookie("CookieToken");

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error logging out user:", error);
        return res.status(500).json({ status: "error", error: "Internal server error" });
    }
};


const updateUserToPremium = async (req, res) => {
    const { uid } = req.params;

    try {
        const user = await userService.getAll(uid);
        if (!user) {
            return res.status(404).json({ status: "error", error: "Usuario no encontrado" });
        }

        // Verificar si el usuario ya es premium
        if (user.role === 'premium') {
            return res.status(400).json({ status: "error", error: "El usuario ya es premium" });
        }


        // Promesa para subir los archivos
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

        // Subir archivos y luego actualizar el usuario
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



export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    uploadDocuments,
    logoutUser,
    updateUserToPremium
};