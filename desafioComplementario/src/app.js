const express = require("express")
const path = require("path")
const engine = require("express-handlebars").engine
const { Server } = require("socket.io")
const productsRouter = require("./routes/products.router")
const cartRouter = require("./routes/carts.router")
const viewsRouter = require("./routes/views.router")
const ProductManager = require("./dao/ProductManagerFS")
const { default: mongoose } = require("mongoose")

const PORT = 8080
const rutaProducts = path.join(__dirname, "/desafio4", "/src", "/data", "/products.json")
const pm = new ProductManager(rutaProducts)

let io
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
app.use("/api/cart", (req, res, next) => {
    req.io = io
    next()
}, cartRouter)

app.get("*", (req, res) => {
    res.setHeader("Content-Type", "text/plain")
    res.status(404).send("Error 404 - Page Not Found")
})

const server = app.listen(PORT, () => {
    console.log(`Server ON LINE en puerto ${PORT}`)
})

io = new Server(server)

io.on("connection", socket => {
    console.log(`Cliente conectado con id ${socket.id}`);
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
