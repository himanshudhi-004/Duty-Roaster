import React, { createContext, useContext, useState } from "react";

const GuardContext = createContext();

export const GuardProvider = ({ children }) => {
  const [selectedGuard, setSelectedGuard] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (guard) => {
    setSelectedGuard(guard);
  };

  const handleBack = () => {
    setSelectedGuard(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <GuardContext.Provider
      value={{
        selectedGuard,
        refreshTrigger,
        handleEdit,
        handleBack,
      }}
    >
      {children}
    </GuardContext.Provider>
  );
};

export const useGuardStore = () => useContext(GuardContext);
 