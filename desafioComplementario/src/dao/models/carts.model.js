const mongoose = require("mongoose")

const cartsColl = "carts"
const cartsSchema = new mongoose.Schema(
    {
        title: String,
        code: {
            type: String,
            required: true,
            unique: true
        },
        price: Number,
        quantity: Number        
    },
    {
        timestamps: true, strict: false
    }
)
const modelCarts = mongoose.model(cartsColl, cartsSchema)
module.exports = modelCarts