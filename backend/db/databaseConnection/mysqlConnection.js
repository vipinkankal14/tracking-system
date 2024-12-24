const mysql = require('mysql2');
require('dotenv').config();  // Load environment variables from .env

// Create a connection pool to the MySQL database using environment variables
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the pool for reuse in other parts of the application
module.exports = pool.promise();
