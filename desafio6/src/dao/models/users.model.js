const mongoose = require("mongoose");


const usersModelo = mongoose.model('users', new mongoose.Schema({
    nombre: String,
    email: {
        type: String, unique: true
    },
    password: String,
    rol: String,
},
    {
        timestamps: true, strict: false
    }
))

module.exports = usersModelo

