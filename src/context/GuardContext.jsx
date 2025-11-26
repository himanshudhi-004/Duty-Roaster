import React, { createContext, useContext, useEffect, useState } from "react";

const GuardContext = createContext();

export const GuardProvider = ({ children }) => {
  // ✅ Load from localStorage on first load
  const [selectedGuard, setSelectedGuard] = useState(() => {
    const stored = localStorage.getItem("selectedGuard");
    return stored ? JSON.parse(stored) : null;
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ✅ Auto-sync to localStorage
  useEffect(() => {
    if (selectedGuard) {
      localStorage.setItem("selectedGuard", JSON.stringify(selectedGuard));
    }
  }, [selectedGuard]);

  const handleEdit = (guard) => {
    setSelectedGuard(guard);
  };

  const handleBack = () => {
    setSelectedGuard(null);
    localStorage.removeItem("selectedGuard"); // ✅ clear on exit
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <GuardContext.Provider
      value={{
        selectedGuard,
        refreshTrigger,
        handleEdit,
        handleBack,
        setSelectedGuard,
      }}
    >
      {children}
    </GuardContext.Provider>
  );
};

export const useGuardStore = () => useContext(GuardContext);
