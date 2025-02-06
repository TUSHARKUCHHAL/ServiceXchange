const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST, // replace with your RDS endpoint
  user: process.env.DB_USER, // master username from AWS RDS
  password: process.env.DB_PASSWORD, // master password from AWS RDS
  database: process.env.DB_DATABASE // the name of the database you created
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the MySQL database');
});

module.exports = db;
