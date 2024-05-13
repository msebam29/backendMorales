const { Router } = require("express");
const passport = require("passport");

const router = Router()

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
router.get("/github", passport.authenticate("github", {}), (req, res)=>{})

router.get("/callbackGithub", passport.authenticate("github", {failureRedirect:"/api/sessions/errorGitHub"}), (req, res)=>{
    req.session.user=req.user
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"Login correcto", user:req.user});
})
router.get("/errorGitHub", (req, res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(500).json({
        error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: "Fallo al autenticar con GitHub"
    })
    
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
router.get("/current", (req,res)=>{
    let user = req.session.user
    
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:user});
})
module.exports=router
