const express = require('express')
const dbHandler = require('./dbHandler')
require('dotenv').config()
const server = express()

server.use(express.json())
server.use(express.static('public'))

const PORT = process.env.PORT

dbHandler.table.sync({alter:true})

const JWT = require('jsonwebtoken')

function Auth() {
    return (req, res, next) => {
        const authheader = req.headers.authorization;
        if (!authheader || authheader.split(' ')[0] !== 'Bearer') {
            res.status(401).json({ 'message': 'Hibás/nem létező token' });
            return res.end();
        } else {
            const encryptedToken = authheader.split(' ')[1];
            try {
                const token = JWT.verify(encryptedToken, process.env.TOKEN);
                req.username = token.username;
                req.osszeg = token.osszeg;
                next();
            } catch (error) {
                res.status(401).json({ 'message': error.message });
                res.end();
            }
        }
    };
}

server.get('/profil', Auth(), async (req, res) => {
    const user = await dbHandler.table.findOne({
        where: { username: req.username }
    });

    if (user) {
        res.json({ 
            'username': user.username, 
            'osszeg': user.osszeg 
        });
    } else {
        res.status(404).json({ 'message': 'Felhasználó nem található' });
    }
    res.end();
});


server.put('/save', async (req, res) => {
    const oneuser = await dbHandler.table.findOne({
        where: {
            username: req.body.username
        }
    });

    if (oneuser) {
        const newAmount = parseFloat(oneuser.osszeg) + parseFloat(req.body.osszeg);
        
        await dbHandler.table.update({
            osszeg: newAmount
        }, {
            where: {
                username: req.body.username
            }
        });

        res.json({ 'message': 'Sikeres feltöltés', 'newOsszeg': newAmount });
    } else {
        res.status(404).json({ 'message': 'Felhasználó nem található' });
    }
    res.end();
});


server.post('/register', async (req, res) => {
    const oneuser = await dbHandler.table.findOne({
        where: {
            username: req.body.registerUsername
        }
    })
    if(oneuser){
        res.status(403).json({'message':'Már létezik ilyen felhasználó'})
    }
    else{
        await dbHandler.table.create({
            username:req.body.registerUsername,
            jelszo:req.body.registerPassword,
            osszeg:req.body.regAmount
        })
        res.status(200).json({'message':'Sikeres regisztráció'})
    }
    res.end()
})

server.post('/login', async(req,res)=>{
    const oneuser = await dbHandler.table.findOne({ 
        where:{
            username:req.body.loginUsername,
            jelszo:req.body.loginPassword
        }
    })
    if(oneuser){
        const tkn = JWT.sign({'username':oneuser.username, 'osszeg':oneuser.osszeg},process.env.TOKEN,{expiresIn:'1h'})
        res.status(200).json({'token':tkn, 'message':'Sikeres login'}) // 200 for success
    }
    else{
        res.status(401).json({'message':'sikertelen login'}) // 401 Unauthorized for failure
    }
})

server.listen(PORT, ()=>{console.log('Running on ' + PORT)})

