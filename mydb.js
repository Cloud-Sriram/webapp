const mysql = require('mysql2');
require('dotenv').config();
const dbPool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });
  
  // Function to check the database connection
  function checkDbConnection(callback) {
    dbPool.getConnection((err, connection) => {
      if (err) {
        return callback(err, null);
      }
  
      connection.release();
      callback(null, true);
    });
  }

  module.exports = {
    checkDbConnection
  }