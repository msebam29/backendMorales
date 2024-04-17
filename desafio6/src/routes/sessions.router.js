const { Router } = require("express");
const UsersManagerMongo = require("../dao/UsersManagerMongo");
const {creaHash, validaPassword } = require("../utils");
const passport = require("passport");


const router = Router()

/* let usersManager = new UsersManagerMongo() */
router.get("/errorRegistro", (req, res)=>{
    return res.redirect("/registro?error=Error en el proceso de registro")
})

router.post('/registro', passport.authenticate("registro", {failureRedirect:"/api/sessions/errorRegistro"}), async (req,res)=>{
    return res.redirect(`/registro?mensaje=Registro exitoso para ${req.user.nombre}`)
})

router.get("/errorLogin", (req,res)=>{
    return res.status(400).json({error:`Error en el proceso de login`})
})
router.post('/login', passport.authenticate("login", {failureRedirect:"/api/sessions/errorLogin"}), async (req, res)=>{
    let user = req.user
    user = {...user}
    delete user.password
    req.session.user=user
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({message:"Login correcto", user});
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
