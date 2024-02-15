import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import config from './src/config/config.js';
import MongoSingleton from './src/config/DBConect/mongodb-singleton.js';
import cors from 'cors';

//Passport imports

//Routers
import productRouter from './src/routes/product.router.js';
import cartRouter from './src/routes/cart.router.js'
//import usersViewRouter from './routes/users.views.router.js';
//Custom - Extended


const app = express();

//JSON settings:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

//Declare routers:
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
//app.use("/users", usersViewRouter);

// const SERVER_PORT = 9090;
const SERVER_PORT = config.port;

// Configura el middleware cors con opciones personalizadas
const corsOptions = {
    // Permitir solo solicitudes desde un cliente específico
    origin: 'http://127.0.0.1:5502',

    // Configura los métodos HTTP permitidos
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',

    // Configura las cabeceras permitidas
    allowedHeaders: 'Content-Type,Authorization',

    // Configura si se permiten cookies en las solicitudes
    credentials: true,
};
app.use(cors(corsOptions));


// Inicia el servidor
app.listen(SERVER_PORT, async () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
    try {
        await MongoSingleton.getInstance();
        console.log("Conexión exitosa a MongoDB.");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        // Aquí podrías agregar lógica adicional para manejar el error, como intentar reconectar o salir del proceso.
    }
});








