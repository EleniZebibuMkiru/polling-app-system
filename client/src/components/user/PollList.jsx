import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api";

function UserPollList() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/polls", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPolls(res.data);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
      }
    };

    fetchPolls();
  }, []);

  if (!polls.length) return <p>No polls available.</p>;

  return (
    <div className="poll-list-container">
      <h1>Available Polls</h1>
      <ul>
        {polls.map((poll) => (
          <li key={poll.id}>
            <Link to={`/polls/vote/${poll.id}`}>{poll.question}</Link>{" "}
            {poll.status === "closed" && <span>(Closed)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserPollList;