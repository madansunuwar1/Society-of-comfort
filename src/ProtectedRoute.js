import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, allowedRoles, children }) => {
  const user = JSON.parse(localStorage.getItem("user")); // Replace with your user-fetching method

  // Check if the user is authenticated and has the correct role
  if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;
