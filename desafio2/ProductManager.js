const fs = require("fs")
const path = require("path")

class ProductManager {
    constructor(rutaAlArchivo) {
        this.path = rutaAlArchivo
    }
    async getProducts() {
        if (fs.existsSync(this.path)) {
            return JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }))
        } else {
            return []
        }
    }
    async addProduct(title, description, price, thumbnail, code, stock) {
        let products = await this.getProducts()
        
        let existe = products.find(product => product.code === code)
        if (existe) {
            console.log(`El producto con código ${code} ya existe`)
            return
        }
        
        let id = 1
        if (products.length > 0) {
            id = products[products.length - 1].id + 1
        } 

        let newProduct = {
            id, title, description, price, thumbnail, code, stock
        }

        products.push(newProduct)
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
    }

    async getProductById(id) {
        let products = await this.getProducts()
        let product = await products.find(product => product.id === id)
        if (!product) {
            console.log(`No existen productos con id ${id}`)
            return
        }
        return product
    }

    async updateProduct(id, contenido={}) {
        let products = await this.getProducts()
        let propiedadValida = ["id", "title", "description", "price", "thumbnail", "code", "stock"]
        let propiedadAModificar = Object.keys(contenido)
        let ok = propiedadAModificar.every(prop => propiedadValida.includes(prop))
        if (!ok) {
            console.log("No existe la propiedad que desea modificar, las propiedades validas son:", JSON.stringify(propiedadValida))
        }
        
        let indiceProduct = products.findIndex(product => product.id === id)
        if(indiceProduct==-1){
            console.log("Producto inexistente")
            return
        }

        products[indiceProduct] = {
            ...products[indiceProduct],
            ...contenido,
            id:id
        }         
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
    }

    async deleteProduct(id) {
        let products = await this.getProducts()
        let indiceProduct = products.findIndex(product => product.id === id)

        delete products[indiceProduct] 
        
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
    }

}

let pm = new ProductManager(path.join(__dirname, "products.json"))

const app=async()=>{
    let products= await pm.getProducts()
    console.log(products)
    await pm.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
    await pm.addProduct("segundo producto prueba", "Este es el segundo producto prueba", 100, "Sin imagen", "abc456", 14)
    console.log(await pm.getProducts())
    console.log(await pm.getProductById(1))
    await pm.updateProduct(1, {title: "producto modificado"})
    console.log(await pm.getProducts())
    await pm.deleteProduct(1)
    console.log(await pm.getProducts())
}
app()









