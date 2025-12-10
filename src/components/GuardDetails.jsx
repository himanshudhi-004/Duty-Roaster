import React, { useEffect, useState, useMemo } from "react";
import { getAllGuard, deleteGuard } from "../api/vipform";
import { useGuardStore } from "../context/GuardContext";
import { toast } from "react-toastify";

export default function GuardDetails() {
  const { handleEdit, refreshTrigger } = useGuardStore();

  const [guardList, setGuardList] = useState([]);

  const [selectedRank, setSelectedRank] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchText, setSearchText] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  /*  FETCH ALL DATA ONCE (FOR PERFECT CLIENT FILTERING) */
  useEffect(() => {
    async function fetchGuards() {
      try {
        const res = await getAllGuard(0, 10000);
        setGuardList(res.content || []);
      } catch (err) {
        toast.error("Failed to load guards!");
      }
    }

    fetchGuards();
  }, [refreshTrigger]);

  /*  DELETE */
  const handleDelete = async (g) => {
    try {
      await deleteGuard(g.id);
      toast.success("Guard deleted successfully!");
      setCurrentPage(0);
    } catch (err) {
      toast.error("Failed to delete guard!");
    }
  };

  /*  COMPLETE CLIENT FILTERING: STATUS + RANK + SEARCH */
  const filteredGuards = useMemo(() => {
    return guardList.filter((g) => {
      const matchStatus = selectedStatus
        ? g.status === selectedStatus
        : true;

      const matchRank = selectedRank
        ? g.rank === selectedRank
        : true;

      const matchSearch = searchText
        ? Object.values(g)
            .join(" ")
            .toLowerCase()
            .includes(searchText.toLowerCase())
        : true;

      return matchStatus && matchRank && matchSearch;
    });
  }, [guardList, selectedStatus, selectedRank, searchText]);

  /*  STATUS SORTING */
  const sortedGuards = useMemo(() => {
    const statusOrder = {
      Inactive: 0,
      Active: 1,
      Deleted: 2,
    };

    return [...filteredGuards].sort((a, b) => {
      const aOrder = statusOrder[a.status] ?? 3;
      const bOrder = statusOrder[b.status] ?? 3;
      return aOrder - bOrder;
    });
  }, [filteredGuards]);

  /*  CLIENT PAGINATION */
  const totalPages = Math.ceil(sortedGuards.length / rowsPerPage);

  const paginatedGuards = useMemo(() => {
    const start = currentPage * rowsPerPage;
    return sortedGuards.slice(start, start + rowsPerPage);
  }, [sortedGuards, currentPage, rowsPerPage]);

  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) setCurrentPage(page);
  };

  const getVisiblePages = () => {
    return [...Array(totalPages)].map((_, i) => i);
  };

  /*  DYNAMIC RANK LIST */
  const ranks = [
    ...new Set(guardList.map((g) => g.rank || "Uncategorized")),
  ];

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Guard Records</h2>
        <div style={styles.totalBox}>
          <span style={styles.totalNumber}>{filteredGuards.length}</span>
          <span style={styles.totalLabel}>Total Guards</span>
        </div>
      </div>

      {/* FILTERS + SEARCH */}
      <div style={styles.filterRow}>
        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Rank</label>
          <select
            value={selectedRank}
            onChange={(e) => {
              setSelectedRank(e.target.value);
              setCurrentPage(0);
            }}
            style={styles.select}
          >
            <option value="">All</option>
            {ranks.map((r, i) => (
              <option key={i} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(0);
            }}
            style={styles.select}
          >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div style={{ ...styles.filterCard, flex: "2 1 300px" }}>
          <label style={styles.filterLabel}>Search</label>
          <input
            type="text"
            placeholder="Search by name, email, id, contact..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(0);
            }}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* TABLE */}
      <div style={styles.tableWrapper}>
        <div style={styles.tableCard}>
          {paginatedGuards.length === 0 ? (
            <div style={styles.noData}>No Guards Found</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Id</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Rank</th>
                  <th style={styles.th}>Experience</th>
                  <th style={styles.th}>Contact</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedGuards.map((g, i) => (
                  <tr key={g.id} style={styles.row}>
                    <td style={styles.td}>
                      {i + 1 + currentPage * rowsPerPage}
                    </td>
                    <td style={styles.td}>{g.name}</td>
                    <td style={styles.td}>{g.id}</td>
                    <td style={styles.td}>{g.email}</td>
                    <td style={styles.td}>{g.rank}</td>
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
                        <i className="fas fa-edit"></i>
                      </button>

                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(g)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* PAGINATION */}
          <div style={styles.paginationContainer}>
            <button
              disabled={currentPage === 0}
              style={styles.pageBtn}
              onClick={() => goToPage(currentPage - 1)}
            >
              Prev
            </button>

            {getVisiblePages().map((i) => (
              <button
                key={i}
                style={{
                  ...styles.pageBtn,
                  ...(currentPage === i ? styles.activePage : {}),
                }}
                onClick={() => goToPage(i)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage >= totalPages - 1}
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
                setCurrentPage(0);
              }}
            >
              <option value={20}>20 / Page</option>
              <option value={30}>30 / Page</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

/*  STYLES — COMPLETELY UNCHANGED */
const styles = {
  page: { width: "100%", background: "#fff" },
  headerRow: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", padding: "12px 20px", gap: 12 },
  title: { fontSize: 26, fontWeight: 800, color: "#1967d2" },
  totalBox: { display: "flex", alignItems: "center", gap: 10, background: "#e8f1ff", padding: "10px 18px", borderRadius: 12 },
  totalNumber: { fontSize: 22, fontWeight: 800, color: "#1967d2" },
  totalLabel: { fontSize: 15, fontWeight: 600, color: "#1967d2" },
  filterRow: { display: "flex", flexWrap: "wrap", gap: 16, padding: "0 20px 18px" },
  filterCard: { flex: "1 1 220px", background: "#fff", padding: 15, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
  filterLabel: { fontSize: 14, fontWeight: 600 },
  select: { width: "100%", marginTop: 6, padding: 10, borderRadius: 8, border: "1.5px solid #1a73e8" },
  searchInput: { width: "100%", marginTop: 6, padding: 10, borderRadius: 8, border: "1.5px solid #1967d2" },
  tableWrapper: { width: "100%", overflowX: "auto" },
  tableCard: { minWidth: 900, margin: "0 20px", background: "#fff", borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.1)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { background: "#f4f4f6", padding: 12, textAlign: "left", fontWeight: 700 },
  td: { padding: 10, borderBottom: "1px solid #eee" },
  row: { height: 48 },
  actionCol: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 7 },
  editBtn: { background: "#28a745", padding: "6px 10px", borderRadius: 6, color: "#fff", border: 0, cursor: "pointer" },
  deleteBtn: { background: "#fc4f30", padding: "6px 10px", borderRadius: 6, color: "#fff", border: 0, cursor: "pointer" },
  statusActive: { background: "#e6ffe6", padding: "4px 10px", borderRadius: 20, color: "#2e7d32", fontWeight: 600 },
  statusInactive: { background: "#ffe6e6", padding: "4px 10px", borderRadius: 20, color: "#d32f2f", fontWeight: 600 },
  noData: { textAlign: "center", padding: 30, color: "#888" },
  paginationContainer: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, padding: 15 },
  pageBtn: { padding: "6px 14px", borderRadius: 6, border: "1px solid #1967d2", background: "#fff", cursor: "pointer" },
  activePage: { background: "#1967d2", color: "#fff", fontWeight: 700 },
  rowsSelect: { padding: "6px 14px", borderRadius: 6, border: "1px solid #1967d2" },
};
