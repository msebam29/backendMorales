const CartManager = require("../managers/CartManager")
const { join } = require("path")
const Router = require("express").Router
const router = Router()

const rutaCart = join(__dirname, "..", "/data", "carts.json")
const cm = new CartManager(rutaCart)

router.post("/", async (req, res) => {
    let cart = await cm.createCart()
    res.status(200).json({ cart })
})

router.get("/:cid", async (req, res) => {
    let cid = Number(req.params.cid)
    if (isNaN(cid)) {
        return res.status(400).json({ error: "El id del carrito debe ser numérico" })
    }
    let cart = await cm.getCartById(cid)
    if (!cart) {
        res.status(404).json({ error: `No existe carrito con id ${cid}` })
    } else {
        res.status(200).json({ cart })
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    let cid = Number(req.params.cid)
    if (isNaN(cid)) {
        return res.status(400).json({ error: "El id del carrito debe ser numérico" })
    }
    let id = Number(req.params.pid)
    if (isNaN(id)) {
        return res.status(400).json({ error: "El id debe ser numérico" })
    }
    let newProductCart = await cm.addProduct(cid, id)
    if (!newProductCart) {
        return res.status(400).json({ error: `No existen productos con id ${id}` })
    } else {
        res.status(201).json(newProductCart)
    }
})
module.exports = router