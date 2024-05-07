import passport from 'passport';



export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (error, user, info) {
            if(error) return next(error);
            if(!user) {
               req.user = null
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
            res.status(403).render('403');
        }
    }
};