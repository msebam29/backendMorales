const CartsController = require("../controller/carts.controller")
const Router = require("express").Router
const router = Router()
 
router.get("/", CartsController.getCarts)
router.get("/:cid", CartsController.getCartById)
router.post("/", CartsController.createCart)
router.put("/:cid", CartsController.updateCart)
router.put("/:cid/products/:pid", CartsController.updateProductCart)
router.delete("/:cid/products/:pid", CartsController.deleteProduct)
router.delete("/:cid", CartsController.deleteCart)
module.exports = router