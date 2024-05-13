const modelCarts = require("./models/carts.model");

class CartManagerMongo {
    constructor(){}

    async getCarts() {
        return await modelCarts.find()
    }

    async getCartBy(filtro){
        return await modelCarts.findOne(filtro)
    }

    async createCart(product, quantity) {
        return await modelCarts.create({type:{product:product, quantity:quantity}})
    }
    async insertProduct(product){
        return await modelCarts.insertMany(product)
    }

    async updateCart(cid, product, quantity) {
        return await modelCarts.updateOne({_id:cid}, {$push: {type:{product:product, quantity:quantity}}})
    }
    async updateQuantity(cid, product, quantity){
        return await modelCarts.updateOne({_id:cid}, {product:{product}, quantity:{quantity}})
    }

    async vaciarCart(cid){
        return await modelCarts.updateMany({_id:cid}, {$pull: {product}})
    }
    async paginate(limit, page, lean){
        return await modelCarts.paginate(limit, page, lean)
    }    
}

module.exports=CartManagerMongo
