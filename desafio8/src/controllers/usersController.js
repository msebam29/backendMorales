import { userService } from "../services/index.js"
import { cartService } from "../services/index.js";
import {config} from "../config/config.js";

export const premiumController = async(req,res) =>{
    const {uid} = req.params;
    const user = await userService.getUserById(uid)
    if(req.user.role === 'admin'){
        switch (user.role) {
            case 'user':
              user.role = 'premium';
              break;
            case 'premium':
              user.role = 'user';
              break;
        }
        const updateUser = await userService.updateUserById(uid, user);
        res.status(200).json({ status: 'success', user: user, message: `Usuario actualizado a rol: ${user.role}`});
        return;
    }
    const REQUIRED_DOCUMENTS = ['identification', 'address_proof', 'account_statement'];
    if (REQUIRED_DOCUMENTS.every(doc => user.documents.map(document => document.name.split('.')[0]).includes(doc))) {
        switch (user.role) {
          case 'user':
            user.role = 'premium';
            break;
          case 'premium':
            user.role = 'user';
            break;
        }
        const updateUser = await userService.updateUserById(uid, user);
        res.status(200).send({ status: 'success', user: user, message: `Usuario actualizado a rol: ${user.role}` });
    } else {
        res.status(400).send('Faltan documentos requeridos');
    }
}

export const uploadDocuments = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.uid);
        if (!user) {
            return res.status(404).send('User not found');
        }
        if(!req.files){
            return res.status(400).send({status:'error' , error:'No se puede guardar el archivo'})
        }
        let documents = req.files
        documents.forEach(doc => {
            user.documents.push({
            name: doc.originalname,
            reference: doc.path
            });
        });
        await userService.updateUserById(req.params.uid, user);
    } catch (error) {
        console.log(error)
    }
}

export const getUsers = async (req,res) => {
    const users = await userService.getUsers()
    res.status(200).json({ status: 'success', users: users })
}
export const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const userToDelete = await userService.getUserById(uid);
        await cartService.deleteCart(userToDelete.cart[0]._id)
        await userService.deleteUser(uid);
        res.status(200).json({ status: 'success', message: 'Usuario eliminado correctamente' });
    }catch (error) {
        res.status(500).json({ message: `Error al eliminar usuarios: ${error}`});  
    }
}