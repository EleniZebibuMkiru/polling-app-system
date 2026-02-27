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