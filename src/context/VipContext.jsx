import React, { createContext, useContext, useEffect, useState } from "react";

const VipContext = createContext();

export const VipProvider = ({ children }) => {
  const [selectedVip, setSelectedVip] = useState(() => {
    const stored = localStorage.getItem("selectedVip");
    return stored ? JSON.parse(stored) : null;
  });

  //  Sync with localStorage
  useEffect(() => {
    if (selectedVip) {
      localStorage.setItem("selectedVip", JSON.stringify(selectedVip));
    }
  }, [selectedVip]);

  const handleEdit = (vip) => {
    setSelectedVip(vip);
  };

  const handleBack = () => {
    setSelectedVip(null);
    localStorage.removeItem("selectedVip");
  };

  return (
    <VipContext.Provider
      value={{
        selectedVip,
        handleEdit,
        handleBack,
        setSelectedVip, //  REQUIRED
      }}
    >
      {children}
    </VipContext.Provider>
  );
};

export const useVipStore = () => useContext(VipContext);
