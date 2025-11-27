// src/layouts/AdminLayout.jsx
import React from "react";
import VipSidebar from "../components/VipSidebar";

import SideLogoHeader from "../components/SideLogoHeader";
import Footer from "../components/Footer";
import VipNavbar from "../components/VipNavbar";

export default function VipLayout({ children }) {
  return (
    <div className="wrapper">
      <VipSidebar />
      <div className="main-panel">
        {/* <SideLogoHeader /> */}
        <VipNavbar />
        <div className="content">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
