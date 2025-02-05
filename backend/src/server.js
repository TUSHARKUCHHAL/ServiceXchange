const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const { DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD } = process.env;

// Database Connection
const db = mysql.createConnection({
  host: DB_HOST,
    database: DB_DATABASE,
    user: DB_USER,
    password: DB_PASSWORD
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Create Hospitals Table
const createHospitalTableQuery = `
  CREATE TABLE IF NOT EXISTS hospitals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    contact VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    services TEXT NOT NULL
  );
`;

db.query(createHospitalTableQuery, (err) => {
  if (err) console.error("Error creating hospital table:", err);
});

// Create NGOs Table
const createNGOTableQuery = `
  CREATE TABLE IF NOT EXISTS ngos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    poc_name VARCHAR(255) NOT NULL,
    poc_number VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL
  );
`;

db.query(createNGOTableQuery, (err) => {
  if (err) console.error("Error creating NGO table:", err);
});

// API Endpoint to Store Hospital Data
app.post("/api/hospital", (req, res) => {
  const { name, address, contact, email, services } = req.body;
  const query = "INSERT INTO hospitals (name, address, contact, email, services) VALUES (?, ?, ?, ?, ?)";
  
  db.query(query, [name, address, contact, email, services], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Database error", error: err });
    } else {
      res.status(200).json({ message: "Hospital registered successfully" });
    }
  });
});

// API Endpoint to Store NGO Data
app.post("/api/ngo", (req, res) => {
  const { name, city, pocName, pocNumber, email } = req.body;
  const query = "INSERT INTO ngos (name, city, poc_name, poc_number, email) VALUES (?, ?, ?, ?, ?)";

  db.query(query, [name, city, pocName, pocNumber, email], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Database error", error: err });
    } else {
      res.status(200).json({ message: "NGO registered successfully" });
    }
  });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
