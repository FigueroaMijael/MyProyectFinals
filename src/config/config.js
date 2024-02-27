import { Command } from 'commander';
import dotenv from 'dotenv'

const program = new Command();

program
    .option('-d', 'Varaible para debug', false) 
    .option('--persist <persist>', 'Modo de persistencia', "mongodb")
    .option('--mode <mode>', 'Modo de trabajo', 'prod')
program.parse(); 

console.log("Environment Mode Option: ", program.opts().mode);
console.log("Persistence Mode Option: ", program.opts().persist);

console.log("PERSISTENCE:::");
console.log(program.opts().persist);

const persistence = program.opts().persist
const environment = program.opts().mode;

dotenv.config({
    path: environment === "prod" ? "./src/config/.env.production" : "./src/config/.env.development"
});

export default {
    port: process.env.PORT,
    urlMongo: process.env.MONGO_URL,
    gitId: process.env.GITHUB_ID,
    gitClientId: process.env.GITHUB_CLIENT_ID,
    gitClientSecret: process.env.CLIENT_SECRET,
    gitUrlCallback: process.env.GITHUB_URLCALLBACK,
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
    persistence
    
};
