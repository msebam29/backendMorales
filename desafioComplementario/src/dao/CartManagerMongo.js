const modelCarts = require("./models/carts.model");

class CartManagerMongo {
    constructor(){}

    async getCarts() {
        return await modelCarts.find().lean()
    }
    
    async getCartById(id) {
        return await modelCarts.findById(id).lean()
    }

    async createCart(cart) {
        return await modelCarts.create(cart)
    }

    async updateCart(id, contenido) {
        return await modelCarts.updateOne({_id:id}, contenido)
    }

    async deleteCart (id){
        return await modelCarts.deleteOne(id)
    }
}

module.exports=CartManagerMongo
