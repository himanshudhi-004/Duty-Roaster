import React from "react";
import { useAdminStore } from "../context/AdminContext";
import AdminDetails from "../components/AdminDetails";
import AdminDetailEditPage from "../components/AdminDetailEditPage";

export default function AdminListPage() {
  const { selectedAdmin, handleBack } = useAdminStore();

  return (
    <div className="container my-3">
      {selectedAdmin ? (
        <AdminDetailEditPage adminData={selectedAdmin} onBack={handleBack} />
      ) : (
        <AdminDetails />
      )}
    </div>
  );
}
