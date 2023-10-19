const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require("morgan")

const {restrict} = require('./middleware/restricted.js');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(morgan('dev')); 

server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict, jokesRouter); // only logged-in users should have access!

server.use((error,req,res,next) => {  //eslint-disable-line
    res.status(error.status || 500).json({
        message : error.message,
        stack : error.stack, 
    })
})

module.exports = server;
