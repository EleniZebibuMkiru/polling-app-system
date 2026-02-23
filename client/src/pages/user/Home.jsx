import React from "react";
import "./Home.css";
import pollImg from "../../assets/images/download.jpg"; // import image

function Home() {
  return (
    <div className="home-container">

      {/* Welcome Section */}
      <div className="home-welcome">

        {/* LEFT SIDE IMAGE */}
        <div className="home-image">
          <img src={pollImg} alt="Polling system" />
        </div>

        {/* RIGHT SIDE TEXT */}
        <div className="home-text">
          <h1>Welcome to Online Polling System</h1>
          <p>
            This system allows users to easily participate in online polls.
            After registering and logging in, users can view available polls
            and vote for their preferred options. Each user is allowed to vote
            only once per poll to ensure fairness. The results of polls can be
            viewed after voting. This platform provides a fast, secure, and
            simple way to express opinions and make decisions collectively.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Home;