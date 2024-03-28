const modelCarts = require("./models/carts.model");

class CartManagerMongo {
    constructor(){}

    async getCarts() {
        return await modelCarts.find().lean()
    }

    async getCartById(cid){
        return await modelCarts.findById(cid).lean()
    }

    async createCart(product) {
        return await modelCarts.create({products:[product]})
    }

    async updateCart(cid, product) {
        return await modelCarts.updateOne({_id:cid}, {$push: {products:product}})
    }

    async deleteCart(cid){
        return await modelCarts.deleteOne({_id:cid})
    }    
}

module.exports=CartManagerMongo
