const mongoose = require("mongoose");


const usersModelo = mongoose.model('users', new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String, unique: true
    },
    age: Number,
    password: String,
    cart: String,
    rol: String,
},
    {
        timestamps: true, strict: false
    }
))

module.exports = usersModelo

