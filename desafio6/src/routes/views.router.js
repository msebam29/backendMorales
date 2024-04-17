const Router=require('express').Router
const router=Router()
const CartManagerMongo = require('../dao/CartManagerMongo')
const ProductManagerMongo = require('../dao/ProductManagerMongo')

const pm = new ProductManagerMongo()
const cartm = new CartManagerMongo()

router.get('/',async (req,res)=>{
    let {pagina}=req.query
    if(!pagina){
        pagina=1
    }
    let{
        docs:products,
        totalPages,
        prevPage, nextPage, 
        hasPrevPage, hasNextPage
    } = await pm.paginate({}, {limit:10, page:pagina, lean:true})
    res.status(200).render("products", { 
        products,
        totalPages,
        prevPage, nextPage, 
        hasPrevPage, hasNextPage
    })
})
router.get('/products',async (req,res)=>{  
    let {pagina}=req.query
    if(!pagina){
        pagina=1
    }
    let{
        docs:products,
        totalPages,
        prevPage, nextPage, 
        hasPrevPage, hasNextPage
    } = await pm.paginate({}, {limit:10, page:pagina, lean:true})
    res.status(200).render("products", { 
        products,
        totalPages,
        prevPage, nextPage, 
        hasPrevPage, hasNextPage
    })
})
router.get('/products/:pid', async (req, res)=>{
    let {pid}=req.params
    let product = await pm.getProductById(pid)
    return res.status(200).render("product", {product});
})

router.get('/chat', async (req, res)=>{
    res.status(200).render('chat');
})

router.get('/carts',async (req,res)=>{
    let {pagina}=req.query
    if(!pagina){
        pagina=1
    }
    let{
        docs:carts,
        totalPages,
        prevPage, nextPage, 
        hasPrevPage, hasNextPage
    } = await cartm.paginate({}, {limit:1, page:pagina, lean:true})
    res.status(200).render("carts", { 
        carts,
        totalPages,
        prevPage, nextPage, 
        hasPrevPage, hasNextPage
    })
})
router.get('/carts/:cid',async (req,res)=>{
    let cid= req.params
    try {
        let cart= await cartm.getCartBy({_id:cid})
        res.setHeader('Content-Type','application/json');
        return res.status(200).render({payload:cart});
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: error.message
            })        
    }
})

router.get('/registro', (req, res)=>{
    let {error, mensaje} = req.query
    return res.status(200).render("registro", {error, mensaje});
})
router.get('/login', (req, res)=>{
    
    return res.status(200).render("login");
})
router.get('/perfil', (req, res)=>{
    let user = req.session.usuario
    
    return res.status(200).render("perfil", {user});
})

module.exports=router