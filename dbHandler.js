const { Sequelize, DataTypes} = require('sequelize')
const handler = new Sequelize('data','root','',{
    dialect:'mysql',
    host:'localhost'
})

exports.table = handler.define('info',{
    'id':{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    'username':{
        type:DataTypes.STRING,
        allowNull:false
    },
    'password':{
        type:DataTypes.STRING,
        allowNull:false
    }
})