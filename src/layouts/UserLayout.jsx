// src/layouts/UserLayout.jsx
import React from "react";
import VipSidebar from "../components/VipSidebar";

import SideLogoHeader from "../components/SideLogoHeader";
import Footer from "../components/Footer";
import VipNavbar from "../components/VipNavbar";
import UserSidebar from "../components/UserSidebar";

export default function UserLayout({ children }) {
  return (
    <div className="wrapper">
      <UserSidebar />
      <div className="main-panel">
        {/* <SideLogoHeader /> */}
        {/* <VipNavbar /> */}
        <div className="content">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
