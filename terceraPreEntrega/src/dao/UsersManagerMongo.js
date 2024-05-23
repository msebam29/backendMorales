const usersModelo = require("./models/users.model");

class UsersManagerMongo{
    async create (usuario){
        let nuevoUser = await usersModelo.create(usuario)
        return nuevoUser.toJSON()
    }
    async getBy(filtro){
        return await usersModelo.findOne(filtro).lean()
    }
}

module.exports = UsersManagerMongo

