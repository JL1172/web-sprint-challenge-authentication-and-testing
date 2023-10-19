const db = require("../../data/dbConfig");

const findAll = async() => {
    return await db("users"); 
}

const add = async(user) => {
    const [added] = await db('users').insert(user);
    return await db('users').where("id",added); 
}

module.exports = {
    findAll,
    add
}