const fs=require("fs")
const ProductManager=require("./ProductManager")
const {join}=require ("path")

let rutaProducts= join(__dirname, "..", "data", "products.json")
const pm=new ProductManager(rutaProducts)

class CartManager {
    constructor(rutaAlArchivo){
        this.path=rutaAlArchivo
    }
    async getCarts() {
        if (fs.existsSync(this.path)) {
            return JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }))
        } else {
            return []
        }
    }
    async createCart(){
        let carts = await this.getCarts()
        let id = 1
        if (carts.length > 0) {
            id = carts[carts.length - 1].id + 1
        }
        let products= []
        let cart = {id, products}
        carts.push(cart)
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5))
        return 
    }
    async getCartById(id) {
        let carts = await this.getCarts()
        let cart = await carts.find(cart => cart.id === id)
        if (!cart) {
            console.log(`No existe carrito con id ${id}`)
            return
        }
        return cart
    }

    async addProduct (cid, id) {
        let carts = await this.getCarts()
        let cart = await this.getCartById(cid)
        let products = cart.products
        let product = await pm.getProductById(id)
        let pid=product.id
        let existe = await products.find(product => product.id === id)
        console.log(existe);
        if(!existe){
            let quantity=1
            products.push({pid, quantity})
        }else{
            let quantity= existe.quantity + 1
            products.push({pid, quantity})
        }
        cart ={
            ...cart,
            products
        }
        console.log(cart)
        carts.push(cart)
        console.log(carts);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5)) 
    } 
}

module.exports=CartManager