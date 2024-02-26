const CartManager = require("../managers/CartManager")
const Router = require("express").Router
const router=Router()

const cm=new CartManager("../data/cart.json")

