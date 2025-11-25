import React, { createContext, useContext, useState } from "react";

const VipContext = createContext();

export const VipProvider = ({ children }) => {
  const [selectedVIP, setSelectedVIP] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (vip) => {
    setSelectedVIP(vip);
  };

  const handleBack = () => {
    setSelectedVIP(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <VipContext.Provider
      value={{
        selectedVIP,
        refreshTrigger,
        handleEdit,
        handleBack,
      }}
    >
      {children}
    </VipContext.Provider>
  );
};

export const useVipStore = () => useContext(VipContext);
