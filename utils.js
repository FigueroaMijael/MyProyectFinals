import {fileURLToPath} from 'url';
import { dirname } from 'path';

import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';
import passport from 'passport';
import config from './src/config/config.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => {
    console.log(`Datos a validar: user-password: ${user.password}, password: ${password}`);
    return bcrypt.compareSync(password, user.password);
}

export const generateJWToken = (user) => {
     return jwt.sign({user}, config.jwtPrivateKey, {expiresIn: '24h'});
}

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
    console.log("Token present in header auth:");
    console.log(authHeader);

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

export default __dirname;