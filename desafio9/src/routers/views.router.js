import  {Router}  from "express";
import __dirname from "../utils/utils.js";
import { 
	getProducts, 
	getProductsInRealTime, 
	chatStyle, 
	pagination, 
	cartView, 
	redirection, 
	loginView , 
	registerView , 
	profileView, 
	purchaseView
} from "../controllers/viewsController.js";
import { applyPolicy,  privateAccess, redirectAdmin ,sessionExist ,publicAccess } from "../middlewares/authMiddleware.js";
import { passportCall , passportCallForHome } from "../utils/utils.js";

const router = Router();
router.get('/home',passportCallForHome('jwt'), sessionExist , applyPolicy(['PUBLIC']), getProducts );
router.get("/products",passportCall('jwt'), redirectAdmin, applyPolicy(['USER' , 'PREMIUM']), pagination );
router.get('/realtimeproducts' ,passportCall('jwt'), applyPolicy(['ADMIN' , 'PREMIUM']), getProductsInRealTime );
router.get('/carts/:cid',passportCall('jwt'), cartView );
router.get('/carts/:cid/purchase', passportCall('jwt'),applyPolicy(['USER' , 'PREMIUM']), privateAccess, purchaseView);
router.get("/chat",passportCall('jwt'),applyPolicy(['USER' , 'PREMIUM']), chatStyle );
router.get('/', redirection);
router.get('/login',passportCallForHome('jwt'), sessionExist , loginView);
router.get('/register',passportCallForHome('jwt'), sessionExist , registerView);
router.get('/profile', passportCall('jwt'),applyPolicy(['USER' , 'PREMIUM']), privateAccess, profileView);

export default router;