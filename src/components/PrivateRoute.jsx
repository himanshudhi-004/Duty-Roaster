import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkToken, logoutUser } from "../api/auth";

export default function PrivateRoute({ children, role }) {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const validateToken = () => {
      try {
        const valid = checkToken(role);
        setIsValid(valid);
      } catch (error) {
        console.error("Token check failed:", error);
        setIsValid(false);
      }
    };

    validateToken();
  }, [role]);

  if (isValid === null) return null; // loader could also be shown

  if (!isValid) {
    logoutUser(role);
    return <Navigate to={`/login`} replace />;
  }

  return children;
}
