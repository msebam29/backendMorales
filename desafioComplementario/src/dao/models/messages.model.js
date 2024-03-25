const mongoose = require("mongoose")

const messagesColl = "messages"
const messagesSchema = new mongoose.Schema(
    {
        email: {
            type:String,
            required: true,
        },
        message: {
            type: String
        }
    },
    {
        timestamps: true, strict: false
    }
)
const modelMessages = mongoose.model(messagesColl, messagesSchema)
module.exports = modelMessages