import fs from 'fs';
import path from 'path';
import __dirname from '../../../utils.js';
import { log } from 'console';

export default class UserManager{
    constructor(){
        this.path = path.join(__dirname,'./data/users.json');
    }
    getUsers = async () => {
        try {
            const users = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'));
            return users;
        } catch (error) {
                console.log('Error al obtener usuarios' + error.message)
            }
        }
    }
    getUserById = async (userId) => {
        try {
            const users = await this.getUsers();
            const user = users.find(user => user._id === userId);
            return user
        } catch (error) {
            console.log(error);
        }
    }
    getUserByEmail = async (userEmail) => {
        try {
            const users = await this.getUsers();
            const user = users.find(user => user.email === userEmail);
            return user;
        } catch (error) {
            console.log(error);
        }
    }
    addUser = async (user) => {
        try {
            const {first_name, last_name, email, age, password, cart, role, documents, last_connection} = user;
            if(!first_name || !last_name || !email || !password ){
                console.log("Datos del usuario incompletos");
                return
            }
            const userList = await this.getUsers();
            if(userList.find(u => u.email === email)){
                console.log("Email ya en uso");
                return
            }
            user.age = age || null;
            user.cart = [cart] || [];
            user.documents = documents || [];
            user.role = role || 'user';
            user.last_connection = last_connection || Date.now();
            user._id = userList.length > 0 ? Math.max(...userList.map(u => u._id)) + 1 : 1;
            userList.push(user);
            await fs.promises.writeFile(this.path, JSON.stringify(userList, null, 2));
            return user;
        } catch (error) {
            console.log(error);
            return
        }
    }
    updateUserById = async (idUser, user) => {
        try{
            const users = await this.getUsers();
            const updatedUsers = users.map(u => u._id === idUser ? {...u, ...user} : u);
            await fs.promises.writeFile(this.path, JSON.stringify(updatedUsers, null, 2));
            return updatedUsers.find(u => u._id === idUser);
        }catch(error){
            console.log(error);
            return
        }
    }
    updateUserByEmail = async (userEmail, user) => {
        try{
            const users = await this.getUsers();
            const updatedUsers = users.map(u => u.email === userEmail ? {...u, ...user} : u);
            await fs.promises.writeFile(this.path, JSON.stringify(updatedUsers, null, 2));
            return updatedUsers.find(u => u.email === userEmail);
        }catch(error){
            console.log(error);
            return
        }
    }    
    deleteUser = async (idUser) => {
        try{
            const users = await this.getUsers();
            const updatedUsers = users.filter(u => u._id !== idUser);
            await fs.promises.writeFile(this.path, JSON.stringify(updatedUsers, null, 2));
            return updatedUsers;
        }catch (error) {
            console.log(error);
            return
        }
    }