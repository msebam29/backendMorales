import { CustomError } from "../errors/customError.js";
import { productService } from "../services/index.js";
import { userService } from "../services/index.js";
import { errorList } from "../utils/errorList.js";

export const getProductsQuery = async (req, res) => {
    const { limit, page, sort, category  } = req.query;
    try {
        const products  = await productService.getProductsQuery(limit, page, sort, category );
		res.status(200).send({ status: 'success', payload: products  });
	} catch (error) {
		res.status(400).send({ error: `Error al obtener productos: ${err.message}`});
	}
}
export const getProductById = async (req, res) => {
    try{
        const {pid} = req.params
        const product = await productService.getProductById(pid)
        if (!product) {
            throw new CustomError(errorList.PRODUCT_NOT_FOUND.status, errorList.PRODUCT_NOT_FOUND.code, errorList.PRODUCT_NOT_FOUND.message)
        }
        res.status(200).json({status:'success', payload:product});
    }catch(error){
        res.status(400).json({status: 'error', message: error.message});
    }
}
export const addProduct = async (req, res) => {
    try {
        const {title, description, category, price, stock, code, } = req.body 
        if(!title || !description || !category || !price || isNaN(price) || !stock || isNaN(stock) || !code   ){
            res.status(400).json({status: 'error', message: "Faltan datos necesarios para agregar productos"});
            }
        const newProduct = {
            title,
            description,
            category,
            price,
            stock,
            code,
            thumbnail: req.file
        }   
        const userId = req.user._id;
        const userRole = req.user.role

        if (!userId && userRole === 'admin') {
            const result = await productService.addProduct(newProduct)
            res.status(201).send({status:"Sucess: Producto agregado" , payload: result})
            return;
        }
        const user = await userService.getUserById(userId);
        if(user) newProduct.owner = user._id
        const result = await productService.addProduct(newProduct)
        res.status(201).json({status:`Sucess: Producto agregado ${newProduct.title}`, payload: result})
    } catch (error) {
        res.status(400).send({ error: 'Error al agregar el producto', details: error.message });
    }
}
export const updateProduct = async (req, res) => {
    const productID = req.params.pid 
    const updateData = req.body     
    
    try{
        const product = await productService.getProductById(productID);
        if (!product) {
            return res.status(404).json(`El producto con id ${productID} no existe`);
        }
        
        if(req.user.role == 'admin'){
            await productService.updateProduct(productID, { $set: updateData });
            const productUpdated = await productService.getProductById(productID);
            return res.status(200).json({status:'Sucess: product updated',message:`Producto actualizado: ${productUpdated.title}`, payload: productUpdated});
        }
        const user = await userService.getUserById(product.owner);
        if (req.user.role != 'admin' && product.owner != user._id) {
            return res.status(403).json('No tienes permiso para eliminar este producto');
        }
        await productService.updateProduct(productID, { $set: updateData });
        const productUpdated = await productService.getProductById(productID);
        res.status(200).json({status:'Sucess: product updated', message:`Producto actualizado: ${productUpdated.title}`, payload: productUpdated});
    } catch (error) {
        res.status(400).json('Error al eliminar el producto: ' + error.message);
    }
}
export const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productService.getProductById(pid);
        if (!product) {
            return res.status(404).json('El producto no existe');
        }
        if(req.user.role == 'admin'){
            await productService.deleteProduct(pid);
            return res.status(204).send({ status: 'Success: Producto eliminado', message: `Producto eliminado: ${product.title}` });
        }
        const user = await userService.getUserById(product.owner);
        if (req.user.role != 'admin' && product.owner != user._id) {
            return res.status(403).send('No tienes permiso para eliminar este producto');
        }
        await productService.deleteProduct(pid);
        return res.status(204).json({ status: 'Success: Producto eliminado', message: `Producto eliminado: ${product.title}` });
    } catch (error) {
        return res.status(400).send(`Error al eliminar el producto: ${error.message}`);
    }
};
export const mockProducts= (req, res)=>{
    const mockProducts = generateMockProducts(100);
    res.json(mockProducts)
}
export const loggerTest = async (req, res)=>{
    try{
        logger.debug('Debug message');
        logger.info('Info message');
        logger.warning('Warn message');
        logger.error('Error message');
        logger.fatal('Fatal message');
        logger.http('HTTP message');
        res.status(200).json({message: 'Log messages sent successfully'});
    }
    catch(error){
        logger.error('Error in loggerTest:', error);
        res.status(500).json({error: 'Error generating logs'});   
    }
}
