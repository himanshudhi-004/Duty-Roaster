// import React, { useEffect, useState } from "react";
// import { getAllGuard, deleteGuard } from "../api/vipform";
// import { useGuardStore } from "../context/GuardContext";
// import { toast } from "react-toastify";

// export default function GuardDetails() {
//   const { handleEdit, refreshTrigger } = useGuardStore();
//   const [guardList, setGuardList] = useState([]);

//   const [selectedRank, setSelectedRank] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");

//   /*  SEARCH STATE */
//   const [searchTerm, setSearchTerm] = useState("");

//   /* PAGINATION STATES */
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(30);

//   /* FETCH GUARDS */
//   useEffect(() => {
//     async function fetchGuards() {
//       try {
//         const data = await getAllGuard();

//         if (Array.isArray(data)) setGuardList(data);
//         else if (Array.isArray(data?.data)) setGuardList(data.data);
//         else if (Array.isArray(data?.guards)) setGuardList(data.guards);
//         else if (Array.isArray(data?.officers)) setGuardList(data.officers);
//       } catch (err) {
//         toast.error("Failed to load guards!");
//       }
//     }

//     fetchGuards();
//   }, [refreshTrigger]);

//   /* DELETE GUARD */
//   const handleDelete = async (id) => {
//     try {
//       await deleteGuard(id);
//       const updated = await getAllGuard();
//       setGuardList(Array.isArray(updated) ? updated : []);
//       toast.success("Guard deleted successfully!");
//     } catch (err) {
//       toast.error("Failed to delete guard!");
//     }
//   };

//   /* FILTER OPTIONS */
//   const ranks = [...new Set(guardList.map((g) => g.rank || "Uncategorized"))];

//   const filteredGuards = guardList.filter((g) => {
//     const rankMatch = selectedRank ? g.rank === selectedRank : true;
//     const statusMatch = selectedStatus ? g.status === selectedStatus : true;

//     /*  SEARCH FILTER */
//     const searchMatch = searchTerm
//       ? Object.values(g)
//           .join(" ")
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       : true;

//     return rankMatch && statusMatch && searchMatch;
//   });

//   /* PAGINATION */
//   const totalPages = Math.ceil(filteredGuards.length / rowsPerPage);

//   const currentData = filteredGuards.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const goToPage = (page) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };

//   return (
//     <div style={styles.page}>
//       {/* HEADER */}
//       <div style={styles.headerRow}>
//         <h2 style={styles.title}>Guard Records</h2>

//         <div style={styles.totalBox}>
//           <span style={styles.totalNumber}>{guardList.length}</span>
//           <span style={styles.totalLabel}>Total Guards</span>
//         </div>
//       </div>

//       {/* FILTER ROW */}
//       <div style={styles.filterRow}>
//         <div style={styles.filterCard}>
//           <label style={styles.filterLabel}>Rank</label>
//           <select
//             value={selectedRank}
//             onChange={(e) => {
//               setSelectedRank(e.target.value);
//               setCurrentPage(1);
//             }}
//             style={styles.select}
//           >
//             <option value="">All</option>
//             {ranks.map((r, i) => (
//               <option key={i}>{r}</option>
//             ))}
//           </select>
//         </div>

//         <div style={styles.filterCard}>
//           <label style={styles.filterLabel}>Status</label>
//           <select
//             value={selectedStatus}
//             onChange={(e) => {
//               setSelectedStatus(e.target.value);
//               setCurrentPage(1);
//             }}
//             style={styles.select}
//           >
//             <option value="">All</option>
//             <option>Active</option>
//             <option>Inactive</option>
//           </select>
//         </div>

//         {/*  SEARCH INPUT (ONLY ADDITION) */}
//         <div style={styles.filterCard}>
//           <label style={styles.filterLabel}>Search</label>
//           <input
//             type="text"
//             placeholder="Search by name, email, id..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//             style={styles.select}
//           />
//         </div>
//       </div>

