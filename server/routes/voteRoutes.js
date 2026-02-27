const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const voteController = require("../controllers/voteController");

// Get current user's votes (history)
router.get("/history", protect, voteController.getUserVotes);

module.exports = router;