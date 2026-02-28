const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const util = require("util");

const query = util.promisify(db.query).bind(db);

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await query(
      "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
      [name, email, hashedPassword, "user"]
    );

    res.status(201).json({ message: "User Registered Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Provide email & password" });

    const users = await query("SELECT * FROM users WHERE email=?", [email]);
    if (users.length === 0)
      return res.status(400).json({ message: "Invalid email or password" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login Successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {
    // 🔹 Use req.userId populated by middleware
    const userId = req.userId;
    const { name, email } = req.body;

    if (!name || !email)
      return res.status(400).json({ message: "All fields are required" });

    // Check for duplicate email
    const existing = await query(
      "SELECT * FROM users WHERE email = ? AND id != ?",
      [email, userId]
    );
    if (existing.length > 0)
      return res.status(400).json({ message: "Email already in use" });

    // Update user
    await query("UPDATE users SET name = ?, email = ? WHERE id = ?", [
      name,
      email,
      userId,
    ]);

    // Fetch updated user info
    const updatedUser = await query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [userId]
    );

    res.json({ user: updatedUser[0], message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};