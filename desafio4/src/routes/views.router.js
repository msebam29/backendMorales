const Router=require('express').Router
const {join} = require("path")
const router=Router()
const ProductManager=require("../managers/ProductManager")
const CartManager = require("../managers/CartManager")

const rutaProducts= join(__dirname, "..", "data", "products.json")
const pm = new ProductManager(rutaProducts)

const rutaCart = join(__dirname, "..", "/data", "carts.json")
const cm = new CartManager(rutaCart)

router.get('/',async (req,res)=>{
    let products = await pm.getProducts()
    res.status(200).render("products", { 
        products
    })
})

router.get('/realTimeProducts',async (req,res)=>{
    
    res.status(200).render("products", { 
        products
    })
})


module.exports=router