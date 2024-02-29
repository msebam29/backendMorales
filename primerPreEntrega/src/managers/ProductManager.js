const fs = require("fs")

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
    async addProduct({title, description, price, category, thumbnail, code, stock, status}) {
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
        let thumbnails = [thumbnail]

        let newProduct = {
            id, title, description, price, category, thumbnails, code, stock, status
        }

        products.push(newProduct)
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
        return newProduct
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
        return products[indiceProduct]
    }

    async deleteProduct(id) {
        let products = await this.getProducts()
        let indiceProduct = products.findIndex(product => product.id === id)
        let productEliminado = products[indiceProduct]

        products.splice(indiceProduct, 1) 
        
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
        return productEliminado
    }

}

module.exports= ProductManager
