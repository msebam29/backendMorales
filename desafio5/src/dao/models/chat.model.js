const mongoose = require("mongoose")

const chatColl = "messages"
const chatSchema = new mongoose.Schema(
    {
        sockId: String,        
        user: String,        
        message: String
    },
    {
        timestamps: true, strict: true
    }
)
const modelChat = mongoose.model(chatColl, chatSchema)
module.exports = modelChat