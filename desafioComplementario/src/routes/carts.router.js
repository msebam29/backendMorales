const CartManagerMongo = require("../dao/CartManagerMongo")
const mongoose = require("mongoose")
const ProductManagerMongo = require("../dao/ProductManagerMongo")
const Router = require("express").Router
const router = Router()

const cartm = new CartManagerMongo()
const pm = new ProductManagerMongo()
 
router.get("/", async (req, res) => {
    try {
        let carts = await cartm.getCarts()
        res.status(200).json({ carts })
    } catch (error) {
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({ error: "Error al obtener carritos" })
    }
})
router.get("/:cid", async (req, res) => {
    let { cid } = req.params
    if (!mongoose.Types.ObjectId.isValid(cid)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: "Id del carrito inválido" })
    }
    try {
        let cart = await cartm.getCartBy({_id:cid})
        if (cart) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json({ cart })
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existe carrito con id ${cid}` })
        }
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            })
    }
})
router.post("/", async (req, res) => {
   let  {product} = req.body
   if (!user) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Faltan datos. User es requerido` })
    } 
    try {
        let existe = await cartm.getCartBy({ user:user })
        if (!existe) {
            let newCart = await cartm.createCart(user, product)
            console.log(newCart);
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: newCart });
        } else {
            let updateCart = await cartm.updateCart(existe._id, product)
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `El carrito del usuario ${user} se actualizo` })
        }
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: error.message
            })
    }
})

router.put("/:cid", async (req, res) => {
    let { cid } = req.params
    if (!mongoose.Types.ObjectId.isValid(cid)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: "Cid inválido" })
    }

    let aModificar = req.body
    let existe = await pm.getProductById(aModificar.id)
    if (!existe) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El producto con id ${id} no existe` })
    }
    let code = existe.code
    let price = existe.price
    let quantity = aModificar.quantity
    try {
        let resultado = await cartm.updateCart(cid, { code, price, quantity })
        if (resultado.modifiedCount > 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                message: `Carrito con id ${cid} modificado`
            })
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existen carritos con id ${cid}` })
        }
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: error.message
            })
    }
})
router.put("/:cid/products/:pid", async (req, res) => {
    let { cid, pid } = req.params
    if (!mongoose.Types.ObjectId.isValid(cid)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: "Cid inválido" })
    }
    if (!mongoose.Types.ObjectId.isValid(pid)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: "Pid inválido" })
    }

    let quantity = req.body
    let existe = await pm.getProductById(pid)
    if (!existe) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El producto con id ${id} no existe` })
    }
    try {
        let resultado = await cartm.updateCart(cid, { quantity })
        if (resultado.modifiedCount > 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                message: `Producto con id ${pid} modificado`
            })
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existen carritos con id ${cid}` })
        }
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: error.message
            })
    }
})
router.delete("/:cid/products/:pid", async (req, res) => {
    let { pid } = req.params
    if (!mongoose.Types.ObjectId.isValid(pid)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: "Pid inválido" })
    }
    try {
        let resultado = await cartm.deleteProduct(pid)
        if (resultado.deletedCount > 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                message: `Producto con id ${pid} eliminado`
            })
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existen carritos con id ${cid}` })
        }
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            })
    }
})

router.delete("/:cid", async (req, res) => {
    let { cid } = req.params
    if (!mongoose.Types.ObjectId.isValid(cid)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: "Cid inválido" })
    }
    try {
        let resultado = await cartm.deleteCart(cid)
        if (resultado.deletedCount > 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                message: `Carrito con id ${cid} eliminado`
            })
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existen carritos con id ${cid}` })
        }
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            })
    }
})
module.exports = router