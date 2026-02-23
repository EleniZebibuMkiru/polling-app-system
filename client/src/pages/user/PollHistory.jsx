import React, { useEffect, useState } from "react";

function PollHistory() {

  const [polls, setPolls] = useState([]);
  const [votedPolls, setVotedPolls] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const storedPolls = JSON.parse(localStorage.getItem("polls")) || [];
    setPolls(storedPolls);

    // filter polls the user voted
    const history = storedPolls.filter(poll =>
      poll.votedUsers?.includes(currentUser?.email)
    );

    setVotedPolls(history);

  }, []);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        My Poll History
      </h1>

      {
        votedPolls.length === 0 ? (
          <p>You have not voted on any poll yet.</p>
        ) : (
          votedPolls.map(poll => (
            <div
              key={poll.id}
              className="border p-4 rounded mb-4 shadow"
            >
              <h2 className="text-lg font-semibold">
                {poll.question}
              </h2>

              {
                poll.options.map((opt, index) => (
                  <p key={index}>
                    {opt.text} : {opt.votes} votes
                  </p>
                ))
              }

            </div>
          ))
        )
      }

    </div>
  );
}

export default PollHistory;