import express from 'express';
import handlebars from 'express-handlebars';
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import cors from 'cors';
import cookieParser from 'cookie-parser';

// configuracion
import config from './src/config/config.js';
import __dirname from './utils.js';

// Mongo connect 
import MongoSingleton from './src/config/DBConect/mongodb-singleton.js';

//Passport imports
import initializePassport from './src/config/passport/passport.config.js'
//Routers
import renderRouter from './src/routes/renderView.router.js'
import productRouter from './src/routes/product.router.js';
import cartRouter from './src/routes/cart.router.js'
import jwtRouter from './src/routes/jwt.router.js'
import ticketRouter from './src/routes/ticket.router.js'

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

  app.set("view engine", "hbs");
  app.set("views", `${__dirname}/src/views`);
  app.use(express.static(__dirname + '/src/public'))

Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
  });


//Declare routers:
app.use("/", renderRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/jwt", jwtRouter);
app.use("/api/ticket", ticketRouter);



const SERVER_PORT = config.port;

app.listen(SERVER_PORT, async () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
    try {
        await MongoSingleton.getInstance();
        console.log("Conexión exitosa a MongoDB.");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        process.exit();
    }
});