//       {/* TABLE */}
//       <div style={styles.tableCard}>
//         {currentData.length === 0 ? (
//           <div style={styles.noData}>No Guards Found</div>
//         ) : (
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>#</th>
//                 <th style={styles.th}>Name</th>
//                 <th style={styles.th}>Email</th>
//                 <th style={styles.th}>Rank</th>
//                 <th style={styles.th}>Experience</th>
//                 <th style={styles.th}>Contact</th>
//                 <th style={styles.th}>Status</th>
//                 <th style={styles.th}>Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {currentData.map((g, i) => {
//                 const statusStyle =
//                   g.status === "Active"
//                     ? styles.statusActive
//                     : styles.statusInactive;

//                 return (
//                   <tr key={i} style={styles.row}>
//                     <td style={styles.td}>{i + 1 + (currentPage - 1) * rowsPerPage}</td>
//                     <td style={styles.td}>{g.name}</td>
//                     <td style={styles.td}>{g.email}</td>
//                     <td style={styles.td}>
//                       <span style={styles.rankBadge}>{g.rank}</span>
//                     </td>
//                     <td style={styles.td}>{g.experience}</td>
//                     <td style={styles.td}>{g.contactno}</td>
//                     <td style={styles.td}>
//                       <span style={statusStyle}>{g.status}</span>
//                     </td>

//                     <td style={styles.actionCol}>
//                       <button
//                         style={styles.editBtn}
//                         onClick={() => handleEdit(g)}
//                       >
//                         <i className="fa fa-edit"></i>
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}

//         {/* PAGINATION */}
//         {totalPages > 1 && (
//           <div style={styles.paginationContainer}>
//             <button
//               disabled={currentPage === 1}
//               style={styles.pageBtn}
//               onClick={() => goToPage(currentPage - 1)}
//             >
//               Prev
//             </button>

//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 style={{
//                   ...styles.pageBtn,
//                   ...(currentPage === i + 1 ? styles.activePage : {}),
//                 }}
//                 onClick={() => goToPage(i + 1)}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             <button
//               disabled={currentPage === totalPages}
//               style={styles.pageBtn}
//               onClick={() => goToPage(currentPage + 1)}
//             >
//               Next
//             </button>

//             <select
//               value={rowsPerPage}
//               style={styles.rowsSelect}
//               onChange={(e) => {
//                 setRowsPerPage(Number(e.target.value));
//                 setCurrentPage(1);
//               }}
//             >
//               <option value={30}>30 / Page</option>
//               <option value={20}>20 / Page</option>
//               <option value={10}>10 / Page</option>
//             </select>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// /* -------- STYLES -------- */
// const styles = {
//   page: { width: "100%", padding: "0px", margin: 0, background: "#fff" },
//   headerRow: { display: "flex", justifyContent: "space-between", padding: "10px 20px" },
//   title: { fontSize: 28, fontWeight: 800, color: "#1967d2" },

//   totalBox: {
//     display: "flex", alignItems: "center", gap: 10, background: "#e8f1ff",
//     padding: "12px 18px", borderRadius: 12,
//   },
//   totalNumber: { fontSize: 26, fontWeight: 800, color: "#1967d2" },
//   totalLabel: { fontSize: 15, fontWeight: 600, color: "#1967d2" },

//   filterRow: { display: "flex", gap: 20, padding: "0 20px", marginBottom: 20 },
//   filterCard: {
//     flex: 1, background: "#fff", padding: 15, borderRadius: 12,
//     boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
//   },
//   filterLabel: { fontSize: 15, fontWeight: 600, marginBottom: 6 },
//   select: { width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid #1a73e8" },

//   tableCard: {
//     width: "100%", background: "#fff", padding: "10px 20px",
//     borderRadius: 12, boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
//   },
//   table: { width: "100%", borderCollapse: "collapse" },
//   th: { background: "#f4f4f6", padding: "14px 10px", textAlign: "left", fontWeight: 700 },
//   td: { padding: "12px 10px", borderBottom: "1px solid #eee" },
//   row: { height: 50, transition: "0.25s" },

//   rankBadge: { background: "#d7ecff", padding: "6px 12px", borderRadius: 8, color: "#005bb7", fontWeight: 600 },
//   actionCol: { display: "flex", gap: 10 },

