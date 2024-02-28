const CartManager = require("../managers/CartManager")
const { join } = require("path")
const Router = require("express").Router
const router = Router()

/* let cid = 0
let rutaCart = join(__dirname, "..", "/data", `cart${cid}.json`)
const cm = new CartManager(rutaCart) */

router.get("/:cid", async (req, res) => {
    let cid = Number(req.params.cid)
    if (isNaN(cid)) {
        return res.status(400).json({error:"El id del carrito debe ser numérica"})
    }
    let rutaCart = join(__dirname, "..", "/data", `cart${cid}.json`)
    const cm = new CartManager(rutaCart)
    try {
        let products = await cm.getCart()
        res.status(200).json({products})
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito" })
    }
})

router.post("/:cid", async (req, res) => {
    let cid = Number(req.params.cid)
    if (isNaN(cid)) {
        return res.status(400).json({error:"El id del carrito debe ser numérica"})
    }
    let rutaCart = join(__dirname, "..", "/data", `cart${cid}.json`)
    const cm = new CartManager(rutaCart)

    let productsCart=cm.getCart()
    res.status(200).json({productsCart})
})

router.post("/:cid/product/:pid", async (req, res) => {
    let cid = Number(req.params.cid)
    if (isNaN(cid)) {
        return res.status(400).json({error:"El id del carrito debe ser numérica"})
    }
    let rutaCart = join(__dirname, "..", "/data", `cart${cid}.json`)
    const cm = new CartManager(rutaCart)
    
    let id = Number(req.params.pid)
    if (isNaN(id)) {
        return res.status(400).json({error:"El id debe ser numérico"})
    }
    let quantity = Number(req.body.quantity)
    if (isNaN(quantity)) {
        return res.status(400).json({error:"La cantidad debe ser numérica"})
    }
    
    let newProductCart = await cm.addProduct (id, quantity)
    res.status(201).json(newProductCart)
})

module.exports = router