// components/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

function AdminRoute({ user, children }) {
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />; // redirect non-admins
  }
  return children;
}

export default AdminRoute;