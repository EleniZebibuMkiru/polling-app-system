import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/general/Navbar";
import Footer from "./components/general/Footer";

// User pages
import UserRoute from "./components/user/UserRoute";
import Home from "./pages/user/Home";
import Register from "./pages/user/Register";
import Login from "./pages/user/Login";
import UserDashboard from "./pages/user/UserDashboard";
import VotePage from "./pages/user/VotePage";
import Results from "./pages/user/Results";
import Profile from "./pages/user/Profile";
import PollHistory from "./pages/user/PollHistory";

// Admin pages
import AdminRoute from "./components/admin/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreatePoll from "./pages/admin/CreatePoll";
import ManagePolls from "./pages/admin/ManagePolls";
import PollResult from "./pages/admin/PollResult";
import ManageUsers from "./pages/admin/ManageUsers";

function App() {

  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <BrowserRouter>

      <Navbar user={user} setUser={setUser} />

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* User Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <UserRoute user={user}>
              <UserDashboard />
            </UserRoute>
          }
        />

        <Route
          path="/vote/:id"
          element={
            <UserRoute user={user}>
              <VotePage />
            </UserRoute>
          }
        />

        <Route
          path="/results"
          element={
            <UserRoute user={user}>
              <Results />
            </UserRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <UserRoute user={user}>
              <Profile user={user} />
            </UserRoute>
          }
        />

        <Route
          path="/history"
          element={
            <UserRoute user={user}>
              <PollHistory />
            </UserRoute>
          }
        />

        {/* Admin Protected */}
        <Route
          path="/admin"
          element={
            <AdminRoute user={user}>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/create"
          element={
            <AdminRoute user={user}>
              <CreatePoll />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/manage"
          element={
            <AdminRoute user={user}>
              <ManagePolls />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/results"
          element={
            <AdminRoute user={user}>
              <PollResult />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute user={user}>
              <ManageUsers />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Home />} />

      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;