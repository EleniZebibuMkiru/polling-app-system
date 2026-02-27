// AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

function AdminRoute({ user, children }) {
  // 1️⃣ Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ Check if user is admin
  if (user.role !== "admin") {
    alert("Access denied. Admins only.");
    return <Navigate to="/" replace />;
  }

  // 3️⃣ Authorized
  return children;
}

export default AdminRoute;