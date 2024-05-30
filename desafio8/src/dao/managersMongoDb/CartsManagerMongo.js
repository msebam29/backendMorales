import { cartModel } from '../../models/carts.model.js'
import { productModel } from '../../models/product.model.js';

export default class CartManager{
    getAllCarts = async () => {
        try{
            return await cartModel.find();
        }catch(error){
            console.log('Error al obtener los carritos:', error.message);
            return error
        }
    }
    getCartById = async (idCart) => {
        try{
            return await cartModel.findById(idCart).lean();
        }catch(error){
            console.log('Carrito inexistente:',error.message);
            return error;
        }
    }
    createCart = async (products) => {
        try{
            let cartData = {};
            if (products && products.length > 0) {
                cartData.products = products;
            }
            const newCart = await cartModel.create(cartData);
            console.log('Carrito creado con éxito:', newCart);
            return newCart;
        }catch(error){
            console.log('Error al crear el carrito:', error.message);
            return error;
        }
    }
    addProductToCart = async (cid, pid) => {
        try{
            const cart = await cartModel.findOne({_id: cid});
            const productToAdd = await productModel.findOne({_id: pid});
            const productIndex = cart.products.findIndex(item => item.productID.toString() == productToAdd._id.toString()); 
            if(productIndex !== -1){
                cart.products[productIndex].quantity += 1;
            }else{
                cart.products.push({productID: pid})
            }
            await cartModel.updateOne({_id: cid}, cart);
            return cart
        }catch(error){
            console.log('Error al agregar el producto al carrito:' ,error.message);
            return error;
        }
    }
    modifyQuantity = async (cid, pid, quantity) => {
		try {       
            if (typeof quantity !== 'number' || quantity <= 0) {
                res.status(400).json('La cantidad debe ser un número mayor que cero.');
            }
			const filter = { _id: cid, 'products.productID': pid };
			const update = { $set: { 'products.$.quantity': quantity } };
			const updatedCart = await cartModel.findOneAndUpdate(filter, update, {new: true})
            if (!updatedCart) {
                res.status(404).json(`Producto ${pid} no encontrado en el carrito ${cid}.`);
            }
            return updatedCart;
		} catch (error) {
			console.log('Error al agregar un producto al carrito:', error.message);
            return error.message;
		}
	};
	insertArrayOfProducts = async (cid, arrayOfproducts) => {
		try {
			const productsToInsert = [];
			for (const item of arrayOfproducts) {
				const object = await productModel.findById(item.productID);
				productsToInsert.push({
					productID: object._id,
					quantity: item.quantity
				});
			}
			const filter = { _id: cid };
			const update = { $set: { products: productsToInsert } };
			const updateCart = await cartModel.findOneAndUpdate(filter, update, {
				new: true,
			});
			return updateCart;
		} catch (error) {
			console.log(error.message);
            return error.message
		}
	};
    deleteProdInCart = async (cid, pid) => {
		try {
			const cart = await cartModel.findOne({ _id: cid });
            const product = await productModel.findOne({_id: pid})
			const filter = cart.products.filter((item) => item.productID.toString() !== product._id.toString());
			await cartModel.updateOne({ _id: cid }, { products: filter });
		} catch (error) {
			console.log('Error al eliminar un producto del carrito:', error.message);
            return error.message;
		}
	};
	deleteAllProductsInCart = async (cid) => {
		try {
			const filter = { _id: cid };
			const update = { $set: { products: [] } };
			const updateCart = await cartModel.findOneAndUpdate(filter, update, {new: true});
			return updateCart;
		} catch (error) {
			console.log('Error al eliminar todos los productos:', error.message);
            return error.message
		}
	};
    deleteCart = async (cartId) => {
        try {
            return await cartModel.findByIdAndDelete(cartId)
        } catch (error) {
            console.log('Error al eliminar el carrito:', error.message)
            return error.message
        }
    }
}