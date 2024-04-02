const modelCarts = require("./models/carts.model");

class CartManagerMongo {
    constructor(){}

    async getCarts() {
        return await modelCarts.find()
    }

    async getCartBy(filtro){
        return await modelCarts.findOne(filtro)
    }

    async createCart(user, product) {
        return await modelCarts.create({user:user}, {product:product})
    }

    async updateCart(cid, product) {
        return await modelCarts.updateOne({_id:cid}, {$push: {type:product}})
    }

    async deleteCart(cid){
        return await modelCarts.deleteOne({_id:cid})
    }
    async deleteProduct(pid){
        return await modelCarts.deleteOne({product:pid})
    }
    async paginate(limit, page, lean){
        return await modelCarts.paginate(limit, page, lean)
    }    
}

module.exports=CartManagerMongo
