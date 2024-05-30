import  jwt  from "jsonwebtoken";
import { userService } from "../services/index.js";

export const register = async (req, res) => {
    res.status(200).json({status:"success", message: "Usuario registrado correctamente"});
}

export const failRegister = async(req,res)=>{
    res.status(400).json({error:"Failed", message: "Error en el registro"});
}



export const loginSession = async (req, res) => {
    if(!req.user){
        return res.status(400).json({status:'error' , error: 'Credenciales invalidas' })
    }
    req.user.last_connection = Date.now();
    await userService.updateUserById(req.user._id, req.user);
    delete req.user.password; 
    req.session.user = req.user     
    res.status(200).json({status:'success', message: `Usuario ${req.user._id} ha iniciado sesión`, payload: req.session.user});
}
export const loginJWT = async (req, res) => {
    const serializedUser = {
        _id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        role: req.user.role,
        email: req.user.email
    }
    req.user.last_connection = Date.now();
    await userService.updateUserByEmail(req.user.email, req.user);
    const token = jwt.sign(serializedUser, process.env.JWT_SECRET , {expiresIn: '1h'})
    res.cookie('coderCookie', token, {maxAge: 3600000, httpOnly: true, secure: true}).send({status:"success", payload: serializedUser});
    res.status(200).json({status:'success', message: `Token JWT generado para el usuario ${req.user._id}`});
}
export const gitHubCallBack = async (req, res) => {
    const serializedUser = {
        _id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        cart: req.user.cart,
        role: req.user.role
    }
    req.user.last_connection = Date.now();
    await userService.updateUserByEmail(req.user.email, req.user);
    const token = jwt.sign(serializedUser, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.cookie('coderCookie', token, { maxAge: 3600000, httpOnly: true });
    res.status(200).json({status:'success', message: `Token JWT generado con Git Hub para el usuario ${req.user._id}`});
    res.redirect('/products')
}
export const failLogin = async(req,res) => {
    res.status(400).json({error:"Falla en el proceso de login"}); 
}
export const logOutJwt = async (req, res) => {
    try {
        req.user.last_connection = Date.now();
        await userService.updateUserByEmail(req.user.email, req.user);
        res.clearCookie('coderCookie');
        res.status(200).json({message:'JWT logout exitoso'})
        res.redirect('/');
    } catch (error) {
        return res.status(500).json({ status: 'error', error: 'Error del servidor: Error al cerrar la sesión JWT' });
    }
}

export const logOutSession = (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send('Error al cerrar la sesión');
		} else {
			res.clearCookie('connect.sid');
            res.status(200).json('Logout de sesión exitoso');
			res.redirect('/login');
		}
	})
}