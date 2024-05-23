const config = require("../config/config.js");

let ProductsManagerDAO

if(config.PERSISTENCE="MONGO"){
    ProductManagerDAO = require ("../dao/ProductManagerMongo.js")
}
if(config.PERSISTENCE="MEMORY"){
    ProductManagerDAO = require ("../dao/ProductManagerFS.js")
}

let CartsManagerDAO
if(config.PERSISTENCE="MONGO"){
    CartManagerDAO = require ("../dao/CartManagerMongo.js")
}
if(config.PERSISTENCE="MEMORY"){
    CartManagerDAO = require ("../dao/CartManagerFS.js")
}

module.exports = {ProductsManagerDAO, CartsManagerDAO}