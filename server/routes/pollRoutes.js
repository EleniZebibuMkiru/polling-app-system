// routes/pollRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const pollController = require("../controllers/pollController");

// ================= POLL ROUTES =================

// Create a new poll
router.post("/", protect, pollController.createPoll);

// Get all polls
router.get("/", protect, pollController.getPolls);

// Get a single poll by ID
router.get("/:id", protect, pollController.getPollById);

// Cast a vote
router.post("/vote", protect, pollController.vote);

// Update an existing vote
router.put("/update-vote", protect, pollController.updateVote);

// Get poll results
router.get("/results/:id", protect, pollController.getPollResults);

// Toggle poll status (open/closed)
router.put("/:id/status", protect, pollController.toggleStatus);

// Delete a poll (and its options/votes via cascade)
router.delete("/:id", protect, pollController.deletePoll);

module.exports = router; // ✅ Export router