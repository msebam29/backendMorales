const express = require("express")
const ProductManager = require("./ProductManager")

const PORT=3000
const app = express()

const pm = new ProductManager("./products.json")

app.get("/products", async (req, res) => {
    let products = await pm.getProducts

    res.json(products)
})



app.listen(PORT, ()=>{
    console.log(`Server ON LINE en puerto ${PORT}`)
})

