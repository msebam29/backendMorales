
const fs= require("fs")
const path= require("path")

class ProductManager {
    constructor(rutaAlArchivo) {
        this.path = rutaAlArchivo
    }
    async getProducts() {
        if(fs.existsSync(this.path)){
            return JSON.parse(await fs.promises.readFile(this.path, {encoding: "utf-8"}))
        }else{
            return []
        }
    }
    async addProduct(title, description, price, thumbnail, code, stock) {
        let products = await this.getProducts()
        console.log(products);
        let existe = await products.find(product=>product.code===code)
        if(existe){
            console.log(`El producto con código ${code} ya existe`)
            return
        }

        let id = 1
        if(products.length>0){
            id= products[products.length-1].id + 1
        }

        let newProduct = {
            id, title, description, price, thumbnail, code, stock
        }
        console.log(newProduct);
        products.push(newProduct)
        console.log(products);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
    }
    
    async getProductById(id) {
        let products = await this.getProducts()
        let product = await products.find(product=>product.id===id)
        if(!product){
            console.log(`No existen productos con id ${id}`)
            return
        }
        return product
    }

    async updateProduct(id, campo, contenido ) {
        let products = await this.getProducts()
        let product = await products.find(product=>product.id===id)
        let modifyProduct = {
            ...product,
            campo : contenido
        }
        await fs.promises.appendFile(this.path, JSON.stringify(modifyProduct, null, 5))
    }

    async deleteProduct(id) {
        let products = await this.getProducts()
        let product = await products.find(product=>product.id===id)
        await fs.promises.unlink(this.path, product)
    }

}

let pm= new ProductManager(path.join(__dirname, "products.json"))

console.log(pm.getProducts())
pm.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
pm.addProduct("Segundo producto prueba", "Este es el segundo un producto prueba", 400, "Sin imagen", "abc456", 20)
/* console.log(pm.getProducts())
console.log(pm.getProductById(1))
pm.updateProduct(1, "title", "producto modificado")
console.log(pm.getProducts())
pm.deleteProduct(1)
console.log(pm.getProducts()) */





