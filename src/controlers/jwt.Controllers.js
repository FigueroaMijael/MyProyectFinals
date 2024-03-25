/* IMPLEMENTACION CON FACTORY
import {userService} from '../services/factory.js' 
*/

//IMPLEMENTACION CON REPOSITORY
import {userService} from '../services/service.js'
import { isValidPassword, generateJWToken, createHash, verifyResetToken } from '../../utils.js';
import UsersDto from '../services/dto/users.dto.js'
import CustomError from '../config/Errors/customError/customError.js';
import { EErrors } from '../config/Errors/customError/errors-enum.js';
import { devLogger, prodLogger } from '../config/logger/logger.js'
import config from '../config/config.js';

const logger = config.environment === 'production' ? prodLogger : devLogger;

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userService.findByUsername(email);

        if (!user) {
            throw new CustomError("User Not Found", "JWTControllerError", "Usuario no encontrado con username: " + email , EErrors.NOT_FOUND, logger);
        }

        if (!isValidPassword(user, password)) {
            throw new CustomError({
                name: "JWTControllerError",
                message: "El usuario y la contraseña no coinciden!",
                code: EErrors.UNAUTHORIZED
            });
        }

        const tokenUser = {
            name: `${user.name} ${user.lastName}`,
            email: user.email,
            age: user.age,
            role: user.role
        };
        const access_token = generateJWToken(tokenUser);

        res.cookie('jwtCookieToken', access_token, { httpOnly: true });

        res.send({ message: "Login successful!" });
    } catch (error) {
        CustomError.createError({ name: "JWTControllerError", cause: error, message: "Error interno de la aplicación.", code: EErrors.INTERNAL_SERVER_ERROR, logger});
    }
};

export const registerUser = async (req, res) => {
    const { name, lastName, email, age, password } = req.body;

    const exists = await userService.findByUsername(email);

    if (exists) {
        CustomError.createError({ name: "JWTControllerError", message: "Usuario ya existe.", code: EErrors.UNAUTHORIZED, logger})
    }

    const user = {
        name,
        lastName,
        age,
        email,
        password: createHash(password)
    };

    const userDto = new UsersDto(user);
    
    try {
        await userService.save(userDto);
        res.status(201).send({ status: "success", message: "Usuario creado con éxito." });
    } catch (error) {
        CustomError.createError({ name: "JWTControllerError", cause: error, message: "Error interno de la aplicación.", code: EErrors.SERVER_ERROR, logger });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { token, email, newPassword } = req.body;

        console.log(token);

        const verifyToken = verifyResetToken(token)

        if (verifyToken) {
            return res.status(500).send({ status: "error", error: "El token no es valido" });
        }

        const user = await userService.findByUsername(email);

        if (!user) {
            return res.status(404).send({ status: "error", error: "El usuario no existe" });
        }

        const hashedPassword = createHash(newPassword);

        const updateResult = await userService.update({ email }, { password: hashedPassword });

        console.log(updateResult);

        if (updateResult && updateResult.modifiedCount > 0) {
            return res.status(200).send({ status: "success", message: "Contraseña cambiada exitosamente" });
        } else {
            throw new Error('Ocurrió un error al momento de restablecer la contraseña');
        }
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        return res.status(500).send({ status: "error", error: "Error interno de la aplicación." });
    }
};
