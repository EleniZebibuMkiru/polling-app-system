import React, { useEffect, useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import "./PollHistory.css";


function PollHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // extend each vote item with editing state, result loading, etc.
  const enrichVotes = (votes) =>
    votes.map((v) => ({
      ...v,
      isEditing: false,
      newOptionId: v.optionId,
      showResults: false,
      results: null,
      resultsLoading: false,
    }));


  const fetchHistory = async () => {
    try {
      // backend route defined under voteRoutes: GET /history
      const res = await API.get("/votes/history");
      setHistory(enrichVotes(res.data));
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


  if (loading) return <p className="loading">Loading vote history...</p>;
  if (error) return <p className="error-msg">{error}</p>;
  if (!history.length) return <p className="empty">You have not voted in any polls yet.</p>;

  const handleEdit = (voteId) => {
    setHistory((h) =>
      h.map((v) =>
        v.voteId === voteId ? { ...v, isEditing: true } : v
      )
    );
  };

  const handleCancel = (voteId) => {
    setHistory((h) =>
      h.map((v) =>
        v.voteId === voteId ? { ...v, isEditing: false, newOptionId: v.optionId } : v
      )
    );
  };

  const handleOptionChange = (voteId, optionId) => {
    setHistory((h) =>
      h.map((v) =>
        v.voteId === voteId ? { ...v, newOptionId: optionId } : v
      )
    );
  };

  const handleSave = async (vote) => {
    if (vote.newOptionId === vote.optionId) {
      // nothing changed
      handleCancel(vote.voteId);
      return;
    }
    try {
      await API.put("/polls/update-vote", {
        pollId: vote.pollId,
        newOptionId: vote.newOptionId,
      });
      alert("Vote updated successfully");
      setHistory((h) =>
        h.map((v) =>
          v.voteId === vote.voteId
            ? { ...v, optionId: v.newOptionId, isEditing: false }
            : v
        )
      );
      // automatically navigate to results page after change
      navigate(`/results/${vote.pollId}`);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Failed to update vote");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        window.location.href = "/login";
      }
    }
  };

  const toggleResults = async (voteId) => {
    setHistory((h) =>
      h.map((v) => {
        if (v.voteId !== voteId) return v;
        // if already showing results, just hide
        if (v.showResults) return { ...v, showResults: false };
        // otherwise fetch if not loaded
        return { ...v, showResults: true, resultsLoading: true };
      })
    );
    const vote = history.find((v) => v.voteId === voteId);
    if (!vote) return;
    if (vote.results) return; // already have data

    try {
      const res = await API.get(`/polls/results/${vote.pollId}`);
      const data = res.data;
      // store results in history
      setHistory((h) =>
        h.map((v) =>
          v.voteId === voteId
            ? { ...v, results: data, resultsLoading: false }
            : v
        )
      );
    } catch (err) {
      console.error(err);
      setHistory((h) =>
        h.map((v) =>
          v.voteId === voteId ? { ...v, resultsLoading: false } : v
        )
      );
      alert(err.response?.data?.message || "Error fetching results");
    }
  };

  return (
    <div className="history-container">
      <h1>My Vote History</h1>
      {history.map((vote) => (
        <div key={vote.voteId} className="history-card">
          <h3 className="poll-question">{vote.question}</h3>
          <div className="vote-row">
            <label>My Vote:</label>
            <select
              value={vote.isEditing ? vote.newOptionId : vote.optionId}
              disabled={!vote.isEditing}
              onChange={(e) =>
                handleOptionChange(vote.voteId, e.target.value)
              }
            >
              {vote.options?.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.option_text}
                </option>
              ))}
            </select>
          </div>
          <div className="button-row">
            {!vote.isEditing && (
              <>
                <button
                  className="view-results-btn"
                  onClick={() => toggleResults(vote.voteId)}
                >
                  {vote.showResults ? "Hide Results" : "View Results"}
                </button>
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(vote.voteId)}
                >
                  Change Vote
                </button>
              </>
            )}
            {vote.isEditing && (
              <>
                <button
                  className="save-btn"
                  onClick={() => handleSave(vote)}
                >
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => handleCancel(vote.voteId)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
          {vote.showResults && (
            <div className="inline-results">
              <h4>Results</h4>
              {vote.resultsLoading && <p>Loading results...</p>}
              {!vote.resultsLoading && vote.results && (
                <ul>
                  {vote.results.options.map((opt) => (
                    <li key={opt.id}>
                      {opt.option_text}: {opt.votes} votes ({opt.percentage}%)
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PollHistory;