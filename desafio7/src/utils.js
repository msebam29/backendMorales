const crypto = require("crypto")
const bcrypt = require("bcrypt")

const SECRET= "CoderCoder123"
/* const creaHash = password=>crypto.createHmac("sha256", SECRET).update(password).digest("hex") */
const creaHash = password =>bcrypt.hashSync(password, bcrypt.genSaltSync(10))
const validaPassword = (user, password)=>bcrypt.compareSync(password, user.password)

module.exports = { creaHash, validaPassword }

