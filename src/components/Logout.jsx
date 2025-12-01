// src/components/Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Detect which user is logged in
    const isAdmin = localStorage.getItem("adminToken");
    const isVip = localStorage.getItem("vipToken");
    const isGuard = localStorage.getItem("guardToken");

    if (isAdmin) logoutUser("admin");
    if (isVip) logoutUser("vip");
    if (isGuard) logoutUser("guard");

    // ✅ CLEAR EVERYTHING FROM LOCAL STORAGE
    localStorage.clear();

    // ✅ Redirect to login
    navigate("/login", { replace: true });

  }, [navigate]);

  return null;
}
