const CartManagerMongo = require("../dao/CartManagerMongo")
const mongoose = require("mongoose")
const ProductManagerMongo = require("../dao/ProductManagerMongo")
const Router = require("express").Router
const router = Router()

const cm = new CartManagerMongo()
const pm = new ProductManagerMongo()
 
router.get("/", async (req, res)=>{
    try {
        let carts = await cm.getCarts()
        res.status(200).json({carts})
    } catch (error) {
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({ error: "Error al obtener carritos" })
    }
})
router.get("/:cid", async (req, res) => {
    let {cid} = req.params 
    if (!mongoose.Types.ObjectId.isValid(cid)) {
        res.setHeader('Content-Type','application/json')
        return res.status(400).json({error:"Id del carrito inválido"})
    }
    try {
        let cart = await cm.getCartById(cid)
        if(cart){
            res.setHeader('Content-Type','application/json')
            return res.status(200).json({cart})
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No existe carrito con id ${cid}`})
        }
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
        {
            error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle:`${error.message}` 
        })
    }
})
router.post("/", async (req, res) => {
    let {id, quantity} = req.body 
    if(!id || !quantity){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Faltan datos: id y quantity son necesarios`})
    }
    let existe = await pm.getProductById(id)
    if(!existe){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`El producto con id ${id} no existe`})
    }
    let carts = await cm.getCarts()
    let cid = 1
    if (carts.length > 0) {
        cid = carts[carts.length - 1].cid + 1
    } 
    try {
        let newCart = await cm.createCart(cid, product={id, quantity})
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:newCart});
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalles: error.message
        })
    } 
}) 

router.put("/:cid/product/:id", async (req, res) => {
    let {cid} = req.params.cid
    if (!mongoose.Types.ObjectId.isValid(cid)) {
        res.setHeader('Content-Type','application/json')
        return res.status(400).json({error:"Cid inválido"})
    }
    let {id} = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.setHeader('Content-Type','application/json')
        return res.status(400).json({error:"Id inválido"})
    }
    let aModificar = req.body
    try {
        let resultado = await cm.updateCart(cid, aModificar)
        if(resultado.modifiedCount>0){
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({
                message:`Carrito con id ${cid} modificado`
            })
        } else{
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No existen carritos con id ${cid}`})
        }
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:error.message
            })     
    }  
}) 

router.delete("/:cid", async (req, res)=>{
    let {cid} = req.params
    if (!mongoose.Types.ObjectId.isValid(cid)) {
        res.setHeader('Content-Type','application/json')
        return res.status(400).json({error:"Cid inválido"})
    }
    try {
        let resultado = await cm.deleteCart(cid)
        if(resultado.deletedCount>0){
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({
                message:`Carrito con id ${cid} eliminado`
            })
        } else{
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No existen carritos con id ${cid}`})
        }
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            })
    }
})