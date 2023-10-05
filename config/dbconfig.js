const Sequelize = require('sequelize');


const sequelize = new Sequelize('testing', 'root', 'Bitspilani18#', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;