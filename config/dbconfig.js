const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: 'mysql'
});

module.exports = sequelize;


// host: process.env.DATABASE_HOST,
// user: process.env.DATABASE_USER,
// password: process.env.DATABASE_PASSWORD,
// database: process.env.DATABASE_NAME,