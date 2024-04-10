const crypto = require("crypto")


const SECRET= "CoderCoder123"
const creaHash = password=>crypto.createHmac("sha256", SECRET).update(password).digest("hex")

module.exports = creaHash

