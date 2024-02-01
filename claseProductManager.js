class ProductManager {
    constructor() {
        this.products = []
    }
    addProduct(title, description, price, thumbnail, code, stock) {
        let existe = this.products.find(product=>product.code===code)
        if(existe){
            console.log(`El producto con código ${code} ya existe`)
            return
        }

        let id = 1
        if(this.products.length>0){
            id= this.products[this.products.length-1].id + 1
        }

        let newProduct = {
            id, title, description, price, thumbnail, code, stock
        }
        this.products.push(newProduct)
    }
    getProducts() {
        return this.products
    }

    getProductById(id) {
        let product = this.products.find(product=>product.id===id)
        if(!product){
            console.log(`No existen productos con id ${id}`)
            return
        }
        return product
    }
}

let pm= new ProductManager()

console.log(pm.getProducts())
pm.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
console.log(pm.getProducts())
pm.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
console.log(pm.getProductById(1))
pm.getProductById(3)
