const modelProducts = require("./models/products.model")

class ProductManagerMongo {
    constructor() {
    }
    async getProducts() {
        return await modelProducts.find().lean()
    }

    async getProductById(id) {
        return await modelProducts.findById(id).lean()
    }

    async getProductBy(filtro){
        return await modelProducts.findOne(filtro).lean()
    }

    async addProduct(product) {        
        await modelProducts.create(product)
    }

    async updateProduct(id, contenido={}) {
        return await modelProducts.updateOne({_id:id}, contenido)
    }

    async deleteProduct(id) {
        return await modelProducts.deleteOne({_id:id})
    }
    async paginate(limit, page, lean){
        return await modelProducts.paginate(limit, page, lean)
    }
    
}

module.exports= ProductManagerMongo