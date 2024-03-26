const express = require("express")
const path = require("path")
const engine = require("express-handlebars").engine
const { Server } = require("socket.io")
const productsRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")
const viewsRouter = require("./routes/views.router")
const { default: mongoose } = require("mongoose")

const PORT = 8080

let io
let usuarios = []
let mensajes = []
const app = express()

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "/views"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, "/public")))

app.use("/", viewsRouter)
app.use("/api/products", (req, res, next) => {
    req.io = io
    next()
}, productsRouter)

/* app.use("/api/carts", (req, res, next) => {
    req.io = io
    next()
}, cartsRouter) */

app.get("*", (req, res) => {
    res.setHeader("Content-Type", "text/plain")
    res.status(404).send("Error 404 - Page Not Found")
})

const server = app.listen(PORT, () => {
    console.log(`Server ON LINE en puerto ${PORT}`)
})

io = new Server(server)

io.on("connection", socket=>{
    console.log(`Se conecto un cliente con id ${socket.id}`)
    
    socket.on("presentacion", nombre=>{
        usuarios.push({id:socket.id, nombre})
        socket.emit("historial", mensajes)
        // console.log(nombre)
        socket.broadcast.emit("nuevoUsuario", nombre)
    })

    socket.on("mensaje", (nombre, mensaje)=>{
        mensajes.push({nombre, mensaje})
        io.emit("nuevoMensaje", nombre, mensaje)
    })

    socket.on("disconnect", ()=>{
        let usuario=usuarios.find(u=>u.id===socket.id)
        if(usuario){
            socket.broadcast.emit("saleUsuario", usuario.nombre)
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
