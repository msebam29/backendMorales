const mongoose = require("mongoose")

const cartsColl = "carts"
const cartsSchema = new mongoose.Schema(
    {
        products: []
    },
    {
        timestamps: true, strict: false
    }
)
const modelCarts = mongoose.model(cartsColl, cartsSchema)
module.exports = modelCarts