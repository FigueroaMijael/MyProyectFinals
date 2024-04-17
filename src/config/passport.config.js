import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import GithubStrategy from 'passport-github2';
import config from '../config/config.js';
import  usersModel  from "../modelsMongo/users.model.js";

const cookieExtractor = req => {
    let token = null;
    
    if (req && req.cookies) {
        token = req.cookies['CookieToken']
    }
    return token;
};

const initializePassport = () => {
    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: config.jwtPrivateKey
        }, async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload.user)
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('github', new GithubStrategy({
        clientID: config.gitClientId,
        clientSecret: config.gitClientSecrett,
        callbackUrl: config.gitUrlCallback
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await usersModel.findOne({email: profile._json.email})
                if(!user) {
                    req.logger.warn("User doesn't exists with username: " + profile._json.email);
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
                    return done(null, user)
                }  
            } catch (error) {
                return done(error);
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
            return done(error);
        }
    });
}

export default initializePassport;
