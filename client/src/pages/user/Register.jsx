// src/pages/user/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

function Register({ setUser }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return alert("All fields required");

    try {
      const res = await API.post("/auth/register", { name, email, password });
      alert(res.data.message);

      // Optional: auto-login after registration
      const loginRes = await API.post("/auth/login", { email, password });
      setUser(loginRes.data.user);
      localStorage.setItem("currentUser", JSON.stringify(loginRes.data.user));
      localStorage.setItem("token", loginRes.data.token);

      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

// ✅ Make sure this is a default export
export default Register;