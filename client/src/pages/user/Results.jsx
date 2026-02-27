import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./Results.css";

function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must log in to view results.");
        navigate("/login");
        return;
      }

      try {
        const res = await API.get(`/polls/results/${id}`);
        setPoll(res.data);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          navigate("/login");
        } else {
          alert(err.response?.data?.message || "Error fetching results");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id, navigate]);

  if (loading) return <p>Loading results...</p>;
  if (!poll) return <p>Poll not found!</p>;

  const chartData = poll.options.map((opt) => ({
    name: opt.option_text,
    votes: opt.votes,
  }));

  return (
    <div className="results-container">
      <h2>{poll.question}</h2>
      <p>Total Votes: {poll.totalVotes}</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="votes" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Results;