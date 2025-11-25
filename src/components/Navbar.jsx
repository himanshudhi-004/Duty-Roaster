import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";
import axios from "axios";
import { useAdminStore } from "../context/AdminContext";
const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Navbar() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
 const { selectedAdmin } = useAdminStore();
 console.log("Navbar Selected Admin:", selectedAdmin);
  // --- Admin profile data ---
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  //  Get admin details
  useEffect(() => {
    fetchAdminProfile();  
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const res = await axios.get(`${BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profile = Array.isArray(res.data) ? res.data[0] : res.data;

      setAdminName(profile.admin_name || "Admin");
      setAdminEmail(profile.admin_email || "admin@gmail.com");

    } catch (err) {
      console.error("Navbar Profile Error:", err);
    }
  };

  //  Hide navbar only if screen < 345px
  useEffect(() => {
    const handleResize = () => {
      setIsVisible(window.innerWidth >= 345);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //  Handle Logout
  const handleLogout = (e) => {
    e.preventDefault();
    const result = logoutUser();
    if (result.success) {
      navigate("/login");
    }
  };

  if (!isVisible) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-white border-bottom shadow-sm">
      <div className="container-fluid">

        {/* Brand */}
        <NavLink className="navbar-brand fw-bold text-black" to="/admindashboard">
          <img src="/" alt="" height="25" className="me-1" />
        </NavLink>

        {/* Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Items */}
        <div className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item dropdown">

              <NavLink
                className="nav-link dropdown-toggle d-flex align-items-center"
                to="/adminprofile"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
              >
                <img
                  src="assets/img/avtar.jpg"
                  alt="Profile"
                  className="rounded-circle me-2"
                  width="35"
                  height="35"
                />
                <span className="d-none d-sm-inline text-black">
                  Hi, <strong>{adminName}</strong>
                </span>
              </NavLink>

              {/* Dropdown */}
              <ul
                className="dropdown-menu dropdown-menu-end shadow animated fadeIn"
                aria-labelledby="userDropdown"
              >
                <li className="dropdown-item-text text-center">
                  <img
                    src="assets/img/avtar.jpg"
                    alt="Profile"
                    className="rounded-circle mb-2"
                    width="60"
                    height="60"
                  />
                  <h6 className="mb-0">{adminName}</h6>
                  <small className="text-muted">{adminEmail}</small>
                </li>

                <li><div className="dropdown-divider"></div></li>

                <li>
                  <NavLink className="dropdown-item" to="/adminprofile">
                    My Profile
                  </NavLink>
                </li>

                <li><div className="dropdown-divider"></div></li>

                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                    style={{ border: "none", background: "none" }}
                  >
                    Logout
                  </button>
                </li>

              </ul>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
}
