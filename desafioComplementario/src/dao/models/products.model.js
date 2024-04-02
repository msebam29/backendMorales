const mongoose = require("mongoose")
const paginate = require("mongoose-paginate-v2")

const productsColl = "products"
const productsSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        price: Number,
        category: String,
        thumbnails: Array,
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
productsSchema.plugin(paginate)

const modelProducts = mongoose.model(productsColl, productsSchema)
module.exports = modelProducts