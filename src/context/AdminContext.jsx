import React, { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [selectedAdmin, setSelectedAdmin] = useState(() => {
    const stored = localStorage.getItem("selectedAdmin");
    return stored ? JSON.parse(stored) : null;
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ✅ Auto sync to localStorage
  useEffect(() => {
    if (selectedAdmin) {
      localStorage.setItem("selectedAdmin", JSON.stringify(selectedAdmin));
    }
  }, [selectedAdmin]);

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
  };

  const handleBack = () => {
    setSelectedAdmin(null);
    localStorage.removeItem("selectedAdmin");
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <AdminContext.Provider
      value={{
        selectedAdmin,
        refreshTrigger,
        handleEdit,
        handleBack,
        setSelectedAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminStore = () => useContext(AdminContext);
