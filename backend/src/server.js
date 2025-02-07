const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();
const axios = require('axios'); // Add axios for making HTTP requests

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ✅ Environment Variables with Defaults
const DB_HOST = process.env.REACT_APP_DB_HOST || "your-db-host";
const DB_DATABASE = process.env.REACT_APP_DB_DATABASE || "your-database-name";
const DB_USER = process.env.REACT_APP_DB_USER || "your-db-username";
const DB_PASSWORD = process.env.REACT_APP_DB_PASSWORD || "your-db-password";

// ✅ Use MySQL Connection Pooling for Stability
const db = mysql.createPool({
  connectionLimit: 10, // Limit connections
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

// ✅ Check Database Connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database");
    connection.release(); // Release connection back to pool
  }
});

// ✅ Automatically Reconnect if Connection is Lost
db.on("error", (err) => {
  console.error("❌ MySQL error:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.log("🔄 Reconnecting to MySQL...");
  }
});

// ✅ Create Tables (Hospitals & NGOs) if Not Exists
const createTables = () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS hospitals (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address TEXT NOT NULL,
      contact VARCHAR(20) NOT NULL,
      email VARCHAR(100) NOT NULL,
      services TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS ngos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      city VARCHAR(100) NOT NULL,
      poc_name VARCHAR(255) NOT NULL,
      poc_number VARCHAR(20) NOT NULL,
      email VARCHAR(100) NOT NULL
    );`
  ];

  queries.forEach((query) => {
    db.query(query, (err) => {
      if (err) console.error("❌ Error creating table:", err);
    });
  });
};
createTables();

// ✅ API Endpoint to Store Hospital Data
app.post("/api/hospital", (req, res) => {
  const { name, address, contact, email, services } = req.body;

  if (!name || !address || !contact || !email || !services) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = "INSERT INTO hospitals (name, address, contact, email, services) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [name, address, contact, email, services], (err, result) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({ message: "✅ Hospital registered successfully", id: result.insertId });
  });
});

// ✅ API Endpoint to Store NGO Data
app.post("/api/ngo", (req, res) => {
  const { name, city, pocName, pocNumber, email } = req.body;

  if (!name || !city || !pocName || !pocNumber || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = "INSERT INTO ngos (name, city, poc_name, poc_number, email) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [name, city, pocName, pocNumber, email], (err, result) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({ message: "✅ NGO registered successfully", id: result.insertId });
  });
});

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully!");
});

// ✅ New API Route to Get Instance Metadata (Optional)
app.get("/api/instance-info", async (req, res) => {
  try {
    const metadataUrl = "http://169.254.169.254/latest/meta-data/";
    
    // Fetch EC2 instance metadata
    const instanceMetadata = await axios.get(metadataUrl);
    
    // Send metadata in response
    res.json({ instanceInfo: instanceMetadata.data });
  } catch (error) {
    console.error("❌ Failed to fetch instance metadata:", error);
    res.status(500).json({ message: "Failed to fetch instance metadata", error: error.message });
  }
});

// ✅ Start Server (Allow External Access on AWS)
app.listen(5000,  () => {
  console.log(`🚀 Server running on http://your-ec2-public-ip:${PORT}`);
});
