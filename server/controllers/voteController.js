const util = require("util");
const db = require("../config/db");
const query = util.promisify(db.query).bind(db);

exports.getUserVotes = async (req, res) => {
  try {
    const userId = req.userId;

    const votes = await query(`
      SELECT 
        v.id AS voteId,
        p.id AS pollId,
        p.question,
        v.option_id AS optionId
      FROM votes v
      JOIN polls p ON v.poll_id = p.id
      WHERE v.user_id = ?
    `, [userId]);

    // Now get options for each poll
    for (let vote of votes) {
      const options = await query(
        "SELECT id, option_text FROM options WHERE poll_id = ?",
        [vote.pollId]
      );
      vote.options = options;
    }

    res.json(votes);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching vote history" });
  }
};