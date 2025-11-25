// src/components/Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {

    // Detect which user is logged in
    if (localStorage.getItem("adminToken")) {
      logoutUser("admin");
      navigate("/login");
    } else if (localStorage.getItem("vipToken")) {
      logoutUser("admin");
      navigate("/login");
    } else if (localStorage.getItem("guardToken")) {
      logoutUser("admin");
      navigate("/login");
    } else {
      navigate("/login");
    }

  }, [navigate]);

  return null;
}
