// src/layouts/AdminLayout.jsx
import React from "react";
import GuardSidebar from "../components/GuardSidebar";

import SideLogoHeader from "../components/SideLogoHeader";
import Footer from "../components/Footer";
import GuardNavbar from "../components/GuardNavbar";

export default function Guardlayout({ children }) {
  return (
    <div className="wrapper">
      <GuardSidebar />
      <div className="main-panel">
        {/* <SideLogoHeader /> */}
        <GuardNavbar />
        <div className="content">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
