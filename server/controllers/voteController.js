const db = require("../config/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

exports.getUserVotes = async (req, res) => {
  try {
    const userId = req.userId;

    // Join polls, options, and votes to get user's vote history
    const votes = await query(
      `SELECT p.id AS poll_id, p.question, o.option_text, v.created_at AS voted_at
       FROM votes v
       JOIN polls p ON v.poll_id = p.id
       JOIN options o ON v.option_id = o.id
       WHERE v.user_id = ?`,
      [userId]
    );

    res.json(votes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};