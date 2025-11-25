import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { adminLogout } from "../api/auth";

export default function GuardNavbar() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  //  Hide navbar only if screen < 345px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 345) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    handleResize(); // run once at load
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //  Handle Logout
  const handleLogout = (e) => {
    e.preventDefault();
    const result = guardLogout(); // remove token
    if (result.success) {
      navigate("/login");
    } else {
      console.error("Logout failed:", result.message);
    }
  };

  if (!isVisible) return null; // hide navbar below 345px

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-white border-bottom shadow-sm">
      <div className="container-fluid">
        {/* 🧭 Brand / Logo */}
        <NavLink className="navbar-brand fw-bold text-black" to="/guarddashboard">
          <img
            src="/"
            alt=""
            height="25"
            className="me-2"
          />
          {/* Admin Panel */}
        </NavLink>

        {/*  Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-controls="navbarNav"
          aria-expanded={isNavOpen ? "true" : "false"}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/*  Navbar Items */}
        <div
          className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item dropdown">
              <NavLink
                className="nav-link dropdown-toggle d-flex align-items-center"
                to="/guardprofile"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="assets/img/avtar.jpg"
                  alt="Profile"
                  className="rounded-circle me-2"
                  width="35"
                  height="35"
                />
                <span className="d-none d-sm-inline text-black">
                  Hi, <strong>Guard</strong>
                </span>
              </NavLink>

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
                  <h6 className="mb-0">Guard</h6>
                  <small className="text-muted">guard@gmail.com</small>
                </li>
                <li>
                  <div className="dropdown-divider"></div>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/guardprofile">
                    My Profile
                  </NavLink>
                </li>
                <li>
                  <div className="dropdown-divider"></div>
                </li>
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
