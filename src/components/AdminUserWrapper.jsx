import React from "react";
import Adminlayout from "../layouts/Adminlayout";
import UserLayout from "../layouts/UserLayout";

export default function AdminUserWrapper({ children }) {
  const role = localStorage.getItem("role");

  if (role === "admin") {
    return <Adminlayout>{children}</Adminlayout>;
  }

  return <UserLayout>{children}</UserLayout>;
}
