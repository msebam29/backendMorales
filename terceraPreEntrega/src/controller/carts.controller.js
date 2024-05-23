const { CartsManagerDAO, ProductsManagerDAO } = require("../dao/factory")

const cartm = new CartsManagerDAO()
const pm = new ProductsManagerDAO()

class CartsController {
    static getCarts= async (req, res) => {
        try {
            let carts = await cartm.getCarts()
            console.log(carts);
            res.status(200).json({ carts })
        } catch (error) {
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({ error: "Error al obtener carritos" })
        }
    }
    static getCartById = async (req, res) => {
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
    }
    static createCart =  async (req, res) => {
        let  { cid, product, quantity} = req.body
         try { 
             let existe = await cartm.getCartBy({_id:cid })
             if (!existe) {
                 let carrito = await cartm.createCart(product, quantity)
                 res.setHeader('Content-Type','application/json');
                 return res.status(200).json({carrito});
             } else {
                 await cartm.insertProduct({_id:cid}, {product, quantity})
                 res.setHeader('Content-Type','application/json');
                 return res.status(200).json({message:`Se agrego el producto con id: ${product._id} al carrito con id: ${cid}`});
             }
         } catch (error) {
             res.setHeader('Content-Type', 'application/json');
             return res.status(500).json(
                 {
                     error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                     detalle: error.message
                 })
         }
     }
    static updateCart = async (req, res) => {
        let { cid } = req.params
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: "Cid inválido" })
        }
        let {product, quantity} = req.body
        
        let existe = await pm.getProductById(product)
        if (!existe) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `El producto con id ${id} no existe` })
        }    
        try {
            let resultado = await cartm.updateCart(cid, product, quantity)
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
    }
    static updateProductCart = async (req, res) => {
        let { cid, pid } = req.params
        console.log(cid);
        console.log(pid);
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: "Cid inválido" })
        }
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: "Pid inválido" })
        }
    
        let quantity = req.body
        console.log(quantity);
        let existe = await pm.getProductById(pid)
        console.log(existe);
        if (!existe) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `El producto con id ${id} no existe` })
        }
        try {
            let resultado = await cartm.updateQuantity(cid, pid, quantity)
            console.log(resultado);
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
    }
    static deleteProduct = async (req, res) => {
        let { pid } = req.params
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: "Pid inválido" })
        }
        let { cid } = req.params
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: "Cid inválido" })
        }
        try {
            let carrito = await cartm.getCartBy({_id:cid})
            if(!carrito){
                res.setHeader('Content-Type','application/json');
                return res.status(400).json({error:`El carrito con id: ${cid} no existe`})
            } else {
                let productIndex = await carrito.product.findIndex(product=>product._id==pid)
                if(productIndex===-1){
                    res.setHeader('Content-Type','application/json');
                    return res.status(400).json({error:`El producto con id: ${pid} no se encuentra en el carrito`})
                }
                await carrito.product.splice(productIndex, 1)
                await carrito.save()
                res.setHeader('Content-Type','application/json');
                return res.status(200).json({message: `El producto con id: ${pid} fue eliminado del carrito con id: ${cid}`});
            }
        } catch (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json(
                {
                    error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle: `${error.message}`
                })
        }
    }
    static deleteCart = async (req, res) => {
        let { cid } = req.params
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: "Cid inválido" })
        }
        try {
            let resultado = await cartm.vaciarCart(cid)
            if (resultado.deletedCount > 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({
                    message: `Carrito con id ${cid} vacio`
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
    }
}

module.exports = CartsController




