const mongoose = require("mongoose")

const cartsColl = "carts"
const cartsSchema = new mongoose.Schema(
    {
        cart:{
            cid:{
                type:String, required:true
            },
            product:{
                id: String,
                quantity: Number
            }
        }    
    },
    {
        timestamps: true, strict: false
    }
)
const modelCarts = mongoose.model(cartsColl, cartsSchema)
module.exports = modelCarts