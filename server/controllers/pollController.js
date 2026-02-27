const db = require("../config/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

// ================= CREATE POLL =================
exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const userId = req.userId;

    if (!question || !options || !Array.isArray(options) || options.length < 2)
      return res.status(400).json({ message: "Provide a question and at least 2 options" });

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
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ================= GET ALL POLLS =================
exports.getPolls = async (req, res) => {
  try {
    const polls = await query("SELECT * FROM polls ORDER BY created_at DESC");
    const pollsWithOptions = [];
    for (const poll of polls) {
      const options = await query(
        "SELECT id, option_text, votes_count FROM options WHERE poll_id = ?",
        [poll.id]
      );
      pollsWithOptions.push({
        id: poll.id,
        question: poll.question,
        status: poll.status,
        created_by: poll.created_by,
        created_at: poll.created_at,
        options,
        votes: options.map((o) => o.votes_count),
      });
    }
    res.json(pollsWithOptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
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
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ================= VOTE =================
exports.vote = async (req, res) => {
  try {
    const { optionId } = req.body;
    const userId = req.userId;

    if (!optionId) return res.status(400).json({ message: "Option ID required" });

    const option = await query("SELECT poll_id FROM options WHERE id = ?", [optionId]);
    if (!option.length) return res.status(404).json({ message: "Option not found" });

    const pollId = option[0].poll_id;

    // Check if already voted
    const hasVoted = await query(
      "SELECT * FROM votes WHERE poll_id = ? AND user_id = ?",
      [pollId, userId]
    );
    if (hasVoted.length > 0)
      return res.status(400).json({ message: "You have already voted" });

    await query("INSERT INTO votes (poll_id, user_id, option_id) VALUES (?, ?, ?)", [
      pollId,
      userId,
      optionId,
    ]);
    await query("UPDATE options SET votes_count = votes_count + 1 WHERE id = ?", [optionId]);

    res.json({ message: "Vote recorded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
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
      percentage:
        totalVotes > 0 ? parseFloat(((opt.votes_count / totalVotes) * 100).toFixed(2)) : 0,
    }));

    res.json({
      id: poll.id,
      question: poll.question,
      status: poll.status,
      totalVotes,
      options,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ================= TOGGLE POLL STATUS =================
exports.toggleStatus = async (req, res) => {
  try {
    const pollId = req.params.id;
    const { status } = req.body; // 'open' or 'closed'

    const poll = await query("SELECT * FROM polls WHERE id = ?", [pollId]);
    if (!poll.length) return res.status(404).json({ message: "Poll not found" });

    await query("UPDATE polls SET status = ? WHERE id = ?", [status, pollId]);
    res.json({ message: `Poll ${status} successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};