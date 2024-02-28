const fs=require("fs")
const ProductManager=require("./ProductManager")
const {join}=require ("path")

let rutaProducts= join(__dirname, "..", "data", "products.json")
const pm=new ProductManager(rutaProducts)

class CartManager {
    constructor(rutaAlArchivo){
        this.path=rutaAlArchivo
    }
    
    async getCart() {
        if (fs.existsSync(this.path)) {
            return JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }))
        } else {
            return []
        }
    }
    
    async addProduct (id, quantity) {
        let cart = await this.getCart()
        let pid = await pm.getProductById(id)
        let product = pid.id

        let productCart = {product, quantity}
        
        cart.push(productCart)
        await fs.promises.writeFile(this.path, JSON.stringify(cart, null, 5))
    }
    
}

module.exports=CartManager