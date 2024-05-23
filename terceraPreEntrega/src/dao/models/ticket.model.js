const mongoose = require("mongoose")

const modelTicket = mongoose.Model(
    "tickets",
    new mongoose.Schema(
        {
            code: {
                type: String,
                unique: true
            },
            purchase_datetime: Date,
            amount: Number,
            purchaser: String
        },
        {
            timestamps: true
        }
    )
)

module.exports= modelTicket



