const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Only admin can view all users
router.get("/", protect, getAllUsers);

module.exports = router;