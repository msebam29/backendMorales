const { Router } = require("express");
const UsersManagerMongo = require("../dao/UsersManagerMongo");
const creaHash = require("../utils");


const router = Router()

let usersManager = new UsersManagerMongo()

router.post('/registro',async (req,res)=>{
    let {nombre, email, password} = req.body
    if(!nombre || !email || !password){
        
        return res.redirect("/registro?error=Faltan datos")
    }
    let existe = await usersManager.getBy({email})
    if(existe){
        
        return res.redirect(`/registro?error=Ya existen usuarios con email ${email}`)        
    }
    password= creaHash(password)
    try {
        let nuevoUser = await usersManager.create({nombre, email, password})
        
        return res.redirect(`/registro?mensaje=Registro exitoso para ${nombre}`);
    } catch (error) {
        
        return res.redirect(`/registro?error=Error 500 - Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`)
    }
})

router.post('/login', async (req, res)=>{
    let {email, password} = req.body
    if(!email || !password){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Faltan datos, email y password son necesarios`})
    }
    let user = await usersManager.getBy({email})
    if(!user){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Credenciales incorrectas`})
    }
    if(user.password!==creaHash(password)){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Credenciales incorrectas`})
    }
    user={...user}
    delete user.password
    req.session.usuario=user

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({message:"Login correcto", user})    
})

router.get('/logout', (req, res)=>{
    req.session.destroy(e=>{
        if(e){
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle:`${e.message}` 
        })
        }
    })
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({message:"Logout exitoso"});
})

module.exports=router
