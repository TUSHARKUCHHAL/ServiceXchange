const express = require("express");
const multer = require("multer");
const pool = require("./models/database"); // Import database connection
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Multer setup to store images in memory as a buffer
const upload = multer({ storage: multer.memoryStorage() });

// Upload Route to Insert Data into PostgreSQL
app.post("/api/checkin", upload.single("image"), async (req, res) => {
  const { motive, city } = req.body;
  const image = req.file ? req.file.buffer : null; // Convert image to buffer

  if (!motive || !city || !image) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO checkins (motive, city, image) VALUES ($1, $2, $3) RETURNING *",
      [motive, city, image]
    );

    res.status(201).json({ message: "Check-in saved", data: result.rows[0] });
  } catch (error) {
    console.error("Error inserting check-in:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});