import { cartService } from "../services/index.js";
import { productService } from "../services/index.js";
import { userService } from "../services/index.js";
import { ticketService } from "../services/index.js";

export const getAllCarts = async (req, res) => {
	try {
		const allCarts = await cartService.getAllCarts();
		res.status(200).json({ payload: allCarts });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
export const createNewCart = async (req, res) => {
	try {
		const cartData = req.body;
		const createdCart = await cartService.createCart(cartData);
		res.status(201).json({ status: 'success', payload: createdCart });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
export const getCartById = async (req, res) => {
	try {
		const cartID = req.params.cid;
		const getCart = await cartService.getCartById(cartID);
		if (!getCart) {
			res.status(400).json (`Carrito con el id ${cartID} no existe`);
		}
		res.status(200).json({ status: 'success', payload: getCart });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const addProductToCart = async (req, res) => {
	try {
		const cartId = req.params.cid; 
		const productId = req.params.pid; 
		await cartService.addProductToCart(cartId, productId);
		res.status(200).json({status:'success: producto agregado al carrito correctamente'}); 
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

export const deleteProdInCart = async (req, res) => {
	const { cid: cartId, pid: productId } = req.params;
	try {
		const cart = await cartService.getCartById(cartId);
		if (!cart) {
			return res.status(404).json({ error: 'Carrito no encontrado' });
		}
		const productExists = cart.products.find((product) => product.productID == productId);
		if (!productExists) {
			return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
		}

		await cartService.deleteProdInCart(cartId, productId);
		res.status(200).json({ status: 'success', payload: productExists, message:`Producto ${productId} eliminado del carrito ${cartId}` });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
export const deleteAllProductsInCart = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartService.getCartById(cid);
        if (!cart) {
            res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
            return;
        }
        await cartService.deleteAllProductsInCart(cid);
        res.status(200).json({ status: 'success', message: 'Carrito vaciado con éxito' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: `Error al eliminar todos los productos del carrito: ${error.message}` });
    }
}
export const addProductsToCart = async (req, res) => {
    const { productsToAdd } = req.body;
    const { cid: cartId } = req.params;
    try {
        const existingCart = await cartService.getCartById(cartId);

        if (!existingCart) {
            res.status(404).json({ status: 'error', message: `Carrito ${cartId} no encontrado.`});
            return;
        }
        for (const product of productsToAdd) {
            const existingProduct = await productService.getProductById(product.productID);
            if (!existingProduct) {
                res.status(404).json({ status: 'error', message: `Producto ${product._id} no encontrado` });
                return;
            }
        }

        const updatedCart = await cartService.insertArrayOfProducts(cartId, productsToAdd);
        res.status(200).json({ status: 'success', message: 'Productos agregados con éxito', updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: `Error al agregar productos al carrito: ${error.message}` });
    }
}


export const modifyProductQuantity = async (req, res) => {
	const { cid, pid } = req.params;
	const { newQuantity } = req.body;
	try {
		const foundCart = await cartService.getCartById(cid);
		if (!foundCart) {
			res.status(404).json({ status: 'error', message: `Carrito ${cid} no encontrado` });
		}
		const productInCart = foundCart.products.find((product) => product.productID.toString() === pid);
		if (!productInCart) {
			res.status(404).json({ status: 'error', message: `Producto ${pid} no encontrado en el carrito ${cid}.`})
		}

		const updatedCart = await cartService.modifyQuantity(cid, pid, Number(newQuantity));
		return res.status(200).json({ status: 'success', updatedCart });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
export const purchase = async (req,res) => {
	let purchaseComplete = []  
	let purchaseError = [] 
	let precioTotal = 0
	const userId = req.user._id; 
	const findUser = await userService.getUserById(userId);
	const cartId = findUser.cart[0]._id 
	const cart = await cartService.getCartById(cartId)
	const productsInCart = cart.products
	try {
		for (let product of productsInCart ) {
			const idproduct = product.productID
			const quantity = product.quantity
			const productInDB = await productService.getProductById(idproduct)
			if(quantity > productInDB.stock){  
				purchaseError.push(product);  
				res.status(404).json({ status: 'error', message:`El producto ${product.productID} no tiene suficiente stock.`})
			}
	
			if(quantity <= productInDB.stock){	
				let productUpdate = productInDB;
				const quantityUpdate = productInDB.stock - quantity;
				productUpdate.stock = quantityUpdate; 
				const update = await productService.updateProduct(idproduct, productUpdate) 
				purchaseComplete.push(product); 
				const monto = productInDB.price * quantity
				precioTotal = precioTotal + monto
				res.status(200).json({ status: 'success', message:`El producto ${product.productID} se ha procesado correctamente.`});
			}
		}
		const notPurchasedProductsInCart = await cartService.insertArrayOfProducts(cartId,purchaseError);
        if (purchaseComplete.length > 0) {
			const ticketData = {
				amount: precioTotal,
				purchaser: req.user.email
			}
			const ticket = await ticketService.addTicket(ticketData);
			res.status(200).json({ status: 'success', message:`Ticket de compra creado con éxito. ID del ticket: ${ticket._id} , Monto total:${precioTotal} , Usuario: ${req.user.email}`});

			const purchaseData = {
				ticket: ticket,
				productosProcesados: purchaseComplete,
				productosNoProcesados: purchaseError,
			}
			res.status(200).send({ status: 'success', payload: purchaseData, message:'Compra realizada con éxito.'})
		}else {
            res.status(200).send({ status: 'success', message: 'No se procesaron productos, por falta de stock.', productosNoProcesados: purchaseError});
        }
	} catch (error) {
		res.status(400).send({ error: `Error en el proceso de compra: ${error.message}`});
	}
}