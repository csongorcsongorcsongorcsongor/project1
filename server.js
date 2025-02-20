const express = require('express')
const dbHandler = require('./dbHandler')
require('dotenv').config()
const server = express()

server.use(express.json())
server.use(express.static('public'))

const PORT = process.env.PORT

dbHandler.table.sync({alter:true})

const JWT = require('jsonwebtoken')


server.post('/register', async (req, res) => {
    const oneuser = await dbHandler.table.findOne({
        where: {
            username: req.body.regName 
        }
    })
    if(oneuser){
        res.json({'message':'már létezik ilyen user'})
    }
    else{
        await dbHandler.table.create({
            username:req.body.regName,
            password:req.body.regPass
        })
        res.json({'message':'Sikeres regisztráció'})
    }
    res.end()
})

server.listen(PORT, ()=>{console.log('Running on ' + PORT)})