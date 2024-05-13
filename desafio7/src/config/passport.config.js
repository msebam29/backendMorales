const UsersManagerMongo = require("../dao/UsersManagerMongo");
const passport = require("passport")
const local = require("passport-local")
const gitHub = require("passport-github2")
const { creaHash, validaPassword } = require("../utils");
const rolModel = require("../dao/models/rol.model");
const CartManagerMongo = require("../dao/CartManagerMongo");
const config = require("./config");


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
                    let { first_name, last_name, email, age, password } = req.body
                    if (!first_name || !last_name || !email || !age || !password || !cart || !role) {

                        return done(null, false)
                    }
                    let existe = await usersManager.getBy({ email })
                    if (existe) {
                        return done(null, false)
                    }
                    password = creaHash(password)
                    let rol = await rolModel.findOne({descrip:"usuario"})
                    if(!rol){
                        rol= await rolModel.create({descrip:"usuario"})
                    }
                    rol:rol._id

                    let cart = await CartManagerMongo.create ()
                    cart:cart._id

                    let nuevoUser = await usersManager.create({ first_name, last_name, email, age, password, cart, rol})
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
                    let user = await usersManager.getBy({ email:username })/* .populate("rol").lean() */
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
                clientID:config.CLIENT_ID,
                clientSecret:config.CLIENT_SECRET,
                callbackURL:"http://localhost:8080/api/sessions/callbackGithub"
            },
            async function (accesToken, refreshToken, profile, done){
                try {
                    first_name, last_name, email, age, password, cart, role
                    let nombre = profile._json.name
                    let email = profile._json.email
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