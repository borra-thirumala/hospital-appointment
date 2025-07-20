// // src/components/ProtectedRoute.jsx
// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ allowedRoles }) => {
//   const { user } = useAuth();

//   // Not logged in
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // Logged in but role not allowed
//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     // Redirect based on their actual role
//     if (user.role === "doctor") return <Navigate to="/doctor/dashboard" replace />;
//     if (user.role === "patient") return <Navigate to="/patient/dashboard" replace />;
//     if (user.role === "hospitalAdmin") return <Navigate to="/admin/dashboard" replace />;
//     return <Navigate to="/" replace />;
//   }

//   // All good, render the component
//   return <Outlet />;
// };

// export default ProtectedRoute;




// import { Navigate } from "react-router-dom";

// function ProtectedRoute({ children }) {
//   const token = localStorage.getItem("token");
//   return token ? children : <Navigate to="/login" />;
// }

// export default ProtectedRoute;

import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // Retrieve the current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Check if a user is logged in (currentUser exists)
  // If no user is logged in, redirect to the login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If a user is logged in, render the children (the protected content)
  // The role check for specific dashboards is handled by DashboardLayout
  // This ProtectedRoute primarily ensures *any* authenticated user can proceed.
  return children;
}

export default ProtectedRoute;

