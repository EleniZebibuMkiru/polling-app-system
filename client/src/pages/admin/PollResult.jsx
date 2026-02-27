// src/pages/admin/PollResults.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import API from "../../api";
import "./pollResults.css";

function PollResults() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchResults = async () => {
      try {
        const res = await API.get(`/polls/results/${id}`); // token auto-attached
        setPoll(res.data.poll);
        setResults(res.data.results);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
        setError(err.response?.data?.message || "Error fetching results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  if (loading) return <p>Loading poll results...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!poll) return <p>Poll not found.</p>;

  return (
    <div className="poll-results-container">
      <AdminNavbar />
      <h1>Poll Results</h1>
      <h2>{poll.question}</h2>

      {results.length === 0 ? (
        <p>No votes yet.</p>
      ) : (
        <ul>
          {results.map((opt) => (
            <li key={opt.id}>
              {opt.option_text}: {opt.votes_count} votes ({opt.percentage}%)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PollResults;