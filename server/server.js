require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db"); // MySQL connection

const app = express();

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
const voteRoutes = require("./routes/voteRoutes");   // Voting actions
const userRoutes = require("./routes/userRoutes");   // Admin: manage users

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/users", userRoutes); // ✅ Admin users route

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Polling API Running 🚀");
});

// ================= FALLBACK FOR UNKNOWN ROUTES =================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});