import React, { useState, useEffect } from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import "./pollResults.css"; // ✅ Import CSS for styling

function PollResults() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("polls")) || [];
    setPolls(stored);
  }, []);

  return (
    <div className="poll-results-container">
      {/* Admin Navbar */}
      <AdminNavbar />

      {/* Page Heading */}
      <h1>Poll Results</h1>

      {/* No polls message */}
      {polls.length === 0 && (
        <p className="no-polls">No polls available.</p>
      )}

      {/* Poll Cards */}
      {polls.map(p => (
        <div key={p.id} className="poll-card">
          <h2>{p.question}</h2>
          <ul>
            {p.options.map((opt, i) => (
              <li key={i}>
                {opt.text}: {opt.votes} votes
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default PollResults;