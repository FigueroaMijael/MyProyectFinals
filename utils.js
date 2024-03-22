import {fileURLToPath} from 'url';
import { dirname } from 'path';

import { es, faker } from '@faker-js/faker';

import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';
import passport from 'passport';
import config from './src/config/config.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

export const generateJWToken = (user) => {
     return jwt.sign({user}, config.jwtPrivateKey, {expiresIn: '24h'});
}

export const generateResetToken = () => {
    return jwt.sign({}, config.resetJwtPrivateKey, { expiresIn: '1h' });
}

export const verifyResetToken = (token) => {
    try {
        
        const decoded = jwt.verify(token, config.resetJwtPrivateKey);
        return decoded;

    } catch (error) {

        if (error.name === 'TokenExpiredError') {

            throw new CustomError({
                name: 'ResetTokenExpiredError',
                message: 'El token de restablecimiento ha expirado',
                code: EErrors.TOKEN_EXPIRED_ERROR,
                logger: console
            });
        } else if (error.name === 'JsonWebTokenError') {

            throw new CustomError({
                name: 'ResetTokenInvalidError',
                message: 'El token de restablecimiento es inválido',
                code: EErrors.TOKEN_INVALID_ERROR,
                logger: console
            });
        } else {

            throw new CustomError({
                name: 'ResetTokenVerificationError',
                message: 'Error interno al verificar el token de restablecimiento',
                code: EErrors.TOKEN_VERIFICATION_ERROR,
                logger: console
            });
        }
    }
};

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (error, user, info) {
            if(error) return next(error);
            if(!user) {
                return res.status(401).send({error: info.messages?info.messages:info.toString()});
            }
            req.user = user;
            next()
        })(req, res, next);
    }
}

export const authorization = (roles) => {
    return async (req, res, next) => {
        if (req.user && roles.includes(req.user.role)){
            next();
        } else {
            res.status(403).json({ error: 'Acceso prohibido, El usuario no tiene permisos con este rol.' });
        }
    }
};

export const authToken = (req,res,next) => {

    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send({error: "User not authenticated or missing token"});
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, config.jwtPrivateKey, (error, credential) => {
        if(error) return res.status(403).send({error: "Token invalid, unauthorized!"})

        req.user = credential.user;
        req.user = decodedToken.user;
        console.log(req.user);
        next();
    })
}



///////////////////////////////////////////////////////
faker.location = es
export const generateUser = () => {
    let numOfProducts = faker.number.int({min: 5 , max: 15})
    // Crear una lista de roles posibles
    const roles = ['admin', 'usuario', 'editor', 'invitado'];
    let products = [];
    for (let i = 0; i < numOfProducts; i++) {
        products.push(generateProduct());
    }
    return {
        name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        sex: faker.person.sex(),
        birthDate: faker.date.birthdate(),
        products: products,
        image: faker.image.avatar(),
        id: faker.database.mongodbObjectId(),
        email: faker.internet.email(),
        rol: roles[Math.floor(Math.random() * roles.length)]
    };
};

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        stock: faker.number.int({min: 5 , max: 15}),
        id: faker.database.mongodbObjectId(),
        image: faker.image.avatar()
    }
};

export default __dirname;