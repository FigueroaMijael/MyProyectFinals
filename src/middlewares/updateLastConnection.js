// Middleware para actualizar last_connection
const updateLastConnection = async (req, res, next) => {
    const user = req.user
        next();
};

export default updateLastConnection;
