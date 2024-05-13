const ProductManagerMongo = require("../dao/ProductManagerMongo");




const pm = new ProductManagerMongo

class ProductsController {
    static getAll = async (req, res) => {
        try {
            let limit = req.query.limit     
            let products = await pm.getProducts()
            if (limit && limit > 0) {
                products = products.slice(0, limit)
            }
            res.status(200).json({products})
        } catch (error) {
            res.setHeader("Content-Type", "application/json")
            res.status(500).json({ error: "Error al obtener productos" })
        }
    }
    static getProductById = async (req, res) => {
        let {id} = req.params 
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.setHeader('Content-Type','application/json')
            return res.status(400).json({error:"Id inválido"})
        }
        try {
            let product = await pm.getProductById(id)
            if(product){
                res.setHeader('Content-Type','application/json')
                return res.status(200).json({product})
            }else{
                res.setHeader('Content-Type','application/json');
                return res.status(400).json({error:`No existen productos con id ${id}`})
            }
        } catch (error) {
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}` 
            })
        }
    }
    static createProduct = async (req, res)=>{
        let {title, description, price, category, thumbnail, code, stock, status} = req.body
        if (!title || !price || !code || !stock || !status){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Faltan datos: title, price, code, stock, status`})
        }
        let existe = await pm.getProductBy({code})
        if(existe){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`El producto con code ${code} ya existe`})
        }
        try {
            let newProduct = await pm.addProduct({title, description, price, category, thumbnail, code, stock, status})
            res.setHeader('Content-Type','application/json');
            return res.status(201).json({payload:newProduct});
        } catch (error) {
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle: error.message
                }) 
        }  
    }
    static updateProduct = async (req, res)=>{
        let {id} = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.setHeader('Content-Type','application/json')
            return res.status(400).json({error:"Id inválido"})
        }
    
        let aModificar = req.body
        try {
            let resultado = await pm.updateProduct(id, aModificar)
            if(resultado.modifiedCount>0){
                res.setHeader('Content-Type','application/json');
                return res.status(200).json({
                    message:`Producto con id ${id} modificado`
                })
            } else{
                res.setHeader('Content-Type','application/json');
                return res.status(400).json({error:`No existen productos con id ${id}`})
            }
        } catch (error) {
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle: `${error.message}`
                }
            )        
        }    
    }
    static deleteProduct = async (req, res)=>{
        let {id} = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.setHeader('Content-Type','application/json')
            return res.status(400).json({error:"Id inválido"})
        }
        try {
            let resultado = await pm.deleteProduct(id)
            if(resultado.deletedCount>0){
                res.setHeader('Content-Type','application/json');
                return res.status(200).json({
                    message:`Producto con id ${id} eliminado`
                })
            } else{
                res.setHeader('Content-Type','application/json');
                return res.status(400).json({error:`No existen productos con id ${id}`})
            }
        } catch (error) {
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle: `${error.message}`
                })
        }
    }

}

module.exports= ProductsController