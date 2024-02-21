const express = require("express")
const ProductManager = require("./ProductManager")

const PORT = 8080
const app = express()

const pm = new ProductManager("./products.json")

app.get("/products", async (req, res) => {
    try {
        let limit = req.query.limit
        let resultado = await pm.getProducts()
        if (limit && limit > 0) {
            resultado = resultado.slice(0, limit)
        }
        res.json(resultado)
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" })
    }
})

app.get("/products/:id", async (req, res) => {
    let {id} = req.params
    id = Number(id)
    if (typeof id != "number") {
        return res.send("El id debe ser numérico")
    }
    let product = await pm.getProductById(id)
    if(product){
        res.json(product)
    }else{
        res.status(404).send({ error: "Producto no encontrado" })
    }
})
app.get("*", (req, res) => {
    res.send("Error 404 - Not Found")
})
app.listen(PORT, () => {
    console.log(`Server ON LINE en puerto ${PORT}`)
})

