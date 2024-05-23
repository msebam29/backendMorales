const { ProductsManagerDAO } = require("../dao/factory");

let dao = ProductsManagerDAO

class ProductsService{
    constructor(dao){
        this.ProductsDAO=dao
    }

}