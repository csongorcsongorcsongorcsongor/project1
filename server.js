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
        res.status(403).json({'message':'Már létezik ilyen felhasználó'})
    }
    else{
        await dbHandler.table.create({
            username:req.body.regName,
            jelszo:req.body.regPass,
            osszeg:req.body.regAmount
        })
        res.status(200).json({'message':'Sikeres regisztráció'})
    }
    res.end()
})

server.post('/login', async(req,res)=>{
    const oneuser = await dbHandler.table.findOne({
        where:{
            username:req.body.loginName,
            jelszo:req.body.loginPass
        }
    })
    if(oneuser){
        res.status(200).json({'message':'Sikeres login'}) // 200 for success
    }
    else{
        res.status(401).json({'message':'sikertelen login'}) // 401 Unauthorized for failure
    }
})

server.listen(PORT, ()=>{console.log('Running on ' + PORT)})

