// src/pages/user/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Form.css";

function Register({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill all fields!");
      return;
    }

    // Load existing users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Prevent duplicate emails
    if (users.find((u) => u.email === email)) {
      alert("Email already registered!");
      return;
    }

    // Create user with unique ID
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role: "user",
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setUser(newUser);

    alert(`Registered successfully! Welcome, ${name}`);
    setName(""); setEmail(""); setPassword("");
    navigate("/dashboard");
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-box">
        <h2>Register</h2>
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;