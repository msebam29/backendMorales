const fs = require("fs")
const ProductManager = require("./ProductManagerFS")
const { join } = require("path")

let rutaProducts = join(__dirname, "..", "data", "products.json")
const pm = new ProductManager(rutaProducts)

class CartManagerFS {
    constructor(rutaAlArchivo) {
        this.path = rutaAlArchivo
    }
    async getCarts() {
        if (fs.existsSync(this.path)) {
            return JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }))
        } else {
            return []
        }
    }
    async createCart() {
        let carts = await this.getCarts()
        let id = 1
        if (carts.length > 0) {
            id = carts[carts.length - 1].id + 1
        }
        let products = []
        let cart = { id, products }
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

    async addProduct(cid, id) {
        let carts = await this.getCarts()
        let cart = await this.getCartById(cid)

        let product = await pm.getProductById(id)
        if (!product) {
            return
        }
        let pid = product.id


        let products = cart.products
        let indiceCart = carts.findIndex(cart => cart.id === cid)
        if (indiceCart == -1) {
            console.log("Carrito inexistente")
            return
        }
        const existProduct = await products.find(product => product.id === pid)
        if (existProduct) {
            existProduct.quantity++
        } else {
            products.push({
                id: id,
                quantity: 1
            })
        }

        carts[indiceCart] = {
            ...carts[indiceCart],
            products
        }
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5))
        return cart
    }
}

module.exports = CartManagerFS