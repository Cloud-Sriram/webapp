const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');
const User = sequelize.define('User', {
    // Define your user model attributes
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        readonly: true,
      },
   first_name :{
    type:DataTypes.STRING,
    allowNull: false
   },
   last_name:{
    type:DataTypes.STRING,
    allowNull:false
   },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
      type: DataTypes.STRING,
    allowNull:false
    },
    account_created: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    account_updated: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
});

module.exports = User;