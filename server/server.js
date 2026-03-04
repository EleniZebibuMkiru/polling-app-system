// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// MySQL connection
const db = require("./config/db"); // make sure this file exports the connection

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: "http://localhost:5173", // React frontend URL
    credentials: true,
  })
);
app.use(express.json()); // Parse JSON requests

// ================= IMPORT ROUTES =================
const authRoutes = require("./routes/authRoutes");   // Registration & Login
const pollRoutes = require("./routes/pollRoutes");   // Poll management
const voteRoutes = require("./routes/voteRoutes");   // User vote history & updates
const userRoutes = require("./routes/userRoutes");   // Admin user management

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes); // All poll-related endpoints
app.use("/api/votes", voteRoutes); // Vote history and editing
app.use("/api/users", userRoutes); // Admin only user listing

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Polling API Running");
});

// ================= FALLBACK FOR UNKNOWN ROUTES =================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

