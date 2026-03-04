const express = require("express");
const router = express.Router();
const { getAllUsers, deleteUser, resetUserVotes } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Only admin can view all users
router.get("/", protect, getAllUsers);

// remove a user (cascades votes/options via foreign keys)
router.delete("/:id", protect, deleteUser);

// reset a user's votes and adjust option counts
router.post("/:id/reset-votes", protect, resetUserVotes);

module.exports = router;