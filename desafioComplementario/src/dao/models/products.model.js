const mongoose = require("mongoose")

const productsColl = "products"
const productsSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        price: Number,
        category: String,
        thumbnails: String,
        code: {
            type: String,
            required: true,
            unique: true
        },
        stock: Number,
        status: Boolean
    },
    {
        timestamps: true, strict: false
    }
)
const modelProducts = mongoose.model(productsColl, productsSchema)
module.exports = modelProducts