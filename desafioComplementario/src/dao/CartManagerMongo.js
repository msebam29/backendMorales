const modelCarts = require("./models/carts.model");

class CartManagerMongo {
    constructor(){}

    async getCarts() {
        return await modelCarts.find().lean()
    }

    async getCartById(cid){
        return await modelCarts.findById(cid).lean()
    }

    async createCart(cid, product={}) {
        return await modelCarts.create(cid, product)
    }

    async updateCart(cid, contenido={}) {
        return await modelCarts.updateOne(cid, contenido)
    }

    async deleteCart(cid){
        return await modelCarts.deleteOne(cid)
    }    
}

module.exports=CartManagerMongo
