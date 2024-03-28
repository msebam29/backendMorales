const modelChat = require("./models/chat.model");


class ChatManagerMongo {
    constructor() {
    }
    async createUser(user){
        return await modelChat.create(user)
    }
    async existUser(user) {
        return await modelChat.findOne({email:user})
    } 
    async getUserByFilter(filter){
        return await modelChat.findOne(filter)
    }
    async addMessage(id, mensaje) {        
        await modelChat.updateOne({_id:id}, {$push:{messages:mensaje}})
    }     
}

module.exports= ChatManagerMongo

