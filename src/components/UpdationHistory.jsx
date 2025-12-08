import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function UpdationHistory() {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedOperation, setSelectedOperation] = useState("");
  const [searchText, setSearchText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  //  TOKEN LOGIC (UNCHANGED)
  const role = localStorage.getItem("role");
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("userToken");
  const token = role === "admin" ? adminToken : userToken;

  console.log("TOKEN =>", token, "ROLE =>", role);

  //  FETCH HISTORY
  const fetchHistory = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/api/history/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHistoryList(res.data || []);
    } catch (error) {
      console.error("Fetch History Error:", error);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  /* ---------------- FILTER + SEARCH (BASED ON REAL KEYS) ---------------- */
  const operations = [...new Set(historyList.map((v) => v.operationType))];

  const filtered = historyList.filter((v) => {
    const opMatch = selectedOperation
      ? v.operationType === selectedOperation
      : true;

    const text = searchText.trim().toLowerCase();
    const searchMatch = text
      ? [
        v.operatorId,
          v.operatedBy,
          v.entityName,
          v.fieldName,
          v.oldValue,
          v.newValue,
          v.operationType,
        ].some((field) =>
          String(field || "").toLowerCase().includes(text)
        )
      : true;

    return opMatch && searchMatch;
  });

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const currentData = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Updation History</h2>

      {/* ------------ FILTERS ------------ */}
      <div style={styles.filterRow}>
        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Operation</label>
          <select
            value={selectedOperation}
            onChange={(e) => {
              setSelectedOperation(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.select}
          >
            <option value="">All</option>
            {operations.map((d, i) => (
              <option key={i}>{d}</option>
            ))}
          </select>
        </div>

        <div style={styles.filterCard}>
          <label style={styles.filterLabel}>Search</label>
          <input
            type="text"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by entity, field, value..."
            style={styles.input}
          />
        </div>
      </div>

      {/* ------------ TABLE ------------ */}
      <div style={styles.card}>
        {loading ? (
          <div style={styles.noData}>Loading...</div>
        ) : currentData.length === 0 ? (
          <div style={styles.noData}>No History Records Found</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Entities</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Old Value</th>
                  <th style={styles.th}>New Value</th>
                  <th style={styles.th}>Operated By</th>
                  <th style={styles.th}>Operator ID</th>
                  <th style={styles.th}>Time</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((item, index) => {
                  return (
                    <tr key={item.id} style={styles.row}>
                      <td style={styles.td}>
                        {index + 1 + (currentPage - 1) * rowsPerPage}
                      </td>
                      <td style={styles.td}>{item.entityName}</td>
                      
                      <td style={styles.td}>
                        <span style={styles.badge}>
                          {item.operationType}
                        </span>
                      </td>
                      <td style={styles.td}>{item.oldValue ?? "N/A"}</td>
                      <td style={styles.td}>{item.newValue ?? "N/A"}</td>
                      <td style={styles.td}>{item.operatedBy}</td>
                      <td style={styles.td}>{item.operatorId}</td>
                      <td style={styles.td}>
                        {item.time
                          ? new Date(item.time.split(".")[0]).toLocaleString("en-IN")
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* ------------ PAGINATION ------------ */}
            {totalPages > 1 && (
              <div style={styles.paginationContainer}>
                <button
                  disabled={currentPage === 1}
                  style={styles.pageBtn}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    style={{
                      ...styles.pageBtn,
                      ...(currentPage === i + 1 ? styles.activePage : {}),
                    }}
                    onClick={() => goToPage(i + 1)}
                  >
                    {i + 1}
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
        )}
      </div>
    </div>
  );
}

/*  SAME STYLE STRUCTURE */
const styles = {
  container: { padding: 30, background: "#fff" },
  title: { fontSize: 30, fontWeight: 800, marginBottom: 25, color: "#1967d2" },

  filterRow: { display: "flex", gap: 20, marginBottom: 25, flexWrap: "wrap" },
  filterCard: {
    flex: "1 1 280px",
    padding: 18,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
  },
  filterLabel: { fontSize: 15, fontWeight: 600, marginBottom: 6 },

  select: {
    width: "100%",
    padding: "12px",
    borderRadius: 8,
    border: "1.5px solid #1a73e8",
    fontSize: 15,
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1.5px solid #1a73e8",
    fontSize: 15,
  },

  card: {
    background: "#fff",
    padding: 10,
    borderRadius: 15,
    boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
  },

  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", minWidth: 1100, borderCollapse: "collapse" },

  th: {
    background: "#f4f4f6",
    padding: "14px 10px",
    borderBottom: "2px solid #ddd",
    fontWeight: 700,
  },

  row: { height: 62 },
  td: { padding: "12px 10px", borderBottom: "1px solid #eee" },

  badge: {
    background: "#d7ecff",
    padding: "6px 12px",
    borderRadius: 8,
    color: "#005bb7",
    fontWeight: 600,
  },

  noData: { textAlign: "center", padding: 40, color: "#777" },

  paginationContainer: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    marginTop: 15,
  },
  pageBtn: {
    padding: "6px 14px",
    borderRadius: 6,
    border: "1px solid #1967d2",
    background: "white",
  },
  activePage: { background: "#1967d2", color: "#fff" },
  rowsSelect: { padding: "6px 14px", borderRadius: 6 },
};