//   editBtn: { background: "#28a745", padding: "7px 12px", borderRadius: 6, color: "#fff", border: 0, marginTop: 7 },

//   statusActive: { background: "#e6ffe6", padding: "5px 12px", borderRadius: 20, color: "#2e7d32", fontWeight: 600 },
//   statusInactive: { background: "#ffe6e6", padding: "5px 12px", borderRadius: 20, color: "#d32f2f", fontWeight: 600 },

//   noData: { textAlign: "center", padding: 40, fontSize: 18, color: "#888" },

//   paginationContainer: { display: "flex", justifyContent: "center", gap: 10, padding: 15 },
//   pageBtn: {
//     padding: "6px 14px", borderRadius: 6, border: "1px solid #1967d2",
//     background: "white", cursor: "pointer",
//   },
//   activePage: { background: "#1967d2", color: "white", fontWeight: 700 },
//   rowsSelect: { padding: "6px 14px", borderRadius: 6, border: "1px solid #1967d2" },
// };


import React, { useEffect, useState } from "react";
import { getAllGuard, deleteGuard } from "../api/vipform";
import { useGuardStore } from "../context/GuardContext";
import { toast } from "react-toastify";

export default function GuardDetails() {
  const { handleEdit, refreshTrigger } = useGuardStore();
  const [guardList, setGuardList] = useState([]);

  const [selectedRank, setSelectedRank] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  /* FETCH DATA */
  useEffect(() => {
    async function fetchGuards() {
      try {
        const data = await getAllGuard();

        if (Array.isArray(data)) setGuardList(data);
        else if (Array.isArray(data?.data)) setGuardList(data.data);
        else if (Array.isArray(data?.guards)) setGuardList(data.guards);
        else if (Array.isArray(data?.officers)) setGuardList(data.officers);
      } catch (err) {
        toast.error("Failed to load guards!");
      }
    }

    fetchGuards();
  }, [refreshTrigger]);

  /* DELETE */
  const handleDelete = async (id) => {
    try {
      await deleteGuard(id);
      const updated = await getAllGuard();
      setGuardList(Array.isArray(updated) ? updated : []);
      toast.success("Guard deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete guard!");
    }
  };

  /* FILTER */
  const ranks = [...new Set(guardList.map((g) => g.rank || "Uncategorized"))];

  const filteredGuards = guardList.filter((g) => {
    const rankMatch = selectedRank ? g.rank === selectedRank : true;
    const statusMatch = selectedStatus ? g.status === selectedStatus : true;

    const searchMatch = searchTerm
      ? Object.values(g)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true;

    return rankMatch && statusMatch && searchMatch;
  });

  /* PAGINATION LOGIC */
  const totalPages = Math.ceil(filteredGuards.length / rowsPerPage);

  const currentData = filteredGuards.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  /* SHIFT PAGINATION: ONLY 2 NUMBERS */
  const pageWindow = 2;

  const startPage = Math.max(
    1,
    currentPage - Math.floor(pageWindow / 2)
  );

  const endPage = Math.min(totalPages, startPage + pageWindow - 1);

  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Guard Records</h2>
        <div style={styles.totalBox}>
          <span style={styles.totalNumber}>{guardList.length}</span>
          <span style={styles.totalLabel}>Total Guards</span>
        </div>
      </div>

      {/* FILTERS */}
      <div style={styles.filterRow}>
        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Rank</label>
          <select
            value={selectedRank}
            onChange={(e) => {
              setSelectedRank(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.select}
          >
            <option value="">All</option>
            {ranks.map((r, i) => (
              <option key={i}>{r}</option>
            ))}
          </select>
        </div>

        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.select}
          >
            <option value="">All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Search</label>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.select}
          />
        </div>
      </div>

      {/* TABLE */}
      <div style={styles.tableCard}>
        {currentData.length === 0 ? (
          <div style={styles.noData}>No Guards Found</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Rank</th>
                <th style={styles.th}>Experience</th>
                <th style={styles.th}>Contact</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((g, i) => (
                <tr key={i} style={styles.row}>
                  <td style={styles.td}>
                    {i + 1 + (currentPage - 1) * rowsPerPage}
                  </td>
                  <td style={styles.td}>{g.name}</td>
                  <td style={styles.td}>{g.email}</td>
                  <td style={styles.td}>
                    <span style={styles.rankBadge}>{g.rank}</span>
                  </td>
                  <td style={styles.td}>{g.experience}</td>
                  <td style={styles.td}>{g.contactno}</td>
                  <td style={styles.td}>
                    <span
                      style={
                        g.status === "Active"
                          ? styles.statusActive
                          : styles.statusInactive
                      }
                    >
                      {g.status}
                    </span>
                  </td>
                  <td style={styles.actionCol}>
                    <button
                      style={styles.editBtn}
                      onClick={() => handleEdit(g)}
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={styles.paginationContainer}>
            <button
              disabled={currentPage === 1}
              style={styles.pageBtn}
              onClick={() => goToPage(currentPage - 1)}
            >
              Prev
            </button>

            {visiblePages.map((page) => (
              <button
                key={page}
                style={{
                  ...styles.pageBtn,
                  ...(currentPage === page ? styles.activePage : {}),
                }}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              style={styles.pageBtn}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next
            </button>

            <select
              value={rowsPerPage}
              style={styles.rowsSelect}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={30}>30 / Page</option>
              <option value={20}>20 / Page</option>
              <option value={10}>10 / Page</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: { width: "100%", padding: "0px", margin: 0, background: "#fff" },
  headerRow: { display: "flex", justifyContent: "space-between", padding: "10px 20px" },
  title: { fontSize: 28, fontWeight: 800, color: "#1967d2" },

  totalBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#e8f1ff",
    padding: "12px 18px",
    borderRadius: 12,
  },
  totalNumber: { fontSize: 26, fontWeight: 800, color: "#1967d2" },
  totalLabel: { fontSize: 15, fontWeight: 600, color: "#1967d2" },

  filterRow: { display: "flex", gap: 20, padding: "0 20px", marginBottom: 20 },
  filterCard: {
    flex: 1,
    background: "#fff",
    padding: 15,
    borderRadius: 12,
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  },
  filterLabel: { fontSize: 15, fontWeight: 600, marginBottom: 6 },
  select: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1.5px solid #1a73e8",
  },

  tableCard: {
    width: "100%",
    background: "#fff",
    padding: "10px 20px",
    borderRadius: 12,
    boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { background: "#f4f4f6", padding: "14px 10px", textAlign: "left", fontWeight: 700 },
  td: { padding: "12px 10px", borderBottom: "1px solid #eee" },
  row: { height: 50 },

  rankBadge: {
    background: "#d7ecff",
    padding: "6px 12px",
    borderRadius: 8,
    color: "#005bb7",
    fontWeight: 600,
  },
  actionCol: { display: "flex", gap: 10 },

  editBtn: {
    background: "#28a745",
    padding: "7px 12px",
    borderRadius: 6,
    color: "#fff",
    border: 0,
  },

  statusActive: {
    background: "#e6ffe6",
    padding: "5px 12px",
    borderRadius: 20,
    color: "#2e7d32",
    fontWeight: 600,
  },
  statusInactive: {
    background: "#ffe6e6",
    padding: "5px 12px",
    borderRadius: 20,
    color: "#d32f2f",
    fontWeight: 600,
  },

  noData: { textAlign: "center", padding: 40, fontSize: 18, color: "#888" },

  paginationContainer: { display: "flex", justifyContent: "center", gap: 10, padding: 15 },
  pageBtn: {
    padding: "6px 14px",
    borderRadius: 6,
    border: "1px solid #1967d2",
    background: "white",
    cursor: "pointer",
  },
  activePage: { background: "#1967d2", color: "white", fontWeight: 700 },
  rowsSelect: {
    padding: "6px 14px",
    borderRadius: 6,
    border: "1px solid #1967d2",
  },
};
