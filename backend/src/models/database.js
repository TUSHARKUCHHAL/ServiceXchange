require("dotenv").config();
const mysql = require('mysql2');

// Destructuring database credentials from environment variables
const { DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD } = process.env;

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: DB_HOST,
    database: DB_DATABASE,
    user: DB_USER,
    password: DB_PASSWORD
});

// Export the pool for use in server.js
module.exports = pool.promise();
