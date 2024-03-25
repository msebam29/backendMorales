const Router=require("express").Router
const ProductManagerMongo = require("../dao/ProductManagerMongo")
const mongoose = require("mongoose")
const router=Router()

const pm = new ProductManagerMongo

router.get("/", async (req, res) => {
    try {
        let products = await pm.getProducts()
        res.status(200).json({products})
    } catch (error) {
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({ error: "Error al obtener productos" })
    }
})

router.get("/:id", async (req, res) => {
    let {id} = req.params 
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.setHeader('Content-Type','application/json')
        return res.status(400).json({error:"Id inválido"})
    }
    try {
        let product = await ProductManagerMongo.getProductById(id)
        if(product){
            res.setHeader('Content-Type','application/json')
            return res.status(200).json({product})
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No existen productos con id ${id}`})
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

router.post("/", async (req, res)=>{
    let {title, description, price, category, thumbnail, code, stock, status} = req.body
    if (!title || !price || !code || !stock || !status){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Faltan datos: title, price, code, stock, status`})
    }
    let existe = await ProductManagerMongo.getProductBy(code)
    if(existe){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`El producto con code ${code} ya existe`})
    }
    try {
        let newProduct = await ProductManagerMongo.addProduct({title, description, price, category, thumbnail, code, stock, status})
        res.setHeader('Content-Type','application/json');
        return res.status(201).json({payload:newProduct});
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: error.message
            })
        
        
    }


    
    let products = await pm.getProducts()
    req.io.emit ("updateProducts", products)
    res.status(201).json(newProduct)
})

router.put("/:id", async (req, res)=>{
    let id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).json({error:"El id debe ser numérico"})
    }
    let productModificado = await pm.updateProduct(id, req.body)
    let products = await pm.getProducts()
    req.io.emit ("updateProducts", products)
    res.status(201).json({productModificado})
})

router.delete("/:id", async (req, res)=>{
    let id = Number(req.params.id)
    if(isNaN(id)){
        return res.status(400).json({error:"El id debe ser numérico"})
    }
    let productoEliminado = await pm.deleteProduct(id)
    let products=await pm.getProducts()
    req.io.emit("updateProducts", products)
    return res.status(200).json({productoEliminado})
})

module.exports=router