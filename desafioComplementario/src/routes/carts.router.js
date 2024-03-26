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
    let {product} = req.body 
    if(!cid || !product){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Faltan datos: cid y product son necesarios`})
    }
    let existe = await pm.getProductById(product.id)
    if(!existe){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`El producto con id ${id} no existe`})
    }
    try {
        let newCart = await cm.createCart({cid, product})
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

/* router.delete("/:cid", async (req, res)=>{
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
}) */