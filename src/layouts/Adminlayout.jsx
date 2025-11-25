// src/layouts/AdminLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SideLogoHeader from "../components/SideLogoHeader";
import Footer from "../components/Footer";

export default function AdminLayout({ children }) {
  return (
    <div className="wrapper">
      <Sidebar />
      <div className="main-panel">
        {/* <SideLogoHeader /> */}
        {/* <Navbar /> */}
        <div className="content">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
