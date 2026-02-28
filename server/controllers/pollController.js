// controllers/pollController.js
const db = require("../config/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

// ================= CREATE POLL =================
exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const userId = req.userId;

    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "Provide a question and at least 2 options" });
    }

    const pollResult = await query(
      "INSERT INTO polls (question, created_by, status) VALUES (?, ?, 'open')",
      [question, userId]
    );
    const pollId = pollResult.insertId;

    const optionValues = options.map((opt) => [pollId, opt, 0]);
    await query(
      "INSERT INTO options (poll_id, option_text, votes_count) VALUES ?",
      [optionValues]
    );

    res.status(201).json({ message: "Poll created successfully", pollId });
  } catch (err) {
    console.error("Error in createPoll:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ALL POLLS =================
exports.getPolls = async (req, res) => {
  try {
    const polls = await query("SELECT * FROM polls ORDER BY created_at DESC");
    const pollsWithOptions = await Promise.all(
      polls.map(async (poll) => {
        const options = await query(
          "SELECT id, option_text, votes_count FROM options WHERE poll_id = ?",
          [poll.id]
        );
        return {
          id: poll.id,
          question: poll.question,
          status: poll.status,
          created_by: poll.created_by,
          created_at: poll.created_at,
          options,
          votes: options.map((o) => o.votes_count),
        };
      })
    );

    res.json(pollsWithOptions);
  } catch (err) {
    console.error("Error in getPolls:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET POLL BY ID =================
exports.getPollById = async (req, res) => {
  try {
    const pollId = req.params.id;
    const polls = await query("SELECT * FROM polls WHERE id = ?", [pollId]);
    if (!polls.length) return res.status(404).json({ message: "Poll not found" });

    const poll = polls[0];
    const options = await query(
      "SELECT id, option_text, votes_count FROM options WHERE poll_id = ?",
      [pollId]
    );

    res.json({
      id: poll.id,
      question: poll.question,
      status: poll.status,
      created_by: poll.created_by,
      created_at: poll.created_at,
      options,
      votes: options.map((o) => o.votes_count),
    });
  } catch (err) {
    console.error("Error in getPollById:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= VOTE =================
exports.vote = async (req, res) => {
  try {
    const userId = req.userId;
    const { pollId, optionId } = req.body;

    if (!pollId || !optionId) {
      return res.status(400).json({ message: "pollId and optionId are required" });
    }

    const existingVote = await query(
      "SELECT * FROM votes WHERE user_id = ? AND poll_id = ?",
      [userId, pollId]
    );

    if (existingVote.length > 0) {
      return res.status(400).json({ message: "You already voted in this poll" });
    }

    await query(
      "INSERT INTO votes (user_id, poll_id, option_id) VALUES (?, ?, ?)",
      [userId, pollId, optionId]
    );

    await query(
      "UPDATE options SET votes_count = votes_count + 1 WHERE id = ?",
      [optionId]
    );

    res.json({ message: "Vote cast successfully" });
  } catch (err) {
    console.error("Error in vote:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE VOTE =================
exports.updateVote = async (req, res) => {
  try {
    const userId = req.userId;
    const { pollId, newOptionId } = req.body;

    if (!pollId || !newOptionId) {
      return res.status(400).json({ message: "pollId and newOptionId are required" });
    }

    const existingVote = await query(
      "SELECT * FROM votes WHERE user_id = ? AND poll_id = ?",
      [userId, pollId]
    );

    if (!existingVote.length) {
      return res.status(400).json({ message: "You have not voted in this poll yet" });
    }

    const oldOptionId = existingVote[0].option_id;

    await query(
      "UPDATE votes SET option_id = ? WHERE user_id = ? AND poll_id = ?",
      [newOptionId, userId, pollId]
    );

    await query(
      "UPDATE options SET votes_count = votes_count - 1 WHERE id = ?",
      [oldOptionId]
    );

    await query(
      "UPDATE options SET votes_count = votes_count + 1 WHERE id = ?",
      [newOptionId]
    );

    res.json({ message: "Vote updated successfully" });
  } catch (err) {
    console.error("Error in updateVote:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET POLL RESULTS =================
exports.getPollResults = async (req, res) => {
  try {
    const pollId = req.params.id;
    const polls = await query("SELECT * FROM polls WHERE id = ?", [pollId]);
    if (!polls.length) return res.status(404).json({ message: "Poll not found" });

    const poll = polls[0];
    const optionsDb = await query(
      "SELECT id, option_text, votes_count FROM options WHERE poll_id = ?",
      [pollId]
    );

    const totalVotes = optionsDb.reduce((sum, o) => sum + o.votes_count, 0);

    const options = optionsDb.map((opt) => ({
      id: opt.id,
      option_text: opt.option_text,
      votes: opt.votes_count,
      percentage: totalVotes > 0 ? parseFloat(((opt.votes_count / totalVotes) * 100).toFixed(2)) : 0,
    }));

    res.json({
      id: poll.id,
      question: poll.question,
      status: poll.status,
      totalVotes,
      options,
    });
  } catch (err) {
    console.error("Error in getPollResults:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= TOGGLE POLL STATUS =================
exports.toggleStatus = async (req, res) => {
  try {
    const pollId = req.params.id;
    const { status } = req.body; // 'open' or 'closed'

    if (!status) return res.status(400).json({ message: "Status is required" });

    const poll = await query("SELECT * FROM polls WHERE id = ?", [pollId]);
    if (!poll.length) return res.status(404).json({ message: "Poll not found" });

    await query("UPDATE polls SET status = ? WHERE id = ?", [status, pollId]);
    res.json({ message: `Poll ${status} successfully` });
  } catch (err) {
    console.error("Error in toggleStatus:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET USER VOTE HISTORY =================
exports.getUserHistory = async (req, res) => {
  try {
    const userId = req.userId;

    const votes = await query(
      `SELECT v.id AS voteId, v.poll_id AS pollId, v.option_id AS optionId, p.question
       FROM votes v
       JOIN polls p ON v.poll_id = p.id
       WHERE v.user_id = ?`,
      [userId]
    );

    const history = await Promise.all(
      votes.map(async (v) => {
        const options = await query(
          "SELECT id, option_text FROM options WHERE poll_id = ?",
          [v.pollId]
        );
        return { ...v, options };
      })
    );

    res.json(history);
  } catch (err) {
    console.error("Error in getUserHistory:", err);
    res.status(500).json({ message: "Server error" });
  }
};