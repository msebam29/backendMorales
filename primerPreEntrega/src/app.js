const express = require("express")
const productsRouter= require ("./routes/products.router")
const cartRouter=require("./routes/cart.router")
const PORT = 8080

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/products", productsRouter)
app.use("/api/cart", cartRouter)

app.get("/", (req, res)=>{
    res.setHeader("Content-Type", "text/plain")
    res.status(200).send("OK")
})

app.get("*", (req, res) => {
    res.send("Error 404 - Not Found")
})
app.listen(PORT, () => {
    console.log(`Server ON LINE en puerto ${PORT}`)
})

