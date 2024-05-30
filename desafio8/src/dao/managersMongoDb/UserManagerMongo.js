import { userModel } from '../../models/user.model.js';

export default class UserManager{
    constructor(){}
    getUsers = async (filter) => {
        try {
            const users = await userModel.find(filter).lean()
            return users
        } catch (error) {
            console.log(error)
            return error
        }
    }
    getUserById = async (userId) => {
        try {
            const user = await userModel.findById(userId).lean()
            return user
        } catch (error) {
            console.log(error)
            return error
        }
    }
    getUserByEmail = async (userEmail) => {
        try {
            const user = await userModel.findOne({email: userEmail}).lean()
            return user
        } catch (error) {
            console.log(error)
            return error.message
        }
    }
    addUser = async (user) => {
        try {
            return await userModel.create(user)
        } catch (error) {
            console.log(error)
            return error.message
        }
    }
    updateUserById = async (idUser, user) => {
        try{
            return await userModel.updateOne({ _id: idUser } , user)
        }catch(error){
            console.log(error);
            return error.message
        }
    }
    updateUserByEmail = async (userEmail, user) => {
        try{
            return await userModel.updateOne({ email: userEmail } , user)
        }catch(error){
            console.log(error);
            return error.message
        }
    }
    deleteUser = async (idUser) => {
        try{
            return await userModel.deleteOne({_id: idUser})
        }catch (error) {
            console.log(error)
            return error.message
        }
    }
    deleteUsers = async (filter) => {
        try{
            return await userModel.deleteMany(filter)
        }catch (error) {
            console.log(error)
            return error.message
        }
    }
}