// import React, { createContext, useContext, useEffect, useState } from "react";

// const AdminContext = createContext();

// export const AdminProvider = ({ children }) => {
//   const [selectedAdmin, setSelectedAdmin] = useState(() => {
//     const stored = localStorage.getItem("selectedAdmin");
//     return stored ? JSON.parse(stored) : null;
//   });

//   //  STORE RANKS FROM ADMIN DASHBOARD
//   const [guardRanks, setGuardRanks] = useState([]);

//   useEffect(() => {
//     if (selectedAdmin) {
//       localStorage.setItem("selectedAdmin", JSON.stringify(selectedAdmin));
//     }
//   }, [selectedAdmin]);

//   const handleEdit = (admin) => setSelectedAdmin(admin);

//   const handleBack = () => {
//     setSelectedAdmin(null);
//     localStorage.removeItem("selectedAdmin");
//     setGuardRanks([]);
//   };

//   return (
//     <AdminContext.Provider
//       value={{
//         selectedAdmin,
//         setSelectedAdmin,
//         handleEdit,
//         handleBack,

//         //  RANK STORE
//         guardRanks,
//         setGuardRanks,
//       }}
//     >
//       {children}
//     </AdminContext.Provider>
//   );
// };

// export const useAdminStore = () => useContext(AdminContext);

import React, { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  /* ------------------------------
        ADMIN DETAILS
  ------------------------------ */
  const [selectedAdmin, setSelectedAdmin] = useState(() => {
    const stored = localStorage.getItem("selectedAdmin");
    return stored ? JSON.parse(stored) : null;
  });

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

  /* ------------------------------
        GUARD RANK LIST
  ------------------------------ */
  const [guardRanks, setGuardRanks] = useState([]);

  /* ------------------------------
        NEW → VIP & GUARD COUNTS
  ------------------------------ */
  const [vipCount, setVipCount] = useState(0);
  const [guardCount, setGuardCount] = useState(0);

  return (
    <AdminContext.Provider
      value={{
        selectedAdmin,
        setSelectedAdmin,
        handleEdit,
        handleBack,

        // guard ranks
        guardRanks,
        setGuardRanks,

        // NEW COUNTS (used for charts in AdminDashboard.jsx)
        vipCount,
        setVipCount,

        guardCount,
        setGuardCount,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminStore = () => useContext(AdminContext);
