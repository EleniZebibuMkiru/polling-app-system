const express = require("express");
const router = express.Router();

// Controllers
const { registerUser, loginUser, updateProfile } = require("../controllers/authController");

// Middleware
const { protect } = require("../middleware/authMiddleware"); // use correct name

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update-profile", protect, updateProfile);

module.exports = router; // ✅ fixed typo (no space)