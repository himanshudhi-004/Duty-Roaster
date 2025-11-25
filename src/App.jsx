// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// CONTEXT
import { VipProvider } from "./context/VipContext";
import { GuardProvider } from "./context/GuardContext";
import { AdminProvider } from "./context/AdminContext";

// AUTH
import AdminLogin from "./components/AdminLogin";
import Logout from "./components/Logout";
import PrivateRoute from "./components/PrivateRoute";

// ADMIN
import AdminForm from "./components/AdminForm";
import AdminDashboard from "./pages/AdminDashboard";
import AdminListPage from "./pages/AdminListPage";
import AdminProfile from "./components/AdminProfile";
import AdminEditPage from "./pages/AdminEditPage";

// VIP
import VIPForm from "./components/VIPForm";
import VipListPage from "./pages/VipListPage";
import VipGuardManagement from "./components/VipGuardManagement";
import VipDashboard from "./pages/VipDashboard";
import VipLayout from "./layouts/Viplayout";
import VipProfile from "./components/VipProfile";

// GUARD
import GuardForm from "./components/GuardForm";
import GuardListPage from "./pages/GuardListPage";
import GuardDashboard from "./pages/GuardDashboard";
import GuardProfile from "./components/GuardProfile";
import Guardlayout from "./layouts/Guardlayout";

// LAYOUTS
import Adminlayout from "./layouts/Adminlayout";

// AUTO ASSIGN
import VipAutoAssign from "./pages/VipAutoAssign";

// TOAST
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GuardShift from "./components/GuardShift";

function App() {
  // Auto logout activity timer
  useEffect(() => {
    const resetActivityTimer = () => {
      localStorage.setItem("lastActiveTime", Date.now());
    };

    window.addEventListener("mousemove", resetActivityTimer);
    window.addEventListener("keydown", resetActivityTimer);

    return () => {
      window.removeEventListener("mousemove", resetActivityTimer);
      window.removeEventListener("keydown", resetActivityTimer);
    };
  }, []);

  return (
    <Router>
      <AdminProvider>
        <VipProvider>
          <GuardProvider>
            <ToastContainer position="top-right" autoClose={2000} pauseOnHover draggable theme="colored" />

            <Routes>
              {/* AUTH ROUTES */}
              <Route path="/" element={<AdminLogin />} />
              <Route path="/login" element={<AdminLogin />} />
              <Route path="/logout" element={<Logout />} />

              {/* ADMIN ROUTES */}
              <Route path="/register" element={<AdminForm />} />

              <Route
                path="/admindashboard"
                element={
                  <PrivateRoute role="admin">
                    <Adminlayout><AdminDashboard /></Adminlayout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/adminlist"
                element={
                  <PrivateRoute role="admin">
                    <Adminlayout><AdminListPage /></Adminlayout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/adminprofile"
                element={
                  <PrivateRoute role="admin">
                    <Adminlayout><AdminProfile /></Adminlayout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/adminedit"
                element={
                  <PrivateRoute role="admin">
                    <Adminlayout><AdminEditPage /></Adminlayout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/vip-auto-assign"
                element={
                  <PrivateRoute role="admin">
                    <Adminlayout><VipAutoAssign /></Adminlayout>
                  </PrivateRoute>
                }
              />

              {/* VIP ROUTES */}
              <Route
                path="/vipdashboard"
                element={
                  <PrivateRoute role="vip">
                    <VipLayout><VipDashboard /></VipLayout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/vipform"
                element={
                  <PrivateRoute role="admin">
                    <Adminlayout><VIPForm /></Adminlayout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/viplist"
                element={
                  <PrivateRoute role="admin">
                    <Adminlayout><VipListPage /></Adminlayout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/vgmang"
                element={
                  <PrivateRoute role="admin">
                    <Adminlayout><VipGuardManagement /></Adminlayout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/vipprofile"
                element={
                  <PrivateRoute role="vip">
                    <VipLayout><VipProfile /></VipLayout>
                  </PrivateRoute>
                }
              />

              {/* GUARD ROUTES */}
              <Route
                path="/guarddashboard"
                element={
                  <PrivateRoute role="guard">
                    <Guardlayout><GuardDashboard /></Guardlayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/guardshift"
                element={
                  <PrivateRoute role="guard">
                    <Guardlayout><GuardShift /></Guardlayout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/guardform"
                element={
                  <PrivateRoute role="admin">
                    <Adminlayout><GuardForm /></Adminlayout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/guardlist"
                element={
                  <PrivateRoute role="admin">
                    <Adminlayout><GuardListPage /></Adminlayout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/guardprofile"
                element={
                  <PrivateRoute role="guard">
                    <Guardlayout><GuardProfile /></Guardlayout>
                  </PrivateRoute>
                }
              />
            </Routes>
          </GuardProvider>
        </VipProvider>
      </AdminProvider>
    </Router>
  );
}

export default App;
