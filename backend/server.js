// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const bloodRequestRoutes = require("./routes/bloodRequestRoutes");
const donorRoutes = require("./routes/donorRoutes");
const verificationRoutes = require('./routes/verificationRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use("/api/blood", bloodRequestRoutes);
app.use("/api/donors", donorRoutes);
app.use('/api/verification', verificationRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});