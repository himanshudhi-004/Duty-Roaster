import React, { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
  };

  const handleBack = () => {
    setSelectedAdmin(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <AdminContext.Provider
      value={{
        selectedAdmin,
        refreshTrigger,
        handleEdit,
        handleBack,
        setSelectedAdmin,       // <-- ADD THIS
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminStore = () => useContext(AdminContext);
