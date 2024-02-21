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
        let titulo = title
        if(titulo == null || titulo.length == 0){
            console.log("El producto debe tener un titulo")
            return
        }

        let precio = price
        if (typeof precio != "number" || precio <= 0){
            console.log("El precio debe ser un numero y mayor a cero")
            return
        }
        
        let cantidad = stock
        if(cantidad<=0){
            console.log("El stock debe ser mayor a cero")
            return
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

        products.splice(indiceProduct, 1) 
        
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
    }

}
let pm = new ProductManager(path.join(__dirname, "products.json"))

const app=async()=>{
    let products= await pm.getProducts()
    console.log(products)
    await pm.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
    await pm.addProduct("segundo producto prueba", "Este es otro producto prueba", 100, "Sin imagen", "abc456", 14)
    await pm.addProduct("tercer producto prueba", "Este es otro producto prueba", 20, "Sin imagen", "abc789", 20)
    await pm.addProduct("cuarto producto prueba", "Este es otro producto prueba", 300, "Sin imagen", "abc012", 10)
    await pm.addProduct("quinto producto prueba", "Este es otro producto prueba", 40, "Sin imagen", "abc345", 250)
    await pm.addProduct("sexto producto prueba", "Este es otro producto prueba", 250, "Sin imagen", "abc678", 22)
    await pm.addProduct("septimo producto prueba", "Este es otro producto prueba", 700, "Sin imagen", "abc901", 140)
    await pm.addProduct("octavo producto prueba", "Este es otro producto prueba", 150, "Sin imagen", "abc234", 32)
    await pm.addProduct("noveno producto prueba", "Este es otro producto prueba", 400, "Sin imagen", "abc567", 84)
    await pm.addProduct("decimo producto prueba", "Este es otro producto prueba", 80, "Sin imagen", "abc890", 65)    
}
app()
module.exports= ProductManager
