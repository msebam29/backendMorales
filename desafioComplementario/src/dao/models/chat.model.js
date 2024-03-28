const mongoose = require("mongoose")

const chatColl = "messages"
const chatSchema = new mongoose.Schema(
    {        
        email: {
            type: String,
            required: true,
        },
        messages: [String]
    },
    {
        timestamps: true, strict: true
    }
)
const modelChat = mongoose.model(chatColl, chatSchema)
module.exports = modelChat