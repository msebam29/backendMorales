const Router=require("express").Router
const ProductsController = require("../controller/products.controller")
const router=Router()

router.get("/", ProductsController.getAll)
router.get("/:id", ProductsController.getProductById)
router.post("/", ProductsController.createProduct)
router.put("/:id", ProductsController.updateProduct)
router.delete("/:id", ProductsController.deleteProduct)

module.exports=router