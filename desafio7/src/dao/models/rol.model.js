const mongoose = require("mongoose");

const rolModel = mongoose.model(
    "roles",
    new mongoose.Schema(
        {
            descrip: String
        },
        {timestamps:true, collection:"roles"}
    )
)

module.exports = rolModel