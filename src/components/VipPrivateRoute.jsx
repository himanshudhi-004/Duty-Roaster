// src/components/VipPrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkTokenValidity } from "../api/vipauth";

export default function VipPrivateRoute({ children }) {
  const [isValid, setIsValid] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const valid = await checkTokenValidity();
        setIsValid(valid);
      } catch (error) {
        console.error("Token check failed:", error);
        setIsValid(false);
      }
    };

    validateToken();

    // Recheck every 1 min (optional)
    const interval = setInterval(validateToken, 60000);
    return () => clearInterval(interval);
  }, []);

  // While checking, show nothing or loader
  if (isValid === null) return null;

  // Logic:
  // - If user is valid → show requested page (children)
  // - If not logged in → redirect to /login
  if (!isValid) return <Navigate to="/viplogin" replace />;

  // Prevent redirect loops:
  // If already logged in and visiting `/viplogin`, send to `/vipdashboard`
  if (isValid && location.pathname === "/viplogin")
    return <Navigate to="/vipdashboard" replace />;

  // Otherwise show the protected content
  return children;
}
