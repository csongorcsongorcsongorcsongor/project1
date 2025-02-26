const { Sequelize, DataTypes} = require('sequelize')
const handler = new Sequelize('data','root','',{
    dialect:'mysql',
    host:'localhost'
})

exports.table = handler.define('userinfo',{
    'id':{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    'username':{
        type:DataTypes.STRING,
        allowNull:false
    },
    'jelszo':{
        type:DataTypes.STRING,
        allowNull:false
    },
    'osszeg':{
        type:DataTypes.INTEGER,
        allowNull:false
    }
})

// New table for house info
exports.houseTable = handler.define('houseInfo', {
    'osszeg': {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});