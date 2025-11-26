import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkToken, logoutUser } from "../api/auth";

export default function PrivateRoute({ children, roles }) {
  const [isValid, setIsValid] = useState(null);

  const currentRole = localStorage.getItem("role"); // admin | user | vip | guard

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Role not allowed
        if (!currentRole || !roles.includes(currentRole)) {
          setIsValid(false);
          return;
        }

        const valid = await checkToken(currentRole);
        setIsValid(valid);
      } catch (error) {
        console.error("Token check failed:", error);
        setIsValid(false);
      }
    };

    validateToken();
  }, [currentRole, roles]);

  if (isValid === null) return null; // loader optional

  if (!isValid) {
    logoutUser(currentRole);
    console.log("Redirecting to login due to invalid token or role",currentRole);
    return <Navigate to="/login" replace />;
  }

  return children;
}
