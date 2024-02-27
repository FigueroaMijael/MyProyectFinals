/* IMPLEMENTACION CON FACTORY
import {userService} from '../services/factory.js' 
*/

//IMPLEMENTACION CON REPOSITORY
import {userService} from '../services/service.js'
import { isValidPassword, generateJWToken, createHash } from '../../utils.js';
import UsersDto from '../services/dto/users.dto.js'


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userService.findByUsername(email);

        if (!user) {
            return res.status(400).send({ error: "Not found", message: "Usuario no encontrado con username: " + email });
        }
        if (!isValidPassword(user, password)) {
            return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
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
        console.error(error);
        return res.status(500).send({ status: "error", error: "Error interno de la aplicación." });
    }
};

export const registerUser = async (req, res) => {
    const { name, lastName, email, age, password } = req.body;



    const exists = await userService.findByUsername(email);

    if (exists) {
        return res.status(401).send({ status: "error", message: "Usuario ya existe." });
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
        return res.status(201).send({ status: "success", message: "Usuario creado con éxito." });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", error: "Error interno de la aplicación." });
    }
};