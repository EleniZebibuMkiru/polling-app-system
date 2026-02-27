const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const pollController = require("../controllers/pollController");

// Poll endpoints
router.post("/", protect, pollController.createPoll);
router.get("/", protect, pollController.getPolls);
router.get("/:id", protect, pollController.getPollById);
router.post("/vote", protect, pollController.vote);
router.get("/results/:id", protect, pollController.getPollResults);
router.put("/:id/status", protect, pollController.toggleStatus); // toggle open/closed

module.exports = router;