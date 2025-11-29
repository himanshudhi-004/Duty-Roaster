import React, { createContext, useContext } from "react";

/* ------------------ STATIC GUARD REQUIREMENT ------------------ */
const guardDistribution = {
  "Bollywood Actor": ["Grade A - 1", "Grade B - 1", "Grade C - 2", "Grade E - 10"],
  Cricketers: ["Grade B - 1", "Grade C - 1", "Grade D - 5", "Grade E - 10"],
  Chessmaster: ["Grade B - 1", "Grade C - 2", "Grade E - 10"],
  User: ["Grade D - 2", "Grade E - 15"],
};

const VipGuardContext = createContext();

/* ------------------ PROVIDER ------------------ */
export const VipGuardProvider = ({ children }) => {
  return (
    <VipGuardContext.Provider value={{ guardDistribution }}>
      {children}
    </VipGuardContext.Provider>
  );
};

/* ------------------ CUSTOM HOOK ------------------ */
export const useVipGuard = () => {
  return useContext(VipGuardContext);
};
