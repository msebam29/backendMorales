const mongoose = require("mongoose")

const messagesColl = "messages"
const messagesSchema = new mongoose.Schema(
    {
        id: String,
        email: {
            type: String,
            required: true,
        },
        messages: {
            type: String
        }
    },
    {
        timestamps: true, strict: false
    }
)
const modelMessages = mongoose.model(messagesColl, messagesSchema)
module.exports = modelMessages