// src/components/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { loginUser } from "../api/auth"; 
import { toast } from "react-toastify";
import { FaUserShield } from "react-icons/fa";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser(loginData);

      if (response?.success) {
        toast.success("Login successful!");

        // Fetch backend role
        const backendRole = response?.res?.data?.role?.toLowerCase();
        console.log("Role from API:", backendRole);

        // Save token with role key
        if (backendRole) {
          localStorage.setItem("role", backendRole);
          localStorage.setItem(`${backendRole}Token`, response?.res?.data?.data);
          localStorage.setItem(`${backendRole}LastActive`, Date.now());

        }

        // Redirect using backend role
        if (backendRole === "admin") navigate("/admindashboard");
        else if (backendRole === "vip") navigate("/vipdashboard");
        else if (backendRole === "guard") navigate("/guarddashboard");
        else if (backendRole === "user") navigate("/userdashboard");
        else toast.error("Unauthorized role!");
      } else {
        toast.error("Invalid username or password!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafc",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "420px",
          background: "#fff",
          borderRadius: "18px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          paddingBottom: "30px",
        }}
      >
        <div
          style={{
            background: "#3B51E3",
            color: "white",
            padding: "30px 20px",
            borderTopLeftRadius: "18px",
            borderTopRightRadius: "18px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "50px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <FaUserShield />
          </div>
          <h3 style={{ margin: 0, fontWeight: "600", fontSize: "22px" }}>
            Login Here!
          </h3>
        </div>

        <form onSubmit={handleLogin} style={{ padding: "30px 30px" }}>

          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value={loginData.username}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "18px",
            }}
          />

          <div style={{ marginBottom: "18px", position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={loginData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                paddingRight: "45px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#3B51E3",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: "22px",
              fontSize: "13px",
              color: "#888",
            }}
          >
            ©2025 Dutymanagement.com
          </p>
        </form>
      </div>
    </div>
  );
}
