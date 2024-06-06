// Importamos las funciones necesarias desde los módulos 'url' y 'path':
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from 'bcrypt';
import passport from "passport";
import winston from "winston";
import { config } from "../config/config";

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url) 
const __dirname = dirname(__filename)
export default __dirname;

export const cookieExtractor = req => {
    let token;
    if (req && req.cookies) {  
        token = req.cookies['coderCookie'] 
    }
    return token;
}

export const passportCall = (strategy) => {
    return async(req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({error: info.messages ? info.messages: info.toString()})
            }
            req.user = user;
            next();
        }) (req, res, next);
    }
}

export const passportCallForHome = (strategy) => {
    return async(req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        }) (req, res, next);
    }
}

const customLevels = {
    fatal:0,
    error:1,
    warning:2,
    info:3,
    http:4,
    debug:5
}

export const logger = winston.createLogger(
    {
        levels: customLevels,
        transports:[
            new winston.transports.File({
                level: "info",
                filename: "./src/logs/error.log",
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                )
            })
        ]
    }
)

const transporteConsola = new winston.transports.Console(
    {
        level:"debug",
        filename: "./src/logs/error.log",
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        )
    }
)

if(config.MODE!="production"){
    logger.add(transporteConsola)
}

export const middLogg = (req, res, next)=>{
    req.logger=logger
    next()
}