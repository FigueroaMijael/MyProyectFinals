/* IMPLEMENTACION CON FACTORY
import {userService} from '../services/factory.js' 
*/

//IMPLEMENTACION CON REPOSITORY
import {userService} from '../services/service.js'
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { generateJWToken, verifyResetToken } from '../utils/jwt.js'
import UsersDto from '../services/dto/users.dto.js'
import { EErrors } from '../utils/customLogger/errors-enum.js';
import { devLogger, prodLogger } from '../utils/logger.js'
import config from '../config/config.js';


const logger = config.environment === 'production' ? prodLogger : devLogger;

 const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });

        const user = await userService.findByUsername(email);

        logger.info(`iniciando session con el user ${email}`)

        if (!user) {
            const error = {
                name: "JWTControllerError",
                cause: "Usuario no encontrado con username: " + email,
                code: EErrors.NOT_FOUND,
                message: "User Not Found"
            };
            throw error;
        }

        if (!isValidPassword(user, password)) {
            const error = {
                name: "JWTControllerError",
                cause: "El usuario o la contraseña son incorrectas",
                code: EErrors.UNAUTHORIZED,
                message: "Invalid username or password"
            };
            throw error;
        }

        const tokenUserDto = UsersDto.getUserTokenFrom(user)

        const access_token = generateJWToken(tokenUserDto);

        res.cookie('CookieToken', access_token, { maxAge: 3600000 }).send({ status: 200, message: "Logged in" })
    } catch (error) {
        next(error);
    }
};

 const register = async (req, res, next) => {
    
    const { name, lastName, email, age, password } = req.body;
    if (!name || !lastName || !email || !age || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });

    logger.info(`registrando usuario con email: ${email}`)

    const exists = await userService.findByUsername(email);

    if (exists) {
        const error = {
            name: "JWTControllerError",
            cause: "Usuario ya existe",
            code: EErrors.UNAUTHORIZED,
            message: "Usuario ya existe en la base de datos"
        };
        throw error;
    }

    const user = {
        name,
        lastName,
        age,
        email,
        password: createHash(password)
    };
    
    try {
        const userCreate = await userService.save(user);
        res.status(200).json({ status: "success", message: "Usuario creado con éxito", payload: userCreate });
    } catch (error) {
        next(error);
    }
};


 const resetPassword = async (req, res, next) => {
    try {
        const { token, email, newPassword } = req.body;

        const verifyToken = verifyResetToken(token)

        if (verifyToken) {
            const error = {
                name: "Token invalid",
                cause: "El token es invalido o ya expiro",
                code: EErrors.TOKEN_ERROR,
                message: "El token es invalido o ya expiro"
            };
            throw error;
        }

        const user = await userService.findByUsername(email);

        logger.info(`Iniciando Reset password del usuario con email: ${email}`)

        if (!user) {
            const error = {
                name: "JWTControllerError",
                cause: "Usuario no encontrado con username: " + email,
                code: EErrors.NOT_FOUND,
                message: "User Not Found"
            };
            throw error;
        }

        const hashedPassword = createHash(newPassword);

        const updateResult = await userService.update({ email }, { password: hashedPassword });

        if (updateResult && updateResult.modifiedCount > 0) {
            return res.status(200).send({ status: "success", message: "Contraseña cambiada exitosamente" });
        } else { 
            const error = {
                name: "Internal Error",
                cause: "Ocurrio un error al restablecer la contraseña del usuario con email: " + email,
                code: EErrors.INTERNAL_SERVER_ERROR,
                message: "No se pudo realizar el reset password"
            };
            throw error;
        }
    } catch (error) {
        next(error)
    }
};

export default {
    login,
    register,
    resetPassword
}