const modelChat = require("./models/chat.model");


class ChatManagerMongo {
    constructor() {
    }
    async findUser(sockId){
        return await modelChat.findOne({sockId:sockId})
    }
    async existUser(user) {
        return await modelChat.find({user:user})
    } 
    async addMessage(user) {        
        return await modelChat.create(user)
    }     
}

module.exports= ChatManagerMongo

