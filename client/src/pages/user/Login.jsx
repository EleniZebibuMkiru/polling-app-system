import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Form.css";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill all fields!");
      return;
    }

    let loggedInUser;

    // Admin login
    if (email === "admin@example.com" && password === "admin123") {
      loggedInUser = {
        id: "admin-1", // static admin ID
        name: "Admin",
        email,
        role: "admin",
      };
      localStorage.setItem("currentUser", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      navigate("/admin");
    }

    // Regular User login
    else {
      loggedInUser = {
        id: crypto.randomUUID(), // unique ID for each user
        name: "User",
        email,
        role: "user",
      };
      localStorage.setItem("currentUser", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      navigate("/dashboard");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-box">
        <h2>Login</h2>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@mail.com"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;