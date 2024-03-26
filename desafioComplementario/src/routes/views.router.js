const Router=require('express').Router
const router=Router()
const CartManagerMongo = require('../dao/CartManagerMongo')
const ProductManagerMongo = require('../dao/ProductManagerMongo')

const pm = new ProductManagerMongo()
const cm = new CartManagerMongo()

router.get('/',async (req,res)=>{
    let products = await pm.getProducts()
    res.status(200).render("products", { 
        products
    })
})
router.get('/chat', async (req, res)=>{
    res.status(200).render('chat');
})

router.get('/carts',async (req,res)=>{
    let carts = await cm.getCarts()
    res.status(200).render("carts", { 
        carts
    })
})

module.exports=router