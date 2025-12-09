import React, { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [selectedAdmin, setSelectedAdmin] = useState(() => {
    const stored = localStorage.getItem("selectedAdmin");
    return stored ? JSON.parse(stored) : null;
  });

  //  STORE RANKS FROM ADMIN DASHBOARD
  const [guardRanks, setGuardRanks] = useState([]);

  useEffect(() => {
    if (selectedAdmin) {
      localStorage.setItem("selectedAdmin", JSON.stringify(selectedAdmin));
    }
  }, [selectedAdmin]);

  const handleEdit = (admin) => setSelectedAdmin(admin);

  const handleBack = () => {
    setSelectedAdmin(null);
    localStorage.removeItem("selectedAdmin");
    setGuardRanks([]);
  };

  return (
    <AdminContext.Provider
      value={{
        selectedAdmin,
        setSelectedAdmin,
        handleEdit,
        handleBack,

        //  RANK STORE
        guardRanks,
        setGuardRanks,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminStore = () => useContext(AdminContext);
