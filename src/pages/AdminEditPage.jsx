// pages/AdminEditPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../context/AdminContext";
import AdminEditForm from "../components/AdminDetailEditPage";

export default function AdminEditPage() {
  const { selectedAdmin, handleBack } = useAdminStore();
  const navigate = useNavigate();

  if (!selectedAdmin) {
    return (
      <div className="text-center mt-5 text-danger">
        <h4>No admin data found to edit.</h4>
      </div>
    );
  }

  return (
    <AdminEditForm
      adminData={selectedAdmin}
      onBack={() => {
        handleBack();
        navigate("/adminprofile");
      }}
    />
  );
}
