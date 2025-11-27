import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(() => {
    const stored = localStorage.getItem("selectedUser");
    return stored ? JSON.parse(stored) : null;
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ✅ Sync with localStorage
  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
    }
  }, [selectedUser]);

  const handle_us_Edit = (user) => {
    setSelectedUser(user);
  };

  const handleBack = () => {
    setSelectedUser(null);
    localStorage.removeItem("selectedUser");
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <UserContext.Provider
      value={{
        selectedUser,
        refreshTrigger,
        handle_us_Edit,
        handleBack,
        setSelectedUser,   // ✅ REQUIRED
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserStore = () => useContext(UserContext);
