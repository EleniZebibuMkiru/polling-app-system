
import React from "react";
import { Navigate } from "react-router-dom";

function AdminRoute({ user, children }) {
  // Wait until user is loaded from localStorage
  if (user === null) {
    return <p>Loading...</p>; 
  }

  // Redirect non-admin users
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // Admin → allow access
  return children;
}

export default AdminRoute;