// src/pages/user/PollHistory.jsx
import React, { useEffect, useState } from "react";
import API from "../../api";
import "./PollHistory.css";

function PollHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingVote, setUpdatingVote] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await API.get("/polls/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleChangeVote = async (voteId, pollId, newOptionId) => {
    if (!newOptionId) return;
    setUpdatingVote(voteId);
    setError("");
    setSuccess("");

    try {
      await API.put(
        "/polls/update-vote",
        { pollId, newOptionId: parseInt(newOptionId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Vote updated successfully!");
      fetchHistory();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update vote");
    } finally {
      setUpdatingVote(null);
    }
  };

  if (loading) return <p className="loading">Loading vote history...</p>;
  if (!history.length) return <p className="empty">You have not voted in any polls yet.</p>;

  return (
    <div className="history-container">
      <h1>My Vote History</h1>

      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}

      {history.map((vote) => (
        <div key={vote.voteId} className="history-card">
          <h3 className="poll-question">{vote.question}</h3>
          <div className="vote-row">
            <label>My Vote:</label>
            <select
              value={vote.optionId}
              onChange={(e) =>
                handleChangeVote(vote.voteId, vote.pollId, e.target.value)
              }
              disabled={updatingVote === vote.voteId}
            >
              {vote.options?.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.option_text}
                </option>
              ))}
            </select>
            {updatingVote === vote.voteId && <span className="updating">Updating...</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PollHistory;