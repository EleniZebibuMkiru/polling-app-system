import React, { useEffect, useState } from "react";
import API from "../../api";

function PollHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/votes/history");
      setHistory(res.data);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Error fetching poll history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) return <p>Loading history...</p>;

  if (!history.length)
    return <p>You have not voted on any poll yet.</p>;

  return (
    <div>
      <h2>My Poll History</h2>
      <ul>
        {history.map((vote) => (
          <li key={vote.poll_id + vote.voted_at}>
            <strong>{vote.question}</strong> — You voted: {vote.option_text} <br />
            <small>{new Date(vote.voted_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PollHistory;