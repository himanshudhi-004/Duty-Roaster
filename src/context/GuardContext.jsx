import React, { createContext, useContext, useEffect, useState } from "react";

const GuardContext = createContext();

export const GuardProvider = ({ children }) => {
  const [selectedGuard, setSelectedGuard] = useState(() => {
    const stored = localStorage.getItem("selectedGuard");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (selectedGuard) {
      localStorage.setItem("selectedGuard", JSON.stringify(selectedGuard));
      console.log("Selected Guard stored in localStorage", selectedGuard);
    }
  }, [selectedGuard]);

  const handleEdit = (guard) => {
    setSelectedGuard(guard);
  };

  const handleBack = () => {
    setSelectedGuard(null);
    localStorage.removeItem("selectedGuard");
  };

  return (
    <GuardContext.Provider
      value={{
        selectedGuard,
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
