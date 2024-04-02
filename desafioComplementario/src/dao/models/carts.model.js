const mongoose = require("mongoose")
const modelProducts = require("./products.model")
const paginate = require("mongoose-paginate-v2")


const cartsColl = "carts"
const cartsSchema = new mongoose.Schema(
    {
        carrito: {
            type: [
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "products"
                    }
                }
            ]
        }
    },
    {
        timestamps: true
    }
)
cartsSchema.pre("find", function () {
    this.populate("carrito.product").lean()
})
cartsSchema.pre("findOne", function () {
    this.populate("carrito.product").lean()
})
cartsSchema.plugin(paginate)

const modelCarts = mongoose.model(cartsColl, cartsSchema)
module.exports = modelCarts