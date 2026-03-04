const db = require("../config/db");
const util = require("util");

const query = util.promisify(db.query).bind(db);

exports.getAllUsers = async (req, res) => {
  try {
    // Only admin can access
    if (req.userRole !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const users = await query(
      "SELECT id, name, email, role, created_at FROM users"
    );

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE USER =================
exports.deleteUser = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const userId = req.params.id;
    // Prevent admin from deleting themselves
    if (parseInt(userId, 10) === req.userId) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    const result = await query("DELETE FROM users WHERE id = ?", [userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= RESET USER VOTES =================
exports.resetUserVotes = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const userId = req.params.id;
    const users = await query("SELECT * FROM users WHERE id = ?", [userId]);
    if (!users.length) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get votes cast by the user
    const votes = await query("SELECT option_id FROM votes WHERE user_id = ?", [userId]);
    if (votes.length > 0) {
      // tally count per option
      const counts = votes.reduce((acc, v) => {
        acc[v.option_id] = (acc[v.option_id] || 0) + 1;
        return acc;
      }, {});

      // decrement each option's vote_count
      for (const [optionId, count] of Object.entries(counts)) {
        await query(
          "UPDATE options SET votes_count = votes_count - ? WHERE id = ? AND votes_count >= ?",
          [count, optionId, count]
        );
      }

      // delete the votes
      await query("DELETE FROM votes WHERE user_id = ?", [userId]);
    }

    res.json({ message: "User votes reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};