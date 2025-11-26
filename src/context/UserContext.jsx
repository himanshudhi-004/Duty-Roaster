import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const  handle_us_Edit = (user) => {
    setSelectedUser(user);
  };

  const handleBack = () => {
    setSelectedUser(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <UserContext.Provider
      value={{
        selectedUser,
        refreshTrigger,
        handle_us_Edit,
        handleBack,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserStore = () => useContext(UserContext);
