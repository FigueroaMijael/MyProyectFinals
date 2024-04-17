import express from 'express';
import handlebars from 'express-handlebars';
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import cors from 'cors';
import cookieParser from 'cookie-parser';
// chat
import { Server } from "socket.io"
import {chatService} from './src/services/service.js'
// configuracion
import config from './src/config/config.js';
import __dirname from './utils.js';
// Mongo connect 
import MongoSingleton from './src/config/DBConect/mongodb-singleton.js';
//Passport imports
import initializePassport from './src/config/passport.config.js'
//Routers
import renderRouter from './src/routes/renderView.router.js'
import productRouter from './src/routes/product.router.js';
import cartRouter from './src/routes/cart.router.js'
import usersRouter from './src/routes/user.router.js'
import jwtRouter from './src/routes/jwt.router.js'
import emailRouter from './src/routes/email.router.js'
// LOGGER
import {  customErrorMiddleware } from './src/utils/logger.js';
//SWAGGER
import swaggerUiExpress from "swagger-ui-express"
import swaggerJSDoc from "swagger-jsdoc";

import {authorization, passportCall} from './src/utils/passport.js'

import notFoundMiddleware from './src/middlewares/404NotFound.js';

//Custom - Extended
const app = express();
initializePassport()

//JSON settings:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Configuracion hbs
app.engine(
    "hbs",
    handlebars.engine({
      extname: "hbs",
      defaultLayout: "main",
      handlebars: allowInsecurePrototypeAccess(Handlebars),
    })
  );

  Handlebars.registerHelper('add', function (a, b) {
    return a + b;
});

  app.set("view engine", "hbs");
  app.set("views", `${__dirname}/src/views`);
  app.use(express.static(__dirname + '/src/public'))
  app.use("/socket.io", express.static(__dirname + '/socket.io/client-dist'));

const swaggerOptions = { 
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion API Adopme",
            description: "Documentacion para el uso de swagger. Modifica la ruta /api/cart/{CId}/product/{PId}/{quantity} y la ruta /api/cart/{CId}/product/{PId}/{quantity}. Analizar la ruta /api/cart/finalizePurchase "
        }
    },
    apis: [`./src/Swagger/**/*.yaml`]
};

const specs = swaggerJSDoc(swaggerOptions)

app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

//Declare routers:
app.use("/", renderRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", passportCall('jwt'), authorization(['user', 'premium']), cartRouter);
app.use("/api/users", usersRouter)
app.use("/api/jwt", jwtRouter);
app.use("/api/email", emailRouter);

app.use(customErrorMiddleware);
app.use(notFoundMiddleware)


const SERVER_PORT = config.port;

const httpServer = app.listen(SERVER_PORT, async () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
    try {
        await MongoSingleton.getInstance();
        console.log("Conexión exitosa a MongoDB.");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        process.exit();
    }
});


const io = new Server(httpServer);

app.set('socketio', io);

io.on('connection', async (socket) => {

    try {
        const allMessages = await chatService.getAll();

        socket.emit('messages', allMessages);
    } catch (error) {
        console.error(`Error al obtener todos los mensajes: ${error.message}`);
    }

    socket.on('message', async (data) => {
        try {
            const newMessage = await chatService.save(data.user, data.message);

            io.emit('messages', await chatService.getAll(newMessage));
        } catch (error) {
            console.error(`Error al procesar el mensaje en tiempo real: ${error.message}`);
        }
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});