import React from "react";
import { Navigate } from "react-router-dom";

function UserRoute({ user, children }) {

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "user") {
    return <Navigate to="/admin" />;
  }

  return children;
}

export default UserRoute;