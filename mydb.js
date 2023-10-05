const mysql = require('mysql2');

const dbPool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'Bitspilani18#',
    database: 'testing',
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