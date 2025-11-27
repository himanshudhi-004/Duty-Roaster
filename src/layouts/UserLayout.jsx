// src/layouts/UserLayout.jsx
import React from "react";
import Footer from "../components/Footer";
import UserNavbar from "../components/UserNavbar";
import UserSidebar from "../components/UserSidebar";

export default function UserLayout({ children }) {
  return (
    <div className="wrapper">
      <UserSidebar />
      <div className="main-panel">
        {/* <SideLogoHeader /> */}
        <UserNavbar />
        <div className="content">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
