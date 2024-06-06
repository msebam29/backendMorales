import express from "express"; 
import __dirname, { logger, middLogg } from "../src/utils/utils.js"; 
import handlebars from 'express-handlebars'; 
import { Server } from "socket.io"; 
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import productsRouter from './routers/products.router.js'; 
import cartsRouter from './routers/carts.router.js';
import sessionRouter from './routers/sessions.router.js';
import usersRouter from './routers/users.router.js'
import viewsRouter from './routers/views.router.js';
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { productService } from "./services/index.js";
import { messageService } from "./services/index.js";
import { userService } from "./services/index.js";
import {config} from './config/config.js';

const app = express()
const port = config.PORT || 8080;
const httpServer = app.listen( port , () => {logger.info('Server ON in port:', port)})
const socketServer = new Server(httpServer);

app.use(middLogg)
app.use(express.json()); 
app.use(express.urlencoded({extended:true})); 
app.use(express.Router()); 
mongoose.connect(process.env.MONGO_URL)

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.MONGO_URL,
        ttl:3600
    }),
    secret: 'CoderSecret',
    resave: false,
    saveUninitialized: false
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use('/static' , express.static(__dirname +'/src/public'));

app.engine('handlebars' , handlebars.engine());
app.set('views', __dirname + '/src/views');
app.set('view engine', 'handlebars');

app.use('/api/products' , productsRouter); 
app.use('/api/carts' , cartsRouter); 
app.use('/api/sessions', sessionRouter); 
app.use('/api/users' , usersRouter); 
app.use('/', viewsRouter); 

socketServer.on('connection', async (socket) => {
    console.log("nuevo cliente conectado 2")
    socket.on('authenticated', data => {
        console.log(data)
        socket.broadcast.emit('newUserConnected', data);
    })
    socket.on('message', async data => {
        console.log(data)
        const addMessage = await messageService.addMessages(data);
        const messages = await messageService.getMessages(); 
        socket.emit('messageLogs', messages);
    })
});

export default app;
