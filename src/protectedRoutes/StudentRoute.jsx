import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function StudentRoute({ children }) {
  const token = localStorage.getItem("token") || localStorage.getItem("Token");
  const userRole = (localStorage.getItem("Role") || localStorage.getItem("role") || "").toLowerCase();
  const isLoggedIn = !!token;

  if (!isLoggedIn) {
    return <Navigate to="/get-started" replace />;
  }

  if (userRole !== "student") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children ? children : <Outlet />;
}