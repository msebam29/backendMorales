const ProductManager=require("../managers/ProductManager")
const Router=require("express").Router
const router=Router()

const pm = new ProductManager("../data/products.json")

router.get("/", async (req, res) => {
    try {
        let limit = req.query.limit
        let resultado = await pm.getProducts()
        if (limit && limit > 0) {
            resultado = resultado.slice(0, limit)
        }
        res.status(200).json({resultado})
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" })
    }
})

router.get("/:id", async (req, res) => {
    let {id} = req.params
    id = Number(id)
    if (typeof id != "number") {
        return res.send("El id debe ser numérico")
    }
    let product = await pm.getProductById(id)
    if(product){
        res.status(200).json({product})
    }else{
        res.status(404).send({ error: "Producto no encontrado" })
    }
})

router.post("/", (req, res)=>{
    pm.addProduct(req.body)
    res.status(201).json({nuevoUsuario})
})

router.put("/:id", (req, res)=>{


})

router.delete("/:id", (req, res)=>{
    let id = Number(req.params.id)
    if(isNaN(id)){
        return res.status(400).json({error:"El id debe ser numérico"})
    }
    pm.deleteProduct(id)
    return res.status(200).send("Usuario Eliminado")
})

module.exports=router