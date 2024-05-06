import { Command } from 'commander';
import dotenv from 'dotenv'

const program = new Command();

program
    .option('-d', 'Varaible para debug', false) 
    .option('--test', 'Variable para correr los test', false)
    .option('--persist <persist>', 'Modo de persistencia', "mongodb")
    .option('--mode <mode>', 'Modo de trabajo', 'development')
program.parse(); 

const persistence = program.opts().persist
const environment = program.opts().mode;
const test = program.opts().test;

dotenv.config({
    path: environment === "production" ? "./src/config/.env.production" : "./src/config/.env.development"
});

export default {
    port: process.env.PORT,
    urlMongo: process.env.MONGO_URL,
    gitId: process.env.GITHUB_ID,
    gitClientId: process.env.GITHUB_CLIENT_ID,
    gitClientSecret: process.env.CLIENT_SECRET,
    gitUrlCallback: process.env.GITHUB_URLCALLBACK,
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
    resetJwtPrivateKey: process.env.RESET_JWT_PRIVATE_KEY,
    gmailAccount: process.env.GMAIL_ACCOUNT,
    gmailAppPassword: process.env.GMAIL_APP_PASSWD,
    mpAccessTokenTest: process.env.MP_ACCESS_TOKEN,
    persistence: persistence, 
    environment: environment,
    test: test
};
