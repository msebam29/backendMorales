const modelMessages = require("./models/messages.model");

class MessagesManagerMongo {
    constructor() {
    }
    async getMessages() {
        return await modelMessages.find().lean()
    }

    async getMessagesByEmail(email) {
        return await modelMessages.findOne(email).messages
    } 
    async getMessagesBySocketId(socketId){
        return await modelMessages.findOne(socketId).lean()
    }
    async createUser(user){
        return await modelMessages.create(user)
    }

    async addMessages(email, messages) {        
        await modelMessages.updateOne(email, messages)
    } 

    async deleteMessages(id) {
        return await modelMessages.deleteOne({_id:id})
    }
}

module.exports= MessagesManagerMongo

