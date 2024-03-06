const ProductManager=require("../managers/ProductManager")
const {join}=require("path")
const Router=require("express").Router
const router=Router()

const rutaProducts= join(__dirname, "..", "data", "products.json")
const pm = new ProductManager(rutaProducts)

router.get("/", async (req, res) => {
    try {
        let limit = req.query.limit
        let resultado = await pm.getProducts()
        if (limit && limit > 0) {
            resultado = resultado.slice(0, limit)
        }
        res.status(200).json(resultado)
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" })
    }
})

router.get("/:id", async (req, res) => {
    let id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).json({error:"El id debe ser numérico"})
    }
    let product = await pm.getProductById(id)
    if(!product){
        res.status(404).json({ error: `No existen productos con id ${id}`})
    }else{
        res.status(200).json({product})
    }
})

router.post("/", async (req, res)=>{
    let newProduct = await pm.addProduct(req.body)
    req.io.emit ("newProduct", newProduct)
    res.status(201).json(newProduct)
})

router.put("/:id", async (req, res)=>{
    let id = Number(req.params.id)
    if (isNaN(id)) {
        return res.status(400).json({error:"El id debe ser numérico"})
    }
    let productModificado = await pm.updateProduct(id, req.body)
    res.status(201).json({productModificado})
})

router.delete("/:id", async (req, res)=>{
    let id = Number(req.params.id)
    if(isNaN(id)){
        return res.status(400).json({error:"El id debe ser numérico"})
    }
    let productoEliminado = await pm.deleteProduct(id)
    req.io.emit("deleteProduct", productoEliminado)
    return res.status(200).json({productoEliminado})
})

module.exports=router