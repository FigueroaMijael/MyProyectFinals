/* IMPLEMENTACION CON FACTORY
import {userService} from '../services/factory.js' 
*/

//IMPLEMENTACION CON REPOSITORY
import {userService} from '../services/service.js'
import { isValidPassword, generateJWToken, createHash } from '../../utils.js';
import UsersDto from '../services/dto/users.dto.js'
import CustomError from '../config/Errors/customError/customError.js';
import { EErrors } from '../config/Errors/customError/errors-enum.js';

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userService.findByUsername(email);

        if (!user) {
            throw new CustomError({
                name: "JWTControllerError",
                message: "Usuario no encontrado con username: " + email,
                code: EErrors.NOT_FOUND
            });
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
        CustomError.createError({ name: "JWTControllerError", cause: error, message: "Error interno de la aplicación.", code: EErrors.INTERNAL_SERVER_ERROR, logger: req.logger });
    }
};

export const registerUser = async (req, res) => {
    const { name, lastName, email, age, password } = req.body;

    const exists = await userService.findByUsername(email);

    if (exists) {
        throw new CustomError({
            name: "JWTControllerError",
            message: "Usuario ya existe.",
            code: EErrors.UNAUTHORIZED
        });
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
        CustomError.createError({ name: "JWTControllerError", cause: error, message: "Error interno de la aplicación.", code: EErrors.INTERNAL_SERVER_ERROR, logger: req.logger });
    }
};
