const Router=require('express').Router
const {join} = require("path")
const router=Router()
const ProductManager=require("../managers/ProductManager")

const rutaProducts= join(__dirname, "..", "data", "products.json")
const pm = new ProductManager(rutaProducts)

router.get('/',async (req,res)=>{
    let products = await pm.getProducts()
    res.status(200).render("products", { 
        products
    })
})

router.get('/realTimeProducts',async (req,res)=>{
    let products = await pm.getProducts()
    res.status(200).render("realTimeProducts", { 
        products
    })
})


module.exports=router