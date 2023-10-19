const db = require("../../data/dbConfig");


const validatePost = async (req,res,next) => {
    try {
        const {username,password} = req.body;
        if (!username || !password) {
            next({status : 422, message : "username and password required"})
        } else {
            const validateUniqueness = await db("users").where("username",username).first();
            if (validateUniqueness) {
                next({status : 400, message : "username taken"})
            } else {
                next();
            }
        }
    } catch(err) {next(err)}
}

const validateLogin = async (req,res,next) => {
    try {
        const {username,password} = req.body;
        if (!username || !password) {
            next({status : 422, message : "username and password required"})
        } else {
            const foundUser = await db("users").where("username",username).first();
            if (!foundUser) {
                next({status : 401, message : "invalid credentials"})
            } else {
                req.foundUser = foundUser;
                next();
            }
        }
    } catch (err) {next(err)}
}

module.exports = {
    validatePost,
    validateLogin
}