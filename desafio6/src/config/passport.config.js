const UsersManagerMongo = require("../dao/UsersManagerMongo");
const passport = require("passport")
const local = require("passport-local")
const gitHub = require("passport-github2")
const { creaHash, validaPassword } = require("../utils")

const usersManager = new UsersManagerMongo
const inicializaPassport = () => {
    passport.use(
        "registro",
        new local.Strategy({
            usernameField: "email",
            passReqToCallback: true
        },
            async function (req, username, password, done) {
                try {
                    let { nombre, email, password } = req.body
                    if (!nombre || !email || !password) {

                        return done(null, false)
                    }
                    let existe = await usersManager.getBy({ email })
                    if (existe) {
                        return done(null, false)
                    }
                    password = creaHash(password)

                    let nuevoUser = await usersManager.create({ nombre, email, password })
                    return done(null, nuevoUser)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
    passport.use(
        "login",
        new local.Strategy({
            usernameField: "email"
        },
            async function (username, password, done) {
                try {                   
                    let user = await usersManager.getBy({ email:username })
                    if (!user) {
                        return done(null, false)
                    }
                    if (!validaPassword(user, password)) {
                        return done(null, false)
                    }
                    return done(null, user)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
    passport.use(
        "github",
        new gitHub.Strategy(
            {
                clientID:"",
                clientSecret:"",
                callbackURL:""
            },
            async function (accesToken, refreshToken, profile, done){
                try {
                    let nombre = profile._json.name
                    let email = profile._jason.email
                    if(!email){
                        return done(null, false)
                    }
                    let user = await usersManager.getBy({email})
                    if(!user){
                        user=await usersManager.create({
                            nombre, email,
                            profileGithub: profile
                        })
                    }
                    return done(null, user)
                } catch (error) {
                    return done(error)                   
                }
            }
        )
    )
    passport.serializeUser((user, done) => {
        return done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        let user = await usersManager.getBy({ _id: id })
        return done(null, user)
    })
}

module.exports= inicializaPassport