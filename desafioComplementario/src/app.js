const express = require("express")
const path = require("path")
const engine = require("express-handlebars").engine
const { Server } = require("socket.io")
const productsRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")
const viewsRouter = require("./routes/views.router")
const { default: mongoose } = require("mongoose")
const MessagesManagerMongo = require("./dao/MessagesManagerMongo")

const PORT = 8080
const app = express()
const mm = new MessagesManagerMongo()

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "/views"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, "/public")))

app.use("/", viewsRouter)
app.use("/api/products", productsRouter)
/* app.use("/api/carts", cartsRouter) */

app.get("*", (req, res) => {
    res.setHeader("Content-Type", "text/plain")
    res.status(404).send("Error 404 - Page Not Found")
})

const server = app.listen(PORT, () => {
    console.log(`Server ON LINE en puerto ${PORT}`)
})

const io=new Server(server)   // websocket server

io.on("connection", socket=>{
    console.log(`Se conecto un cliente con id ${socket.id}`)
    
    socket.on("presentacion", async email=>{
        let usuario = await mm.createUser({id:socket.id, email})
        let mensajes= await mm.getMessagesByEmail({email})/* .messages */
        console.log(mensajes);
        
        socket.emit("historial", mensajes)
        
        socket.broadcast.emit("nuevoUsuario", usuario)
    })

    socket.on("mensaje", async (email, mensaje)=>{
        await mm.addMessages({email, mensaje})
        io.emit("nuevoMensaje", email, mensaje)
    })

    socket.on("disconnect", async ()=>{
        let id = socket.id
        let usuario=await mm.getMessagesBySocketId({id})
        if(usuario){
            socket.broadcast.emit("saleUsuario", usuario.email)
        } 
    })
})

const connect = async ()=>{
    try {
        await mongoose.connect("mongodb+srv://msebam29:codercoder@cluster0.vwoagpr.mongodb.net/?retryWrites=true&w=majority")
        console.log('DB conectada');
    } catch (error) {
        console.log("Error en la conexión a DB. Detalle", error.message);
        
    }
}
connect()
