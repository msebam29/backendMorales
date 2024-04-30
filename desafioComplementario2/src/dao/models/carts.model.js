const mongoose = require("mongoose")
const paginate = require("mongoose-paginate-v2")


const cartsColl = "carts"
const cartsSchema = new mongoose.Schema(
    {
        type: [
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "products"
                    },
                    quantity: Number
                }
            ]
        
    },
    {
        timestamps: true
    }
)
cartsSchema.pre("find", function () {
    this.populate("type.product").lean()
})
cartsSchema.pre("findOne", function () {
    this.populate("type.product").lean()
})
cartsSchema.plugin(paginate)

const modelCarts = mongoose.model(cartsColl, cartsSchema)
module.exports = modelCarts