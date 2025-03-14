const express = require('express')
const dbHandler = require('./dbHandler')
require('dotenv').config()
const server = express()

server.use(express.json())
server.use(express.static('public'))

const PORT = process.env.PORT

dbHandler.table.sync({alter:true})

// Create admin
dbHandler.table.findOrCreate({
    where: { username: 'admin' },
    defaults: {
        jelszo: process.env.ADMIN_PASSWORD,
        osszeg: 0
    }
}).then(([user, created]) => {
    if (created) console.log('Admin user created');
}).catch(err => {
    console.error('Error creating admin:', err);
});

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

server.post('/update', async (req, res) => {
    try {
        const { username, money } = req.body;

        if (!username || money === undefined) {
            return res.status(400).json({ message: "Hiányzó adatok!" });
        }

        const user = await dbHandler.table.findOne({
            where: { username }
        });

        if (user) {
            await dbHandler.table.update(
                { osszeg: parseFloat(money) },  // Pénz felülírása
                { where: { username } }
            );

            res.json({ message: "Sikeres mentés!", newOsszeg: money });
        } else {
            res.status(404).json({ message: "Felhasználó nem található!" });
        }
    } catch (error) {
        console.error("Hiba a pénz mentésekor:", error);
        res.status(500).json({ message: "Szerverhiba történt!" });
    }
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
        res.status(200).json({'token':tkn, 'message':'Sikeres login', 'osszeg':oneuser.osszeg}) 
    }
    else{
        res.status(401).json({'message':'sikertelen login'}) 
    }
})

server.get('/allusers', Auth(), async (req, res) => {
    if (req.username !== 'admin') {
        return res.status(403).json({ message: 'Hozzáférés megtagadva' });
    }
    try {
        const allUsers = await dbHandler.table.findAll({
            attributes: ['username', 'osszeg']
        });
        res.json(allUsers);
    } catch (error) {
        res.status(500).json({ message: 'Szerverhiba' });
    }
});

server.delete('/deleteUser', Auth(), async (req, res) => {
    if (req.username !== 'admin') {
        return res.status(403).json({ message: 'Hozzáférés megtagadva' });
    }
    
    try {
        const { username } = req.body;
        await dbHandler.table.destroy({ where: { username } });
        res.json({ message: 'Felhasználó törölve' });
    } catch (error) {
        res.status(500).json({ message: 'Hiba a törlés során' });
    }
});

server.listen(PORT, ()=>{console.log('Running on ' + PORT)})

