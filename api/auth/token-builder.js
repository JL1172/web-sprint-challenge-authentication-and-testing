const jwt = require("jsonwebtoken")



const tokenBuilder = (user) => {
    const payload = {
        subject : user.id,
        username : user.username,
    }
    const options = {
        expiresIn : "1d",
    }
    return jwt.sign(payload,process.env.SECRET || "shh", options)
}

module.exports = {tokenBuilder}