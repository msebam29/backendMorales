const dotenv = require ("dotenv")

dotenv.config(
    {
        path: "../src/.env",
        overrride: true
    }

)
const config = {
    PORT:process.env.PORT,
    MONGO_URL:process.env.MONGO_URL,
    SECRET:process.env.SECRET,
    CLIENT_ID:process.env.CLIENT_ID,
    CLIENT_SECRET:process.env.CLIENT_SECRET,
    PERSISTENCE:process.env.PERSISTENCE
}

module.exports = config