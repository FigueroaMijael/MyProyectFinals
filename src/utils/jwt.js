import config from '../config/config.js'
import jwt  from 'jsonwebtoken';

export const generateJWToken = (user) => {
    return jwt.sign({user}, config.jwtPrivateKey, {expiresIn: '24h'});
}

export const generateResetToken = () => {
  
   return jwt.sign({ expiresIn: '1h' }, config.resetJwtPrivateKey);
}

export const verifyResetToken = (token) => {
   try {
       const decoded = jwt.verify(token, config.resetJwtPrivateKey);
       if (decoded.exp && decoded.exp < currentTimestamp) {
           throw new CustomError({
               name: 'ResetTokenExpiredError',
               message: 'El token de restablecimiento ha expirado',
               code: EErrors.TOKEN_EXPIRED_ERROR,
               logger: console
           });
       }
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