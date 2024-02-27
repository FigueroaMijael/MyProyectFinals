import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import GithubStrategy from 'passport-github2';
import config from '../config.js';
import { usersModel } from "../../services/dao/mongodb/models/users.model.js";

// Definir cookieExtractor antes de su uso en JwtStrategy
const cookieExtractor = req => {
    let token = null;
    console.log("Entrando a Cookie Extractor");
    if (req && req.cookies) {
        console.log("Cookies presentes: ");
        console.log(req.cookies);
        token = req.cookies['jwtCookieToken']
        console.log("Token obtenido desde Cookie:");
        console.log(token);
    }
    return token;
};

const initializePassport = () => {
    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: config.jwtPrivateKey
        }, async (jwt_payload, done) => {
            console.log("Entrando a passport Strategy con JWT.");
            try {
                console.log("JWT obtenido del Payload");
                console.log(jwt_payload);
                return done(null, jwt_payload.user)
            } catch (error) {
                return done(error)
            }
        }
    ));

    passport.use('github', new GithubStrategy({
        clientID: config.gitClientId,
        clientSecret: config.gitClientSecrett,
        callbackUrl: config.gitUrlCallback
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log("Profile obtenido del usuario de github: ");
            console.log(profile);
            try {
                const user = await usersModel.findOne({email: profile._json.email})
                console.log("Usuario encontrado para login:");
                console.log(user);
                if(!user) {
                    console.warn("User doesn't exists with username: " + profile._json.email);
                    let NewUser = {
                        first_name: profile._json.name,
                        last_name: ' ', 
                        email: profile._json.email, 
                        age: '',
                        password: '',
                        loggedBy: 'GitHub'   
                    }
                    const result = await usersModel.create(NewUser);
                    return done(null, result);
                } else {
                    console.log('user exists')
                    return done(null, user)
                }
                
            } catch (error) {
                return done(error)
            }
        })
    );
    
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (_id, done) => {
        try {
            let user = await usersModel.findById(_id);
            done(null, user);
        } catch (error) {
            console.error("Error deserializando el usuario: " + error);
        }
    });
}

export default initializePassport;
