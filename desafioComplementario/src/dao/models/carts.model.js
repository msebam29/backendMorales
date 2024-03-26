const mongoose = require("mongoose")

const cartsColl = "carts"
const cartsSchema = new mongoose.Schema(
    {
        cart:{
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