const modelMessages = require("./models/messages.model");

class MessagesManagerMongo {
    constructor() {
    }
    async getMessages() {
        return await modelMessages.find().lean()
    }

    async getMessagesByEmail(email) {
        return await modelMessages.find(email).lean()
    } 

    async addMessages() {        
        await modelMessages.create(product)
    } 

    async deleteMessages(id) {
        return await modelMessages.deleteOne({_id:id})
    }
}

module.exports= MessagesManagerMongo

