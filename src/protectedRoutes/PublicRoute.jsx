import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PublicRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token") || localStorage.getItem("Token");
  const userRole = (localStorage.getItem("Role") || localStorage.getItem("role") || "").toLowerCase();
  const isLoggedIn = !!token;
  const isStudentAuthRoute =
    location.pathname.startsWith("/get-started/login/student") ||
    location.pathname === "/signup";

  if (isLoggedIn && !isStudentAuthRoute) {
    // If already logged in, redirect away from public pages to the homepage.
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}