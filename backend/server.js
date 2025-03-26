const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


require("dotenv").config();

const app = express();
app.use(express.json()); // Make sure to parse JSON requests
app.use(cors({ origin: "http://localhost:3000" }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const userRoutes = require("./Routes/userRoutes");
app.use("/api/users", userRoutes);

const auth = require("./Routes/auth");
app.use("/api/users", auth);

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
